// theme/theme.ts
import { MantineColorsTuple, createTheme } from '@mantine/core';
import { generateMantineColorSwatch } from './utils/generic.utils';

export const getCustomTheme = (primaryColor: string) =>
  createTheme({
    colors: {
      custom: generateMantineColorSwatch(primaryColor),
    },
    primaryColor: 'custom',
    fontFamily: 'Inter, sans-serif',
    defaultRadius: 'md',
    headings: {
      fontFamily: 'Inter, sans-serif',
    },
    components: {
      Button: {
        defaultProps: {
          radius: 'md',
        },
      },
    },
  });
