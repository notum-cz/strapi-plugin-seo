import * as React from 'react';
import { useIntl } from 'react-intl';

import isEqual from 'lodash/isEqual';
import isNull from 'lodash/isNull';

import { SEOAccordion } from '../SEOAccordion';
import { SeoCheckerContext } from '../../Summary';

import { getTrad } from '../../../../../utils/getTrad';
import { qualityVerdict } from '../../../utils/checks';

export const OpenGraphCheck = ({ openGraph, checks }) => {
  const { formatMessage } = useIntl();
  const dispatch = React.useContext(SeoCheckerContext);

  let status = {
    message: '',
    qualityVerdict: qualityVerdict.good,
  };

  React.useEffect(() => {
    if (isNull(openGraph) || openGraph === undefined) {
      status = {
        message: formatMessage({
          id: getTrad('SEOChecks.openGraphCheck.not-found'),
          defaultMessage: 'No OpenGraph tags have been found.',
        }),
        qualityVerdict: qualityVerdict.bad,
      };
    } else if (!openGraph['ogTitle'] || !openGraph['ogDescription'] || !openGraph['ogImage']) {
      status = {
        message: formatMessage({
          id: getTrad('SEOChecks.openGraphCheck.not-configured'),
          defaultMessage: 'OpenGraph minimum required tags are not configured.',
        }),
        qualityVerdict: qualityVerdict.improvements,
      };
    } else {
      status = {
        message: `${formatMessage({
          id: getTrad('SEOChecks.openGraphCheck.configured'),
          defaultMessage: 'OpenGraph tags are configured',
        })}`,
        qualityVerdict: qualityVerdict.good,
      };
    }

    if (!isEqual(status, checks.openGraph))
      dispatch({
        type: 'UPDATE_PONCTUAL',
        value: { ...status, entity: 'openGraph' },
      });
  }, []);

  return (
    <SEOAccordion
      title={formatMessage({
        id: getTrad('SEOModal.summary-title.open-graph'),
        defaultMessage: 'OpenGraph Tags',
      })}
      status={checks.openGraph}
      label={formatMessage({
        id: getTrad('SEOChecks.openGraphCheck.label'),
        defaultMessage:
          'OpenGraph tags allow you to manage the title, description & image of your posts.',
      })}
    />
  );
};
