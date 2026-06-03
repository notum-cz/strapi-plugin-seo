import * as React from 'react';

import { Search } from '@strapi/icons';

import pluginPkg from '../../package.json';
import { Initializer } from './components/Initializer';
import { SeoChecker } from './components/CMEditView/RightLinksCompo';
import { pluginPermissions } from './permissions';

import { pluginId } from './pluginId';
import { prefixPluginTranslations } from './utils/prefixPluginTranslations';

const name = pluginPkg.strapi.name;

export default {
  register(app) {
    app.addMenuLink({
      to: `${pluginId}`,
      icon: Search,
      permissions: pluginPermissions.main,
      intlLabel: {
        id: `${pluginId}.plugin.name`,
        defaultMessage: 'SEO',
      },
      Component: () => import('./pages/App'),
    });
    app.registerPlugin({
      id: pluginId,
      initializer: Initializer,
      isReady: false,
      name,
    });
  },
  bootstrap(app) {
    const cm = app.getPlugin('content-manager');
    const addEditViewSidePanel = cm?.apis?.addEditViewSidePanel;

    // Strapi 5 exposes a first-class side-panel API. Use it so the SEO summary
    // renders as a proper panel in the edit-view panel stack instead of the
    // legacy `right-links` injection zone, which mounts below every panel and
    // looks visually detached. Append it last so it sits under "Information".
    if (typeof addEditViewSidePanel === 'function') {
      const SeoSidePanel = () => ({
        title: 'SEO',
        content: React.createElement(SeoChecker),
      });
      addEditViewSidePanel((panels) => [...panels, SeoSidePanel]);
      return;
    }

    cm.injectComponent('editView', 'right-links', {
      name: 'SeoChecker',
      Component: SeoChecker,
    });
  },
  async registerTrads(app) {
    const { locales } = app;

    const importedTrads = await Promise.all(
      locales.map((locale) => {
        return import(`./translations/${locale}.json`)
          .then(({ default: data }) => {
            return {
              data: prefixPluginTranslations(data, pluginId),
              locale,
            };
          })
          .catch(() => {
            return {
              data: {},
              locale,
            };
          });
      })
    );

    return Promise.resolve(importedTrads);
  },
};
