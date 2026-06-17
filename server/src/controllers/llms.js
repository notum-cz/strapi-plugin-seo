export const llmsController = ({ strapi }) => {
  const llmsService = strapi.plugins['seo'].services.llms;

  const getContent = async (ctx) => {
    try {
      return llmsService.getLLMSContent();
    } catch (err) {
      ctx.throw(500, err);
    }
  };
  const setContent = async (ctx) => {
    const { body } = ctx.request;
    try {
      await llmsService.setLLMSContent(body);
      return llmsService.getLLMSContent();
    } catch (err) {
      ctx.throw(500, err);
    }
  };

  return {
    getContent,
    setContent,
  };
};
