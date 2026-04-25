export const llmsService = ({ strapi }) => {
  const getPluginStore = () => {
    return strapi.store({
      environment: '',
      type: 'plugin',
      name: 'seo',
    });
  };

  const getLLMSContent = async () => {
    const pluginStore = getPluginStore();

    const content = await pluginStore.get({ key: 'llms' });
    return content;
  };

  const setLLMSContent = async (data) => {
    const { content } = data;

    const pluginStore = getPluginStore();
    await pluginStore.set({ key: 'llms', value: { content } });
    return pluginStore.get({ key: 'llms' });
  };

  return {
    getLLMSContent,
    setLLMSContent,
  };
};
