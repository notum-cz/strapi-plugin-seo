export const settingsController = ({ strapi }) => {
  const settingsService = strapi.plugins['seo'].services.settings;

  const getSettings = async (ctx) => {
    try {
      return settingsService.getSettings();
    } catch (err) {
      ctx.throw(500, err);
    }
  };
  const setSettings = async (ctx) => {
    const { body } = ctx.request;
    try {
      await settingsService.setSettings(body);
      return settingsService.getSettings();
    } catch (err) {
      ctx.throw(500, err);
    }
  };

  return {
    getSettings,
    setSettings,
  };
};
