export default {
  type: 'content-api',
  routes: [
    {
      method: 'GET',
      path: '/llms',
      handler: 'llms.getContent',
      config: { policies: [] },
    },
  ],
};
