import * as React from 'react';
import { useIntl } from 'react-intl';
import isEqual from 'lodash/isEqual';
import isNull from 'lodash/isNull';

import { formatDistance } from 'date-fns';

import { Box, Typography } from '@strapi/design-system';

import { getTrad } from '../../../../../utils/getTrad';

import { SEOAccordion } from '../SEOAccordion';

import { SeoCheckerContext } from '../../Summary';
import { qualityVerdict } from '../../../utils/checks';

export const LastUpdatedAtCheck = ({ updatedAt, checks }) => {
  const { formatMessage } = useIntl();
  const dispatch = React.useContext(SeoCheckerContext);

  let status = {
    message: formatMessage({
      id: getTrad('SEOChecks.lastUpdatedAtCheck.default'),
      defaultMessage:
        'This content was modified over a year ago! Search engines love fresh content.',
    }),
    qualityVerdict: qualityVerdict.improvements,
  };

  React.useEffect(() => {
    if (isNull(updatedAt)) {
      status = {
        message: formatMessage({
          id: getTrad('SEOChecks.lastUpdatedAtCheck.save-content'),
          defaultMessage: 'You must save this entry first.',
        }),
        qualityVerdict: qualityVerdict.bad,
      };
    } else {
      const oneYearAgo = Date.parse(new Date(new Date().setFullYear(new Date().getFullYear() - 1)));
      if (Date.parse(updatedAt) >= oneYearAgo) {
        status = {
          message: formatMessage({
            id: getTrad('SEOChecks.lastUpdatedAtCheck.success'),
            defaultMessage: 'Awesome! This content was last modified in less than an year ago!',
          }),
          qualityVerdict: qualityVerdict.good,
        };
      }
    }
    if (!isEqual(status, checks.lastUpdatedAt))
      dispatch({
        type: 'UPDATE_PONCTUAL',
        value: { ...status, entity: 'lastUpdatedAt' },
      });
  }, []);

  return (
    <SEOAccordion
      title={formatMessage({
        id: getTrad('SEOModal.summary-title.last-updated-at'),
        defaultMessage: 'Last updated at',
      })}
      label={formatMessage({
        id: getTrad('SEOChecks.lastUpdatedAtCheck.label'),
        defaultMessage:
          'Search engines love fresh content. This will check if your entry was last modified in less than an year ago.',
      })}
      status={checks.lastUpdatedAt}
      component={
        updatedAt && (
          <Box padding={4} background="neutral100">
            <Typography variant="omega">
              {formatMessage({
                id: getTrad('SEOChecks.lastUpdatedAtCheck.last'),
                defaultMessage: 'Last updated at:',
              })}{' '}
              <Typography variant="omega" fontWeight="bold">
                {' '}
                {formatDistance(new Date(updatedAt), new Date(), {
                  addSuffix: true,
                })}
              </Typography>
            </Typography>
          </Box>
        )
      }
    />
  );
};
