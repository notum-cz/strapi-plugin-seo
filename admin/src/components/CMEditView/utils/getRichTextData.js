import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import isNull from 'lodash/isNull';
import isArray from 'lodash/isArray';
import showdown from 'showdown';

import { getRichTextAndBlocksFields } from './getRichTextAndBlocksFields';
import { getRegularImageAltTexts } from './getRegularImageAltTexts';

// Initialize the markdown to HTML converter
const converter = new showdown.Converter();

/**
 * Recursive function to extract text from block fields.
 * @param {Array} blocks - The block field array containing rich content.
 * @returns {string} - Extracted text content.
 */
const extractTextFromBlocks = (blocks) => {
  let textContent = '';

  blocks.forEach((block) => {
    if (block.type === 'text' && block.text) {
      textContent += `${block.text} `;
    } else if (block.children && isArray(block.children)) {
      // Recursively extract text from children
      textContent += extractTextFromBlocks(block.children);
    }
  });

  return textContent.trim();
};

/**
 * Function to count the occurrences of images with empty alt texts in richtext content.
 * @param {string} richtext - The richtext content (Markdown or HTML).
 * @param {string} field - The field name being analyzed.
 * @returns {Object} - The count of images without alt text.
 */
const getEmptyAltCount = (richtext, field, name, isBlock = false) => {
  let htmlOccurrences = 0;
  let markdownOccurrences = 0;
  let blockOccurences = 0;

  if (isBlock && richtext) {
    richtext.forEach((element) => {
      // Check if the current element is an image and has the 'image' field

      if (element.type === 'image' && element.image) {
        if (!element.image.alternativeText) {
          blockOccurences += 1; // Increment if alternativeText is missing or empty
        }
      }
    });
  } else if (richtext) {
    // Count markdown-style empty alt texts
    markdownOccurrences = richtext.split('\n').filter((entry) => entry.includes('![](')).length;

    // Count HTML-style empty alt texts
    const htmlImages = richtext.match(/<img[^>]*\/?>/g) || [];
    htmlOccurrences = htmlImages.filter((image) => !image.includes('alt=')).length;
  }

  if (name) {
    if (name.includes('.')) {
      return {
        field: `[dynamic-zone].${name.split('.').pop()}.${field}`,
        occurences: markdownOccurrences + htmlOccurrences + blockOccurences,
      };
    }
    return {
      field: `${name}.${field}`,
      occurences: markdownOccurrences + htmlOccurrences + blockOccurences,
    };
  }
  return { field, occurences: 0 };
};

/**
 * Function to process the text in richtext and block fields, counting words and identifying empty alt texts.
 * @param {Object} base - The object containing the richtext or block data.
 * @param {string} field - The field name being analyzed.
 * @param {boolean} isBlock - Flag to check if the field is a block field.
 * @returns {Object} - Contains word array, word count, and empty alt text count.
 */
const increaseCounter = (base, field, isBlock = false, name = null) => {
  let richtext = '';
  let emptyAlts = {};

  if (isBlock) {
    // Extract text from blocks if it's a block field
    richtext = extractTextFromBlocks(base?.[field] ?? []);
    emptyAlts = getEmptyAltCount(base?.[field], field, name, true);
  } else {
    // Handle regular richtext/Markdown fields
    richtext = base?.[field] ?? '';
    emptyAlts = getEmptyAltCount(richtext, field, name);
  }

  // Check for empty alt text occurrences in the richtext

  if (richtext) {
    // Convert markdown to HTML (only for non-block fields)
    const html = isBlock ? richtext : converter.makeHtml(richtext);

    // Extract words by removing HTML tags and splitting by spaces
    const words = html
      .replace(/<\/?[^>]+(>|$)/g, '')
      .replace('\n', ' ')
      .toLowerCase()
      .split(' ')
      .filter((entry) => entry !== '' && entry !== '\n'); // Remove empty entries

    return { words, length: words.length, emptyAlts };
  }

  return { words: [], length: 0, emptyAlts };
};

