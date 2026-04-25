import * as React from 'react';

// TODO update this in helper plugin docs
import { unstable_useContentManagerContext as useContentManagerContext } from '@strapi/strapi/admin';

import { Summary } from './Summary';

export const SeoChecker = () => {
  const {
    layout,
  } = useContentManagerContext();

  if (Object.values(layout.attributes).some((attr) => attr.type === 'component' && attr.component === 'shared.seo')) {
    return <Summary />;
  }

  return <React.Fragment />;
};
