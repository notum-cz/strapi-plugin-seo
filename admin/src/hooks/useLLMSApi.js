import { useFetchClient } from '@strapi/strapi/admin';

export const useLLMSApi = () => {
  const { get, post } = useFetchClient();

  const getLLMSContent = async () => {
    const resultData = await get('/seo/llms');

    return resultData;
  };

  const setLLMSContent = async (data) => {
    const resultData = await post('/seo/llms', data);

    return resultData;
  };

  return { getLLMSContent, setLLMSContent };
};
