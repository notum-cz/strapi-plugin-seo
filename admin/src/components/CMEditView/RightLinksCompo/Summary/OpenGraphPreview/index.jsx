import * as React from 'react';
import { useIntl } from 'react-intl';

import { Badge, Box, EmptyStateLayout, Flex, Modal, Typography } from '@strapi/design-system';

import { Illo } from '../../../../HomePage/Main/EmptyComponentLayout/illo';

import { getTrad } from '../../../../../utils/getTrad';
import { FacebookOGPreview } from './Facebook/index';
import { TwitterOGPreview } from './X/index';
import { LinkedInOGPreview } from './LinkedIn/index';

export const OpenGraphPreview = ({ layout, modifiedData }) => {
  const { formatMessage } = useIntl();

  const seoPropName = Object.entries(layout.attributes).find(([, attr]) => attr.type === 'component' && attr.component === 'shared.seo')[0];
  const seo = _.get(modifiedData, seoPropName, null);
  const { openGraph } = seo;

  return (
    <Modal.Content labelledBy="title">
      <Modal.Header>
        <Typography fontWeight="bold" textColor="neutral800" as="h2" id="title">
          {formatMessage({
            id: getTrad('Button.open-graph-preview'),
            defaultMessage: 'Open Graph Preview',
          })}
        </Typography>
      </Modal.Header>
      <Modal.Body>
        {openGraph['ogTitle'] && openGraph['ogDescription'] && openGraph['ogImage'] ? (
          <>
            <Flex alignItems="left" direction="column" gap={2}>
              <Flex gap={1}>
                <Badge backgroundColor="neutral150" textColor="neutral600">
                  Facebook
                </Badge>
              </Flex>
            </Flex>
            <FacebookOGPreview
              title={openGraph['ogTitle']}
              description={openGraph['ogDescription']}
              image={openGraph['ogImage']}
            />
            <Flex alignItems="left" direction="column" gap={2}>
              <Flex gap={1}>
                <Badge backgroundColor="neutral150" textColor="neutral600">
                  X (Twitter)
                </Badge>
              </Flex>
            </Flex>
            <TwitterOGPreview
              title={openGraph['ogTitle']}
              description={openGraph['ogDescription']}
              image={openGraph['ogImage']}
            />
            <Flex alignItems="left" direction="column" gap={2}>
              <Flex gap={1}>
                <Badge backgroundColor="neutral150" textColor="neutral600">
                  LinkedIn
                </Badge>
              </Flex>
            </Flex>
            <LinkedInOGPreview
              title={openGraph['ogTitle']}
              description={openGraph['ogDescription']}
              image={openGraph['ogImage']}
            />
          </>
        ) : (
          <Box paddingLeft={4}>
            <EmptyStateLayout
              icon={<Illo />}
              content={formatMessage({
                id: getTrad('Modal.seo-component-empty-open-graph'),
                defaultMessage: 'The Open Graph metadata is empty...',
              })}
            />
          </Box>
        )}
      </Modal.Body>
    </Modal.Content>
  );
};
