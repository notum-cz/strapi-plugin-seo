import * as React from 'react';
import { useIntl } from 'react-intl';

import { Box } from '@strapi/design-system';
import { Information } from '@strapi/icons';
import {
  Page,
  ContentBox,
  useFetchClient,
  private_useAutoReloadOverlayBlocker as useAutoReloadOverlayBlocker,
} from '@strapi/strapi/admin';

import { Main } from '../../components/HomePage/Main';
import { Header } from '../../components/HomePage/Header';

import { getTrad } from '../../utils/getTrad';
import { pluginId } from '../../pluginId';

export const HomePage = React.memo(() => {
  const { get, post } = useFetchClient();
  const { lockAppWithAutoreload, unlockAppWithAutoreload } = useAutoReloadOverlayBlocker();

  const { formatMessage } = useIntl();
  const [isLoading, setIsLoading] = React.useState(true);
  const [shouldEffect, setShouldEffect] = React.useState(false);

  const seoComponent = React.useRef(null);
  const contentTypes = React.useRef(null);

  const fetchSeoComponent = async () => {
    try {
      const { data } = await get(`/${pluginId}/component`);

      return data;
    } catch (error) {
      return null;
    }
  };

  const fetchContentTypes = async () => {
    try {
      const { data } = await get(`/${pluginId}/content-types`);

      return data;
    } catch (error) {
      return null;
    }
  };

  const createSeoComponent = async () => {
    try {
      const data = await post(`/${pluginId}/component`);

      return data.json();
    } catch (error) {
      return null;
    }
  };

  React.useEffect(() => {
    const fetchData = async () => {
      seoComponent.current = await fetchSeoComponent();
      contentTypes.current = await fetchContentTypes();

      const hasNoSeoComponent = !seoComponent.current || seoComponent.current.length === 0;
      if (hasNoSeoComponent) {
        try {
          lockAppWithAutoreload();

          await createSeoComponent();
        } catch (error) {
          console.log(error);
        } finally {
          unlockAppWithAutoreload();

          setShouldEffect(true);
        }
      }
    };
    fetchData().then(() => {
      setIsLoading(false);
    });
  }, [shouldEffect]);

  if (isLoading) {
    return <Page.Loading />;
  }

  return (
    <React.Fragment>
      <Header seoComponent={seoComponent.current} />
      <Box paddingLeft={8} paddingRight={8}>
        <ContentBox
          title={formatMessage({
            id: 'Information',
            defaultMessage: 'Information',
          })}
          subtitle={formatMessage({
            id: getTrad('SEOPage.info.information'),
            defaultMessage:
              "When adding your SEO component, make sure to name it 'seo' and to include it in the root of your Content-Type.",
          })}
          icon={<Information />}
          iconBackground="primary100"
        />
      </Box>
      <Main contentTypes={contentTypes.current} />
    </React.Fragment>
  );
});
