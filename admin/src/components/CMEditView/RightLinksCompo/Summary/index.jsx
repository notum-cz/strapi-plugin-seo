import * as React from 'react';
import { useIntl } from 'react-intl';

import {
  unstable_useContentManagerContext as useContentManagerContext,
  unstable_useDocument as useDocument,
} from '@strapi/strapi/admin';
import { Box, Button, Typography, TextButton, Modal } from '@strapi/design-system';
import { Eye, ArrowRight } from '@strapi/icons';

import { reducer } from './reducer';

import { SeoChecks } from '../SeoChecks';
import { PreviewChecks } from './PreviewChecks';
import { BrowserPreview } from './BrowserPreview';
import { OpenGraphPreview } from './OpenGraphPreview';

import { getTrad } from '../../../../utils/getTrad';
import { useSettingsApi } from '../../../../hooks/useSettingsApi';
import { getRichTextData } from '../../utils/getRichTextData';
import {
  canonicalUrlPreview,
  getAlternativeTextPreview,
  getKeywordDensityPreview,
  getMetaDescriptionPreview,
  getMetaTitleCheckPreview,
  getWordCountPreview,
  lastUpdatedAtPreview,
  metaRobotPreview,
  openGraphPreview,
  structuredDataPreview,
} from '../../utils/checks';

const initialState = {
  preview: true,
};

export const SeoCheckerContext = React.createContext(null);

export const Summary = () => {
  const { formatMessage } = useIntl();
  const { getSettings } = useSettingsApi();

  const [isLoading, setIsLoading] = React.useState(true);
  const [localChecks, setLocalChecks] = React.useState({});
  const [checks, dispatch] = React.useReducer(reducer, initialState);

  const { layout, model, collectionType, id, form, contentType, components } = useContentManagerContext();
  const { values: modifiedData } = form;

  const { metaTitle, metaDescription, openGraph } = modifiedData.seo;

  const { document } = useDocument({
    model,
    collectionType,
    documentId: id,
  });

  const getAllChecks = async (layout, modifiedData, components, contentType) => {
    const { data: defaultSettings } = await getSettings();

    const seoPropName = Object.entries(layout.attributes).find(([, attr]) => attr.type === 'component' && attr.component === 'shared.seo')[0];
    const seo = _.get(modifiedData, seoPropName, null);

    const { wordCount, keywordsDensity, emptyAltCount } = getRichTextData(
      seo,
      modifiedData,
      components,
      contentType
    );

    let result = {
      ...(defaultSettings[contentType?.uid]?.seoChecks?.metaTitle && {
        metaTitle: getMetaTitleCheckPreview(seo),
      }),
      ...(defaultSettings[contentType?.uid]?.seoChecks?.wordCount && {
        wordCount: getWordCountPreview(wordCount),
      }),
      ...(defaultSettings[contentType?.uid]?.seoChecks?.metaRobots && {
        metaRobots: metaRobotPreview(seo),
      }),
      ...(defaultSettings[contentType?.uid]?.seoChecks?.openGraph && {
        openGraph: openGraphPreview(seo),
      }),
      ...(defaultSettings[contentType?.uid]?.seoChecks?.canonicalUrl && {
        canonicalUrl: canonicalUrlPreview(seo),
      }),
      ...(defaultSettings[contentType?.uid]?.seoChecks?.lastUpdatedAt && {
        lastUpdatedAt: lastUpdatedAtPreview(modifiedData),
      }),
      ...(defaultSettings[contentType?.uid]?.seoChecks?.structuredData && {
        structuredData: structuredDataPreview(seo),
      }),
      ...(defaultSettings[contentType?.uid]?.seoChecks?.metaDescription && {
        metaDescription: getMetaDescriptionPreview(seo),
      }),
      ...(defaultSettings[contentType?.uid]?.seoChecks?.alternativeText && {
        alternativeText: getAlternativeTextPreview(emptyAltCount),
      }),
      ...(defaultSettings[contentType?.uid]?.seoChecks?.keywordDensity && {
        keywordsDensity: getKeywordDensityPreview(keywordsDensity),
      }),
    };

    return result;
  };

  React.useEffect(() => {
    const fetchChecks = async () => {
      if (!(JSON.stringify(localChecks) === JSON.stringify(checks))) {
        if (checks?.preview) {
          const status = await getAllChecks(layout, modifiedData, components, contentType);

          dispatch({
            type: 'UPDATE_FOR_PREVIEW',
            value: status,
          });
        } else
          dispatch({
            type: 'UPDATE_FOR_PREVIEW',
            value: checks,
          });
        setLocalChecks(checks);
      }
    };

    fetchChecks().then(() => {
      setIsLoading(false);
    });
  }, [checks]);

  return (
    <SeoCheckerContext.Provider value={dispatch}>
      <Box paddingTop={4} width="100%">
        <Typography tag="h2" variant="sigma" textTransform="uppercase" textColor="neutral600">
          {formatMessage({
            id: getTrad('Plugin.name'),
            defaultMessage: 'SEO Plugin',
          })}
        </Typography>

        {metaTitle && metaDescription && (
          <Modal.Root>
            <Modal.Trigger>
              <Box paddingTop={1}>
                <Button fullWidth variant="secondary" startIcon={<Eye />}>
                  {formatMessage({
                    id: getTrad('Button.browser-preview'),
                    defaultMessage: 'Browser Preview',
                  })}
                </Button>
              </Box>
            </Modal.Trigger>
            <BrowserPreview layout={layout} modifiedData={modifiedData} />
          </Modal.Root>
        )}

        {openGraph && (
          <Modal.Root>
            <Modal.Trigger>
              <Box paddingTop={2}>
                <Button fullWidth variant="secondary" startIcon={<Eye />}>
                  {formatMessage({
                    id: getTrad('Button.open-graph-preview'),
                    defaultMessage: 'Open Graph Preview',
                  })}
                </Button>
              </Box>
            </Modal.Trigger>
            <OpenGraphPreview layout={layout} modifiedData={modifiedData} />
          </Modal.Root>
        )}

        {!isLoading && <PreviewChecks checks={checks} />}

        <Modal.Root>
          <Modal.Trigger>
            <Box paddingTop={4}>
              <TextButton startIcon={<ArrowRight />}>
                {formatMessage({
                  id: getTrad('Button.see-details'),
                  defaultMessage: 'SEE DETAILS',
                })}
              </TextButton>
            </Box>
          </Modal.Trigger>
          <SeoChecks
            layout={layout}
            updatedAt={document?.updatedAt ?? null}
            modifiedData={modifiedData}
            components={components}
            contentType={contentType}
            checks={checks}
          />
        </Modal.Root>
      </Box>
    </SeoCheckerContext.Provider>
  );
};
