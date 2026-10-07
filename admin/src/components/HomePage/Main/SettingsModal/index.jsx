import * as React from 'react';
import { useIntl } from 'react-intl';

import { Cog, Information } from '@strapi/icons';
import { Box, Switch, Button, Typography, Grid, Modal } from '@strapi/design-system';
import { ContentBox, useNotification } from '@strapi/strapi/admin';

import { getTrad } from '../../../../utils/getTrad';
import { useSettingsApi } from '../../../../hooks/useSettingsApi';

export const SettingsModal = ({ item }) => {
  const { toggleNotification } = useNotification();
  const { formatMessage } = useIntl();
  const { getSettings, setSettings } = useSettingsApi();

  const [isOpen, setIsOpen] = React.useState(false);

  const [metaTitle, setMetaTitle] = React.useState(true);
  const [metaDescription, setMetaDescription] = React.useState(true);
  const [metaRobots, setMetaRobots] = React.useState(true);
  const [openGraph, setOpenGraph] = React.useState(true);
  const [wordCount, setWordCount] = React.useState(true);
  const [canonicalUrl, setCanonicalUrl] = React.useState(true);
  const [keywordDensity, setKeywordDensity] = React.useState(true);
  const [structuredData, setStructuredData] = React.useState(true);
  const [alternativeText, setAlternativeText] = React.useState(true);
  const [lastUpdatedAt, setLastUpdatedAt] = React.useState(true);

  const [defaultSettings, setDefaultSettings] = React.useState(null);

  React.useEffect(() => {
    const fetchDefaultSettings = async () => {
      const { data: defaultSettingsResult } = await getSettings();

      setDefaultSettings(defaultSettingsResult);
    };

    fetchDefaultSettings();
  }, []);

  const setupModalSettings = () => {
    const seoChecks = defaultSettings?.[item?.uid]?.seoChecks;

    if (!seoChecks) {
      return;
    }

    setMetaTitle(seoChecks?.metaTitle);
    setMetaDescription(seoChecks?.metaDescription);
    setMetaRobots(seoChecks?.metaRobots);
    setOpenGraph(seoChecks?.openGraph);
    setWordCount(seoChecks?.wordCount);
    setCanonicalUrl(seoChecks?.canonicalUrl);
    setKeywordDensity(seoChecks?.keywordDensity);
    setStructuredData(seoChecks?.structuredData);
    setAlternativeText(seoChecks?.alternativeText);
    setLastUpdatedAt(seoChecks?.lastUpdatedAt);
  };

  const handleSavingSettingsModal = () => {
    if (!defaultSettings) {
      return;
    }

    const newSettings = {
      ...defaultSettings,
      [item?.uid]: {
        collectionName: defaultSettings[item?.uid]?.collectionName,
        seoChecks: {
          metaTitle,
          metaDescription,
          metaRobots,
          openGraph,
          wordCount,
          canonicalUrl,
          keywordDensity,
          structuredData,
          alternativeText,
          lastUpdatedAt,
        },
      },
    };

    setSettings(newSettings).then(async () => {
      setDefaultSettings(newSettings);
      setIsVisible((prev) => !prev);
    });

    // NEED LOCALE
    toggleNotification({
      type: 'success',
      message: formatMessage({
        id: 'notification.success.settings',
        defaultMessage: `Settings saved for ${
          defaultSettings[item?.uid]?.collectionName
        } content-type.`,
      }),
    });
  };

  return (
    <Modal.Root open={isOpen} onOpenChange={setIsOpen}>
      <Modal.Trigger>
        <Button variant="tertiary" startIcon={<Cog />} onClick={() => setupModalSettings()}>
          {formatMessage({
            id: getTrad('SEOPage.info.settings'),
            defaultMessage: 'Settings',
          })}
        </Button>
      </Modal.Trigger>
      <Modal.Content labelledBy="title">
        <Modal.Header>
          <Typography fontWeight="bold" textColor="neutral800" as="h2" id="title">
            {formatMessage({
              id: getTrad('SEOPage.info.settings'),
              defaultMessage: 'Settings',
            })}
          </Typography>
        </Modal.Header>
        <form
          onSubmit={(event) => {
            handleSavingSettingsModal();
            setIsOpen(false);

            event.preventDefault();
          }}
        >
          <Modal.Body>
            <Box paddingBottom={4}>
              <ContentBox
                title={formatMessage({
                  id: 'Information',
                  defaultMessage: 'Information',
                })}
                subtitle={formatMessage({
                  id: getTrad('SEOPage.info.settings.information'),
                  defaultMessage: 'Disable SEO checks for this specific content-type.',
                })}
                icon={<Information />}
                iconBackground="primary100"
              />
            </Box>
            <Grid.Root gap={4}>
              {[
                {
                  state: metaTitle,
                  stateSetter: setMetaTitle,
                  id: 'meta-title-check',
                  defaultMessage: 'Meta Title',
                },
                {
                  state: metaDescription,
                  stateSetter: setMetaDescription,
                  id: 'meta-description-check',
                  defaultMessage: 'Meta Description',
                },
                {
                  state: metaRobots,
                  stateSetter: setMetaRobots,
                  id: 'meta-robots-check',
                  defaultMessage: 'Meta Robots',
                },
                {
                  state: openGraph,
                  stateSetter: setOpenGraph,
                  id: 'open-graph-check',
                  defaultMessage: 'Open Graph',
                },
                {
                  state: wordCount,
                  stateSetter: setWordCount,
                  id: 'word-count-check',
                  defaultMessage: 'Word Count',
                },
                {
                  state: canonicalUrl,
                  stateSetter: setCanonicalUrl,
                  id: 'canonical-url-check',
                  defaultMessage: 'Canonical URL',
                },
                {
                  state: keywordDensity,
                  stateSetter: setKeywordDensity,
                  id: 'keyword-density-check',
                  defaultMessage: 'Keyword Density',
                },
                {
                  state: structuredData,
                  stateSetter: setStructuredData,
                  id: 'structured-data-check',
                  defaultMessage: 'Structured Data',
                },
                {
                  state: alternativeText,
                  stateSetter: setAlternativeText,
                  id: 'alternative-text-check',
                  defaultMessage: 'Alt Text',
                },
                {
                  state: lastUpdatedAt,
                  stateSetter: setLastUpdatedAt,
                  id: 'last-updated-at-check',
                  defaultMessage: 'Last Updated At',
                },
              ].map(({ state, stateSetter, id, defaultMessage }) => {
                return (
                  <Grid.Item
                    key={id}
                    col={6}
                    s={6}
                    gap={2}
                    padding={4}
                    background="neutral0"
                    borderWidth="2px"
                    shadow="filterShadow"
                  >
                    <Switch
                      checked={state}
                      onCheckedChange={() => stateSetter((isChecked) => !isChecked)}
                    />
                    <Typography variant="delta">
                      {formatMessage({
                        id: getTrad(`SEOPage.info.settings.${id}`),
                        defaultMessage,
                      })}
                    </Typography>
                  </Grid.Item>
                );
              })}
            </Grid.Root>
          </Modal.Body>
          <Modal.Footer>
            <Modal.Close>
              <Button variant="tertiary">
                {formatMessage({
                  id: getTrad('SEOPage.info.settings.cancel.button'),
                  defaultMessage: 'Cancel',
                })}
              </Button>
            </Modal.Close>
            <Button type="submit">
              {formatMessage({
                id: getTrad('SEOPage.info.settings.save.button'),
                defaultMessage: 'Save',
              })}
            </Button>
          </Modal.Footer>
        </form>
      </Modal.Content>
    </Modal.Root>
  );
};
