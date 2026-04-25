export default {
  type: 'admin',
  routes: [
    {
      method: 'GET',
      path: '/component',
      handler: 'seo.findSeoComponent',
      config: {
        policies: [],
      },
    },
    {
      method: 'POST',
      path: '/component',
      handler: 'seo.createSeoComponent',
      config: {
        policies: [],
      },
    },
    {
      method: 'GET',
      path: '/content-types',
      handler: 'seo.findContentTypes',
      config: {
        policies: [],
      },
    },
    {
      method: 'GET',
      path: '/settings',
      handler: 'settings.getSettings',
      config: { policies: [] },
    },
    {
      method: 'POST',
      path: '/settings',
      handler: 'settings.setSettings',
      config: { policies: [] },
    },
    {
      method: 'GET',
      path: '/llms',
      handler: 'llms.getContent',
      config: { policies: [] },
    },
    {
      method: 'POST',
      path: '/llms',
      handler: 'llms.setContent',
      config: { policies: [] },
    },
  ],
};
