import * as React from 'react';
import { useIntl } from 'react-intl';
import { NavLink } from 'react-router-dom';

import {
  Box,
  Flex,
  LinkButton,
  Typography,
  EmptyStateLayout,
  Table,
  Thead,
  Tbody,
  Th,
  Tr,
  Td,
  Tabs,
  Textarea,
  Button,
} from '@strapi/design-system';
import { Plus, Upload } from '@strapi/icons';

import { Illo } from './EmptyComponentLayout/illo';
import { SettingsModal } from './SettingsModal';

import { useLLMSApi } from '../../../hooks/useLLMSApi';

import { getTrad } from '../../../utils/getTrad';

export const Main = ({ contentTypes }) => {
  const { getLLMSContent, setLLMSContent } = useLLMSApi();

  const { formatMessage } = useIntl();
  const [LLMSData, setLLMSData] = React.useState(null);

  React.useEffect(() => {
    const fetchLLMSContent = async () => {
      const {
        data: { content },
      } = await getLLMSContent();

      setLLMSData(content);
    };

    fetchLLMSContent();
  }, []);

  const handleChange = (event) => {
    setLLMSData(event.target.value);
  };

  const handleSubmit = async () => {
    await setLLMSContent({ content: LLMSData });
  };

  const TabValues = {
    collectionTypes: 'collection-types',
    singleTypes: 'single-types',
    plugins: 'plugins',
    llms: 'llms',
  };

  return (
    <Box padding={8}>
      <Tabs.Root id="tabs" variant="simple" defaultValue={TabValues.collectionTypes}>
        <Tabs.List>
          <Tabs.Trigger value={TabValues.collectionTypes}>
            <Typography>
              {formatMessage({
                id: getTrad('SEOPage.tab.collection-type-title'),
                defaultMessage: 'Collection Types',
              })}
            </Typography>
          </Tabs.Trigger>
          <Tabs.Trigger value={TabValues.singleTypes}>
            <Typography variant="omega">
              {formatMessage({
                id: getTrad('SEOPage.tab.single-type-title'),
                defaultMessage: 'Single Types',
              })}
            </Typography>
          </Tabs.Trigger>
          <Tabs.Trigger value={TabValues.plugins}>
            <Typography variant="omega">
              {formatMessage({
                id: getTrad('SEOPage.tab.plugin-title'),
                defaultMessage: 'Plugins',
              })}
            </Typography>
          </Tabs.Trigger>
          <Tabs.Trigger value={TabValues.llms}>
            <Typography>
              {formatMessage({
                id: getTrad('SEOPage.tab.llms-title'),
                defaultMessage: 'LLMS',
              })}
            </Typography>
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value={TabValues.collectionTypes}>
          {/* TABLE */}
          <Table colCount={2} rowCount={contentTypes.collectionTypes.length}>
            <Thead>
              <Tr>
                <Th>
                  <Typography variant="sigma">
                    {formatMessage({
                      id: getTrad('SEOPage.tab-panel.column-name'),
                      defaultMessage: 'Name',
                    })}
                  </Typography>
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {contentTypes &&
              contentTypes.collectionTypes &&
              Array.isArray(contentTypes.collectionTypes) &&
              contentTypes.collectionTypes.length > 0 ? (
                contentTypes.collectionTypes.map((item) => (
                  <Tr key={item.uid}>
                    <Td>
                      <Typography textColor="neutral800">{item.globalId}</Typography>
                    </Td>
                    <Td>
                      <Flex justifyContent="right" alignItems="right">
                        {item.seo ? (
                          <SettingsModal item={item} />
                        ) : (
                          <LinkButton
                            startIcon={<Plus />}
                            variant="secondary"
                            href={`/admin/plugins/content-type-builder/content-types/${item.uid}`}
                          >
                            {formatMessage({
                              id: getTrad('SEOPage.info.add'),
                              defaultMessage: 'Add component',
                            })}
                          </LinkButton>
                        )}
                      </Flex>
                    </Td>
                  </Tr>
                ))
              ) : (
                <Box padding={8} background="neutral0">
                  <EmptyStateLayout
                    icon={<Illo />}
                    content={formatMessage({
                      id: getTrad('SEOPage.info.no-collection-types'),
                      defaultMessage: "You don't have any collection-types yet...",
                    })}
                    action={
                      <LinkButton
                        tag={NavLink}
                        to="/plugins/content-type-builder"
                        variant="secondary"
                        startIcon={<Plus />}
                      >
                        {formatMessage({
                          id: getTrad('SEOPage.info.create-collection-type'),
                          defaultMessage: 'Create your first collection-type',
                        })}
                      </LinkButton>
                    }
                  />
                </Box>
              )}
            </Tbody>
          </Table>

          {/* END TABLE */}
        </Tabs.Content>
        <Tabs.Content value={TabValues.singleTypes}>
          {/* TABLE */}
          <Table colCount={2} rowCount={contentTypes.singleTypes.length}>
            <Thead>
              <Tr>
                <Th>
                  <Typography variant="sigma">
                    {formatMessage({
                      id: getTrad('SEOPage.tab-panel.column-name'),
                      defaultMessage: 'Name',
                    })}
                  </Typography>
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {contentTypes &&
              contentTypes.singleTypes &&
              Array.isArray(contentTypes.singleTypes) &&
              contentTypes.singleTypes.length > 0 ? (
                contentTypes.singleTypes.map((item) => (
                  <Tr key={item.uid}>
                    <Td>
                      <Typography textColor="neutral800">{item.globalId}</Typography>
                    </Td>
                    <Td>
                      <Flex justifyContent="right" alignItems="right">
                        {item.seo ? (
                          <SettingsModal item={item} />
                        ) : (
                          <LinkButton
                            startIcon={<Plus />}
                            variant="secondary"
                            href={`/admin/plugins/content-type-builder/content-types/${item.uid}`}
                          >
                            {formatMessage({
                              id: getTrad('SEOPage.info.add'),
                              defaultMessage: 'Add component',
                            })}
                          </LinkButton>
                        )}
                      </Flex>
                    </Td>
                  </Tr>
                ))
              ) : (
                <Box padding={8} background="neutral0">
                  <EmptyStateLayout
                    icon={<Illo />}
                    content={formatMessage({
                      id: getTrad('SEOPage.info.no-single-types'),
                      defaultMessage: "You don't have any single-types yet...",
                    })}
                    action={
                      <LinkButton
                        tag={NavLink}
                        to="/admin/plugins/content-type-builder"
                        variant="secondary"
                        startIcon={<Plus />}
                      >
                        {formatMessage({
                          id: getTrad('SEOPage.info.create-single-type'),
                          defaultMessage: 'Create your first single-type',
                        })}
                      </LinkButton>
                    }
                  />
                </Box>
              )}
            </Tbody>
          </Table>

          {/* END TABLE */}
        </Tabs.Content>
        <Tabs.Content value={TabValues.plugins}>
          {/* TABLE */}
          <Table colCount={2} rowCount={contentTypes.plugins.length}>
            <Thead>
              <Tr>
                <Th>
                  <Typography variant="sigma">
                    {formatMessage({
                      id: getTrad('SEOPage.tab-panel.column-name'),
                      defaultMessage: 'Name',
                    })}
                  </Typography>
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {contentTypes &&
              contentTypes.plugins &&
              Array.isArray(contentTypes.plugins) &&
              contentTypes.plugins.length > 0 ? (
                contentTypes.plugins.map((item) => (
                  <Tr key={item.uid}>
                    <Td>
                      <Typography textColor="neutral800">{item.globalId}</Typography>
                    </Td>
                    <Td>
                      <Flex justifyContent="right" alignItems="right">
                        {item.seo ? (
                          <SettingsModal item={item} />
                        ) : (
                          <LinkButton
                            startIcon={<Plus />}
                            variant="secondary"
                            href={`/admin/plugins/content-type-builder/content-types/${item.uid}`}
                          >
                            {formatMessage({
                              id: getTrad('SEOPage.info.add'),
                              defaultMessage: 'Add component',
                            })}
                          </LinkButton>
                        )}
                      </Flex>
                    </Td>
                  </Tr>
                ))
              ) : (
                <Box padding={8} background="neutral0">
                  {/* NEED LOCALE */}
                  <EmptyStateLayout
                    icon={<Illo />}
                    content={formatMessage({
                      id: getTrad('SEOPage.info.no-plugin-content-type'),
                      defaultMessage: "You don't have any plugin content-type yet...",
                    })}
                  />
                </Box>
              )}
            </Tbody>
          </Table>

          {/* END TABLE */}
        </Tabs.Content>
        <Tabs.Content value={TabValues.llms}>
          {/* TABLE */}
          <Box
            padding={8}
            hasRadius
            borderColor="neutral150"
            borderWidth="1px"
            background="neutral0"
          >
            <Textarea
              placeholder="This is a content placeholder"
              name="content"
              value={LLMSData}
              onChange={handleChange}
            />
            <Button onClick={handleSubmit} startIcon={<Upload />} marginTop="4">
              Save
            </Button>
          </Box>
          {/* END TABLE */}
        </Tabs.Content>
      </Tabs.Root>
    </Box>
  );
};
