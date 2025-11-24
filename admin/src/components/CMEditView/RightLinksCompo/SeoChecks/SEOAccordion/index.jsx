import * as React from 'react';

import { Box, Typography, Accordion, IconButton } from '@strapi/design-system';
import { Information, CrossCircle, CheckCircle, WarningCircle } from '@strapi/icons';
import { qualityVerdict } from '../../../utils/checks';

export const SEOAccordion = ({ title, status, component, label }) => {
  const [iconConfig, setIconConfig] = React.useState({
    icon: WarningCircle,
    color: 'warning600',
  });

  React.useEffect(() => {
    switch (status?.qualityVerdict) {
      case qualityVerdict.good:
        setIconConfig({ icon: CheckCircle, color: 'success600' });
        break;
      case qualityVerdict.improvements:
        setIconConfig({ icon: WarningCircle, color: 'warning600' });
        break;
      case qualityVerdict.bad:
        setIconConfig({ icon: CrossCircle, color: 'danger600' });
        break;
      default:
        setIconConfig({ icon: WarningCircle, color: 'warning600' });
        break;
    }
  }, [status?.qualityVerdict]);

  return (
    <Accordion.Root>
      <Accordion.Item value="acc-01">
        <Accordion.Header>
          <Accordion.Trigger iconProps={{ color: iconConfig.color }} icon={iconConfig.icon}>
            {title}
          </Accordion.Trigger>
          <Accordion.Actions>
            <IconButton label={label}>
              <Information />
            </IconButton>
          </Accordion.Actions>
        </Accordion.Header>
        <Accordion.Content>
          <Box paddingTop={4} paddingLeft={4} paddingBottom={4}>
            <Typography variant="omega">{status?.message}</Typography>
          </Box>
          {component && component}
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  );
};