/**
 * Function to build the keyword density object.
 * @param {Array} keywords - List of keywords to analyze.
 * @param {Array} words - Array of words from the richtext fields.
 */
const buildKeywordDensityObject = (keywords, words, keywordsDensity) => {
  // Initialize tempKeywordsDensity based on the provided keywordsDensity
  let tempKeywordsDensity = { ...keywordsDensity };

  // Iterate through each keyword and update the density object
  keywords.forEach((keyword) => {
    if (!isEmpty(keyword)) {
      const trimmedKeyword = keyword.trim();
      const regex = new RegExp(trimmedKeyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'); // Escape special chars in keyword
      const count = (words.join(' ').match(regex) || []).length;

      // Update the keyword density object
      if (!tempKeywordsDensity.hasOwnProperty(trimmedKeyword)) {
        tempKeywordsDensity[trimmedKeyword] = { count };
      } else {
        tempKeywordsDensity[trimmedKeyword].count += count;
      }
    }
  });

  return tempKeywordsDensity;
};

const adjustIntersections = (data) => {
  // Destructure the emptyAltCount from the input object
  const { emptyAltCount } = data;

  // Initialize a counter for the total number of occurrences
  let occurrences = 0;

  // Count the total occurrences from richTextAlts
  emptyAltCount.richTextAlts.forEach((alt) => {
    occurrences += alt.occurences;
  });

  // Count the total occurrences from blockTextAlts
  emptyAltCount.blockTextAlts.forEach((alt) => {
    occurrences += alt.occurences;
  });

  // Decrease the intersections value by the total number of occurrences
  emptyAltCount.intersections -= occurrences;

  // Return the modified data object
  return data;
};

/**
 * Main function to retrieve richtext and block field data and calculate word count and keyword density.
 * @param {Object} seo - The SEO component.
 * @param {Object} modifiedData - The modified content data.
 * @param {Object} components - The components used in the content type.
 * @param {Object} contentType - The content type definition.
 * @returns {Object} - Contains word count and keyword density.
 */
const getRichTextData = (seo, modifiedData, components, contentType) => {
  // Retrieve richtext and block fields
  const { richTextFields, blockFields } = getRichTextAndBlocksFields(
    contentType,
    components,
    modifiedData
  );

  const { intersections, altTexts } = getRegularImageAltTexts(contentType, modifiedData);

  let emptyAltCount = { intersections, richTextAlts: [], blockTextAlts: [], altTexts };

  // Track word count and keywords
  let wordCount = 0;
  let keywords = [];
  let keywordsDensity = {};

  // Extract keywords from SEO metadata
  const seoKeywords = seo?.keywords ?? '';
  if (seoKeywords) {
    keywords = seoKeywords.toLowerCase().split(','); // Split keywords by commas
  }

  // Process each richtext field to calculate word count and keyword density
  richTextFields.forEach((data) => {
    // Handle first-level richtext fields (e.g., not inside components or dynamic zones)
    if (isNull(data.field)) {
      const { words, length, emptyAlts } = increaseCounter(modifiedData, data.name);
      wordCount += length; // Add to total word count
      emptyAltCount.richTextAlts.push(emptyAlts);
      keywordsDensity = buildKeywordDensityObject(keywords, words, keywordsDensity); // Update keyword densi, keywordsDensityty
    }

    // Handle non-repeatable components that contain richtext
    else if (!data.inDz) {
      const item = get(modifiedData, data.name.split('.').pop(), '');
      if (item) {
        const isRepeatable = isArray(item);

        if (isRepeatable) {
          // Process each repeatable entry
          item.forEach((entry) => {
            const { words, length, emptyAlts } = increaseCounter(
              entry,
              data.field,
              false,
              data.name
            );
            wordCount += length;
            emptyAltCount.richTextAlts.push(emptyAlts);
            keywordsDensity = buildKeywordDensityObject(keywords, words, keywordsDensity);
          });
        } else {
          const { words, length, emptyAlts } = increaseCounter(item, data.field, false, data.name);
          wordCount += length;
          emptyAltCount.richTextAlts.push(emptyAlts);
          keywordsDensity = buildKeywordDensityObject(keywords, words, keywordsDensity);
        }
      }
    }

    // Handle dynamic zones containing richtext fields
    else {
      const components = get(modifiedData, data.inDz, []);
      if (!isEmpty(components)) {
        const richTextComponents = components.filter((x) => x.__component === data.name);

        richTextComponents.forEach((component) => {
          const item = get(component, data.field, []);
          const isRepeatable = isArray(item);

          if (isRepeatable) {
            item.forEach((entry) => {
              const { words, length, emptyAlts } = increaseCounter(
                entry,
                data.field,
                false,
                data.name
              );
              wordCount += length;
              emptyAltCount.richTextAlts.push(emptyAlts);
              keywordsDensity = buildKeywordDensityObject(keywords, words, keywordsDensity);
            });
          } else {
            const { words, length, emptyAlts } = increaseCounter(
              component,
              data.field,
              false,
              data.name
            );
            wordCount += length;
            emptyAltCount.richTextAlts.push(emptyAlts);
            keywordsDensity = buildKeywordDensityObject(keywords, words, keywordsDensity);
          }
        });
      }
    }
  });

  blockFields.forEach((data) => {
    // Handle first-level blocks fields (e.g., not inside components or dynamic zones)
    if (isNull(data.field)) {
      const { words, length, emptyAlts } = increaseCounter(modifiedData, data.name, true);
      wordCount += length; // Add to total word count
      emptyAltCount.blockTextAlts.push(emptyAlts);
      keywordsDensity = buildKeywordDensityObject(keywords, words, keywordsDensity); // Update keyword densi, keywordsDensityty
    }

    // Handle non-repeatable components that contain blocks
    else if (!data.inDz) {
      const item = get(modifiedData, data.name.split('.').pop(), '');
      if (item) {
        const isRepeatable = isArray(item);

        if (isRepeatable) {
          // Process each repeatable entry
          item.forEach((entry) => {
            const { words, length, emptyAlts } = increaseCounter(
              entry,
              data.field,
              true,
              data.name
            );
            wordCount += length;
            emptyAltCount.blockTextAlts.push(emptyAlts);
            keywordsDensity = buildKeywordDensityObject(keywords, words, keywordsDensity);
          });
        } else {
          const { words, length, emptyAlts } = increaseCounter(item, data.field, true, data.name);
          wordCount += length;
          emptyAltCount.blockTextAlts.push(emptyAlts);
          keywordsDensity = buildKeywordDensityObject(keywords, words, keywordsDensity);
        }
      }
    }

    // Handle dynamic zones containing blocks fields
    else {
      const components = get(modifiedData, data.inDz, []);
      if (!isEmpty(components)) {
        const blockComponents = components.filter((x) => x.__component === data.name);

        blockComponents.forEach((component) => {
          const item = get(component, data.field, []);
          const isRepeatable = isArray(item);

          if (isRepeatable) {
            item.forEach((entry) => {
              const { words, length, emptyAlts } = increaseCounter(
                entry,
                data.field,
                true,
                data.name
              );
              wordCount += length;
              emptyAltCount.blockTextAlts.push(emptyAlts);
              keywordsDensity = buildKeywordDensityObject(keywords, words, keywordsDensity);
            });
          } else {
            const { words, length, emptyAlts } = increaseCounter(
              component,
              data.field,
              true,
              data.name
            );
            wordCount += length;
            emptyAltCount.blockTextAlts.push(emptyAlts);
            keywordsDensity = buildKeywordDensityObject(keywords, words, keywordsDensity);
          }
        });
      }
    }
  });
  return adjustIntersections({
    wordCount,
    keywordsDensity,
    emptyAltCount,
  });
};

export { getRichTextData };
