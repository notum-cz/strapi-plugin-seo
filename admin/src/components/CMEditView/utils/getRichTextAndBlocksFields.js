import isArray from 'lodash/isArray';
import isObject from 'lodash/isObject';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import pull from 'lodash/pull';

// Custom-field identifiers that store richtext-equivalent content (a Markdown
// or HTML string). The word counter and alt-text scanner only look at native
// `richtext`/`blocks` attributes, so editors using a richtext custom field —
// e.g. the popular CKEditor plugins — get a 0-word count and every entry is
// flagged as under-length. Treat these as `richtext` for collection purposes.
const RICHTEXT_LIKE_CUSTOM_FIELDS = new Set([
  'plugin::ckeditor5.CKEditor',
  'plugin::ckeditor.CKEditor',
]);

const matchesType = (fieldProperties, fieldType) => {
  if (fieldProperties.type === fieldType) return true;
  return (
    fieldType === 'richtext' &&
    fieldProperties.type === 'customField' &&
    RICHTEXT_LIKE_CUSTOM_FIELDS.has(fieldProperties.customField)
  );
};

// Utility function to collect fields based on a specific type (richtext, blocks, etc.)
const collectFieldsByType = (contentType, components, fieldType) => {
  let fields = [];

  // Collect fields from the content type
  Object.entries(contentType.attributes).forEach(([field, fieldProperties]) => {
    if (matchesType(fieldProperties, fieldType)) {
      fields.push({ name: field, field: null });
    } else if (fieldProperties.type === 'component') {
      Object.entries(components[fieldProperties.component].attributes).forEach(
        ([field2, fieldProperties2]) => {
          if (matchesType(fieldProperties2, fieldType)) {
            fields.push({ name: field, field: field2 });
          }
        }
      );
    }
  });

  // Collect fields from components
  Object.entries(components).forEach(([componentName, componentData]) => {
    Object.entries(componentData.attributes).forEach(([field, fieldProperties]) => {
      if (matchesType(fieldProperties, fieldType)) {
        fields.push({ name: componentName, field });
      }
    });
  });

  return fields;
};

// Function to retrieve both richtext and blocks fields from a content-type
export const getRichTextAndBlocksFields = (contentType, components, modifiedData) => {
  let dynamicZones = [];

  // Collect dynamic zones from the content-type
  Object.entries(modifiedData).forEach(([fieldName, fieldValue]) => {
    if (isArray(fieldValue)) {
      const isComponentField = fieldValue.some((subField) => isObject(subField) && '__component' in subField);
      if (isComponentField) dynamicZones.push(fieldName);
    }
  });

  // Collect richtext fields and blocks fields
  let richTextFields = collectFieldsByType(contentType, components, 'richtext');
  let blockFields = collectFieldsByType(contentType, components, 'blocks');

  // Remove fields not present in modified data or dynamic zones
  const filterFields = (fields) => {
    dynamicZones.forEach((dz) => {
      const dynamicZoneData = get(modifiedData, dz, []);

      fields.forEach((field, index) => {
        const componentExistsInDZ = dynamicZoneData.filter((x) => x.__component === field.name);

        // If the component is in the dynamic zone but not marked as such, associate it
        if (!isEmpty(componentExistsInDZ) && !field.inDz && dynamicZoneData.find((x) => x.hasOwnProperty(field.field))) {
          fields[index] = { ...field, inDz: dz };
        }

        // If the component is not in the dynamic zone but is marked as being inside, remove it
        if (isEmpty(componentExistsInDZ) && field.inDz) {
          pull(fields, field);
        }
      });
    });
  };

  // Filter both richtext and blocks fields
  filterFields(richTextFields);
  filterFields(blockFields);

  return { richTextFields, blockFields };
};
