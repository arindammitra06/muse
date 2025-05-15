// theme/theme.ts
import { MantineColorsTuple, createTheme } from '@mantine/core';
import { generateMantineColorSwatch } from './utils/generic.utils';

export const getCustomTheme = (primaryColor: string) =>
  createTheme({
    colors: {
      custom: generateMantineColorSwatch(primaryColor),
    },
    primaryColor: 'custom',
    fontFamily: 'var(--font-ui)',
    primaryShade: {
      light: 5,
      dark: 8
    },
    white: '#fff',
    black: '#000',
    fontFamilyMonospace: 'var(--font-ui)',
    defaultGradient: {
      from: 'blue',
      to: 'cyan',
      deg: 45
    },
    headings: {
      fontFamily:'var(--font-ui)',
      fontWeight: '700',
      sizes: {
        h1: {
          fontSize: 'calc(2.125rem * var(--mantine-scale))',
          lineHeight: '1.3',
          fontWeight: '700'
        },
        h2: {
          fontSize: 'calc(1.625rem * var(--mantine-scale))',
          lineHeight: '1.35',
          fontWeight: '700'
        },
        h3: {
          fontSize: 'calc(1.375rem * var(--mantine-scale))',
          lineHeight: '1.4',
          fontWeight: '700'
        },
        h4: {
          fontSize: 'calc(1.125rem * var(--mantine-scale))',
          lineHeight: '1.45',
          fontWeight: '700'
        },
        h5: {
          fontSize: 'calc(1rem * var(--mantine-scale))',
          lineHeight: '1.5',
          fontWeight: '700'
        },
        h6: {
          fontSize: 'calc(0.875rem * var(--mantine-scale))',
          lineHeight: '1.5',
          fontWeight: '700'
        }
      }
    },
    scale: 1,
    radius: {
      xs: '0.125rem',
      sm: '0.25rem',
      md: '0.5rem',
      lg: '1rem',
      xl: '2rem'
    },
    spacing: {
      xs: '0.625rem',
      sm: '0.75rem',
      md: '1rem',
      lg: '1.25rem',
      xl: '2rem'
    },
    defaultRadius: 'md',
    breakpoints: {
      xs: '36em',
      sm: '48em',
      md: '62em',
      lg: '75em',
      xl: '88em'
    },
    fontSmoothing: true,
    focusRing: 'auto'
  });
