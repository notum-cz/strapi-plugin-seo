import * as React from 'react';
import { useIntl } from 'react-intl';

import get from 'lodash/get';

import { Box, Flex, Divider, Typography, EmptyStateLayout, Modal } from '@strapi/design-system';

import { Serp } from './Serp';
import { MetaChecks } from './MetaChecks';
import { KeywordCheck } from './KeywordCheck';

import { Illo } from '../../../../HomePage/Main/EmptyComponentLayout/illo';

import { getTrad } from '../../../../../utils/getTrad';

export const BrowserPreview = ({ layout, modifiedData }) => {
  const { formatMessage } = useIntl();

  const seoPropName = Object.entries(layout.attributes).find(([, attr]) => attr.type === 'component' && attr.component === 'shared.seo')[0];
  const seo = _.get(modifiedData, seoPropName, null);
  const metaTitle = get(seo, 'metaTitle', null);
  const metaDescription = get(seo, 'metaDescription', null);
  const keywords = get(seo, 'keywords', null);

  return (
    <Modal.Content labelledBy="title">
      <Modal.Header>
        <Typography fontWeight="bold" textColor="neutral800" as="h2" id="title">
          {formatMessage({
            id: getTrad('Button.browser-preview'),
            defaultMessage: 'Browser Preview',
          })}
        </Typography>
      </Modal.Header>
      <Modal.Body>
        {seo ? (
          <Flex direction="column" gap={2} alignItems="flex-start">
            {metaTitle && metaDescription && (
              <Box paddingBottom={6}>
                <Serp metaTitle={metaTitle} metaDescription={metaDescription} />
              </Box>
            )}

            <Divider marginBottom={4} width="100%" />

            {metaTitle && <MetaChecks item={metaTitle} max={60} label="title" />}
            {metaDescription && (
              <MetaChecks item={metaDescription} max={160} label="description" minLimit={true} />
            )}
            {keywords && (
              <React.Fragment>
                {metaTitle && <KeywordCheck item={metaTitle} keywords={keywords} label="title" />}

                {metaDescription && (
                  <KeywordCheck item={metaDescription} keywords={keywords} label="description" />
                )}
              </React.Fragment>
            )}
          </Flex>
        ) : (
          <Box paddingLeft={4}>
            <EmptyStateLayout
              icon={<Illo />}
              content={formatMessage({
                id: getTrad('Modal.seo-component-empty'),
                defaultMessage: 'Your SEO component is empty...',
              })}
            />
          </Box>
        )}
      </Modal.Body>
    </Modal.Content>
  );
};
