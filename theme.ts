'use client';

import { createTheme } from '@mantine/core';

import { MantineThemeOverride, virtualColor } from '@mantine/core';

export const jioTheme: MantineThemeOverride = {
  colors: {
    dark: [
      '#C9C9C9',
      '#b8b8b8',
      '#828282',
      '#696969',
      '#424242',
      '#3b3b3b',
      '#2e2e2e',
      '#242424',
      '#1f1f1f',
      '#141414'
    ],
    jio:[
      "#e4fefb",
      "#d5f7f4",
      "#adede6",
      "#83e3d8",
      "#60dacc",
      "#4ad5c5",
      "#3ad3c1",
      "#29baaa",
      "#16a697",
      "#009082"
    ],
    secondary:[
      "#f5f5f5",
      "#e7e7e7",
      "#cdcdcd",
      "#b2b2b2",
      "#9a9a9a",
      "#8b8b8b",
      "#848484",
      "#717171",
      "#656565",
      "#575757"
    ],
    gray: [
      '#f8f9fa',
      '#f1f3f5',
      '#e9ecef',
      '#dee2e6',
      '#ced4da',
      '#adb5bd',
      '#868e96',
      '#495057',
      '#343a40',
      '#212529'
    ],
    red: [
      '#fff5f5',
      '#ffe3e3',
      '#ffc9c9',
      '#ffa8a8',
      '#ff8787',
      '#ff6b6b',
      '#fa5252',
      '#f03e3e',
      '#e03131',
      '#c92a2a'
    ],
    pink: [
      '#fff0f6',
      '#ffdeeb',
      '#fcc2d7',
      '#faa2c1',
      '#f783ac',
      '#f06595',
      '#e64980',
      '#d6336c',
      '#c2255c',
      '#a61e4d'
    ],
    grape: [
      '#f8f0fc',
      '#f3d9fa',
      '#eebefa',
      '#e599f7',
      '#da77f2',
      '#cc5de8',
      '#be4bdb',
      '#ae3ec9',
      '#9c36b5',
      '#862e9c'
    ],
    violet: [
      '#f3f0ff',
      '#e5dbff',
      '#d0bfff',
      '#b197fc',
      '#9775fa',
      '#845ef7',
      '#7950f2',
      '#7048e8',
      '#6741d9',
      '#5f3dc4'
    ],
    indigo: [
      '#edf2ff',
      '#dbe4ff',
      '#bac8ff',
      '#91a7ff',
      '#748ffc',
      '#5c7cfa',
      '#4c6ef5',
      '#4263eb',
      '#3b5bdb',
      '#364fc7'
    ],
    blue: [
      '#e7f5ff',
      '#d0ebff',
      '#a5d8ff',
      '#74c0fc',
      '#4dabf7',
      '#339af0',
      '#228be6',
      '#1c7ed6',
      '#1971c2',
      '#1864ab'
    ],
    cyan: [
      '#e3fafc',
      '#c5f6fa',
      '#99e9f2',
      '#66d9e8',
      '#3bc9db',
      '#22b8cf',
      '#15aabf',
      '#1098ad',
      '#0c8599',
      '#0b7285'
    ],
    teal: [
      '#e6fcf5',
      '#c3fae8',
      '#96f2d7',
      '#63e6be',
      '#38d9a9',
      '#20c997',
      '#12b886',
      '#0ca678',
      '#099268',
      '#087f5b'
    ],
    green: [
      '#ebfbee',
      '#d3f9d8',
      '#b2f2bb',
      '#8ce99a',
      '#69db7c',
      '#51cf66',
      '#40c057',
      '#37b24d',
      '#2f9e44',
      '#2b8a3e'
    ],
    lime: [
      '#f4fce3',
      '#e9fac8',
      '#d8f5a2',
      '#c0eb75',
      '#a9e34b',
      '#94d82d',
      '#82c91e',
      '#74b816',
      '#66a80f',
      '#5c940d'
    ],
    yellow: [
      '#fff9db',
      '#fff3bf',
      '#ffec99',
      '#ffe066',
      '#ffd43b',
      '#fcc419',
      '#fab005',
      '#f59f00',
      '#f08c00',
      '#e67700'
    ],
    orange: [
      '#fff4e6',
      '#ffe8cc',
      '#ffd8a8',
      '#ffc078',
      '#ffa94d',
      '#ff922b',
      '#fd7e14',
      '#f76707',
      '#e8590c',
      '#d9480f'
    ]
  },
  primaryColor: 'jio',
  primaryShade: {
    light: 6,
    dark: 8
  },
  white: '#fff',
  black: '#000',
  fontFamily: 'var(--font-ui)',
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
};


const redTheme: MantineThemeOverride = {
  colors: {
    dark: [
      '#C9C9C9',
      '#b8b8b8',
      '#828282',
      '#696969',
      '#424242',
      '#3b3b3b',
      '#2e2e2e',
      '#242424',
      '#1f1f1f',
      '#141414'
    ],
    secondary:[
      "#ffeaec",
      "#fcd4d7",
      "#f4a7ac",
      "#ec777e",
      "#e64f57",
      "#e3353f",
      "#e22732",
      "#c91a25",
      "#b41220",
      "#9e0419"
    ],
    gray: [
      '#f8f9fa',
      '#f1f3f5',
      '#e9ecef',
      '#dee2e6',
      '#ced4da',
      '#adb5bd',
      '#868e96',
      '#495057',
      '#343a40',
      '#212529'
    ],
    red: [
      '#fff5f5',
      '#ffe3e3',
      '#ffc9c9',
      '#ffa8a8',
      '#ff8787',
      '#ff6b6b',
      '#fa5252',
      '#f03e3e',
      '#e03131',
      '#c92a2a'
    ],
    pink: [
      '#fff0f6',
      '#ffdeeb',
      '#fcc2d7',
      '#faa2c1',
      '#f783ac',
      '#f06595',
      '#e64980',
      '#d6336c',
      '#c2255c',
      '#a61e4d'
    ],
    grape: [
      '#f8f0fc',
      '#f3d9fa',
      '#eebefa',
      '#e599f7',
      '#da77f2',
      '#cc5de8',
      '#be4bdb',
      '#ae3ec9',
      '#9c36b5',
      '#862e9c'
    ],
    violet: [
      '#f3f0ff',
      '#e5dbff',
      '#d0bfff',
      '#b197fc',
      '#9775fa',
      '#845ef7',
      '#7950f2',
      '#7048e8',
      '#6741d9',
      '#5f3dc4'
    ],
    indigo: [
      '#edf2ff',
      '#dbe4ff',
      '#bac8ff',
      '#91a7ff',
      '#748ffc',
      '#5c7cfa',
      '#4c6ef5',
      '#4263eb',
      '#3b5bdb',
      '#364fc7'
    ],
    blue: [
      '#e7f5ff',
      '#d0ebff',
      '#a5d8ff',
      '#74c0fc',
      '#4dabf7',
      '#339af0',
      '#228be6',
      '#1c7ed6',
      '#1971c2',
      '#1864ab'
    ],
    cyan: [
      '#e3fafc',
      '#c5f6fa',
      '#99e9f2',
      '#66d9e8',
      '#3bc9db',
      '#22b8cf',
      '#15aabf',
      '#1098ad',
      '#0c8599',
      '#0b7285'
    ],
    teal: [
      '#e6fcf5',
      '#c3fae8',
      '#96f2d7',
      '#63e6be',
      '#38d9a9',
      '#20c997',
      '#12b886',
      '#0ca678',
      '#099268',
      '#087f5b'
    ],
    green: [
      '#ebfbee',
      '#d3f9d8',
      '#b2f2bb',
      '#8ce99a',
      '#69db7c',
      '#51cf66',
      '#40c057',
      '#37b24d',
      '#2f9e44',
      '#2b8a3e'
    ],
    lime: [
      '#f4fce3',
      '#e9fac8',
      '#d8f5a2',
      '#c0eb75',
      '#a9e34b',
      '#94d82d',
      '#82c91e',
      '#74b816',
      '#66a80f',
      '#5c940d'
    ],
    yellow: [
      '#fff9db',
      '#fff3bf',
      '#ffec99',
      '#ffe066',
      '#ffd43b',
      '#fcc419',
      '#fab005',
      '#f59f00',
      '#f08c00',
      '#e67700'
    ],
    orange: [
      '#fff4e6',
      '#ffe8cc',
      '#ffd8a8',
      '#ffc078',
      '#ffa94d',
      '#ff922b',
      '#fd7e14',
      '#f76707',
      '#e8590c',
      '#d9480f'
    ]
  },
  primaryColor: 'red',
  primaryShade: {
    light: 6,
    dark: 8
  },
  white: '#fff',
  black: '#000',
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
  fontFamily: 'var(--font-ui)',
  fontFamilyMonospace: 'var(--font-ui)',
  
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
};

const seaTheme: MantineThemeOverride = {
  colors: {
    sea:[
      "#ebfaff",
      "#d7f3fb",
      "#a9e7f9",
      "#7bdaf8",
      "#5dcff6",
      "#4fc9f6",
      "#46c5f7",
      "#39aedc",
      "#2a9bc5",
      "#0086ad"
    ],
    secondary:[
      "#ebfeff",
      "#d7fbfd",
      "#aaf7fc",
      "#7df4fb",
      "#61f2fb",
      "#56f0fb",
      "#4df0fb",
      "#40d5e0",
      "#2fbdc7",
      "#00a4ad"
    ],
    dark: [
      '#C9C9C9',
      '#b8b8b8',
      '#828282',
      '#696969',
      '#424242',
      '#3b3b3b',
      '#2e2e2e',
      '#242424',
      '#1f1f1f',
      '#141414'
    ],
    gray: [
      '#f8f9fa',
      '#f1f3f5',
      '#e9ecef',
      '#dee2e6',
      '#ced4da',
      '#adb5bd',
      '#868e96',
      '#495057',
      '#343a40',
      '#212529'
    ],
    red: [
      '#fff5f5',
      '#ffe3e3',
      '#ffc9c9',
      '#ffa8a8',
      '#ff8787',
      '#ff6b6b',
      '#fa5252',
      '#f03e3e',
      '#e03131',
      '#c92a2a'
    ],
    pink: [
      '#fff0f6',
      '#ffdeeb',
      '#fcc2d7',
      '#faa2c1',
      '#f783ac',
      '#f06595',
      '#e64980',
      '#d6336c',
      '#c2255c',
      '#a61e4d'
    ],
    grape: [
      '#f8f0fc',
      '#f3d9fa',
      '#eebefa',
      '#e599f7',
      '#da77f2',
      '#cc5de8',
      '#be4bdb',
      '#ae3ec9',
      '#9c36b5',
      '#862e9c'
    ],
    violet: [
      '#f3f0ff',
      '#e5dbff',
      '#d0bfff',
      '#b197fc',
      '#9775fa',
      '#845ef7',
      '#7950f2',
      '#7048e8',
      '#6741d9',
      '#5f3dc4'
    ],
    indigo: [
      '#edf2ff',
      '#dbe4ff',
      '#bac8ff',
      '#91a7ff',
      '#748ffc',
      '#5c7cfa',
      '#4c6ef5',
      '#4263eb',
      '#3b5bdb',
      '#364fc7'
    ],
    blue: [
      '#e7f5ff',
      '#d0ebff',
      '#a5d8ff',
      '#74c0fc',
      '#4dabf7',
      '#339af0',
      '#228be6',
      '#1c7ed6',
      '#1971c2',
      '#1864ab'
    ],
    cyan: [
      '#e3fafc',
      '#c5f6fa',
      '#99e9f2',
      '#66d9e8',
      '#3bc9db',
      '#22b8cf',
      '#15aabf',
      '#1098ad',
      '#0c8599',
      '#0b7285'
    ],
    teal: [
      '#e6fcf5',
      '#c3fae8',
      '#96f2d7',
      '#63e6be',
      '#38d9a9',
      '#20c997',
      '#12b886',
      '#0ca678',
      '#099268',
      '#087f5b'
    ],
    green: [
      '#ebfbee',
      '#d3f9d8',
      '#b2f2bb',
      '#8ce99a',
      '#69db7c',
      '#51cf66',
      '#40c057',
      '#37b24d',
      '#2f9e44',
      '#2b8a3e'
    ],
    lime: [
      '#f4fce3',
      '#e9fac8',
      '#d8f5a2',
      '#c0eb75',
      '#a9e34b',
      '#94d82d',
      '#82c91e',
      '#74b816',
      '#66a80f',
      '#5c940d'
    ],
    yellow: [
      '#fff9db',
      '#fff3bf',
      '#ffec99',
      '#ffe066',
      '#ffd43b',
      '#fcc419',
      '#fab005',
      '#f59f00',
      '#f08c00',
      '#e67700'
    ],
    orange: [
      '#fff4e6',
      '#ffe8cc',
      '#ffd8a8',
      '#ffc078',
      '#ffa94d',
      '#ff922b',
      '#fd7e14',
      '#f76707',
      '#e8590c',
      '#d9480f'
    ]
  },
  primaryColor: 'sea',
  primaryShade: {
    light: 6,
    dark: 8
  },
  white: '#fff',
  black: '#000',
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
  fontFamily: 'var(--font-ui)',
  fontFamilyMonospace: 'var(--font-ui)',
  
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
};


const mossTheme: MantineThemeOverride = {
  colors: {
    moss:[
      "#ebf9ee",
      "#dfede2",
      "#c2d7c7",
      "#a3c0a9",
      "#88ac90",
      "#77a080",
      "#6d9a77",
      "#5b8665",
      "#4f7858",
      "#3f6849"
    ],
    secondary:[
      "#f3f7f7",
      "#e9eaea",
      "#cdd3d4",
      "#adbcbe",
      "#93a9ab",
      "#829ca0",
      "#77979a",
      "#658386",
      "#577578",
      "#446569"
    ],
    dark: [
      '#C9C9C9',
      '#b8b8b8',
      '#828282',
      '#696969',
      '#424242',
      '#3b3b3b',
      '#2e2e2e',
      '#242424',
      '#1f1f1f',
      '#141414'
    ],
    gray: [
      '#f8f9fa',
      '#f1f3f5',
      '#e9ecef',
      '#dee2e6',
      '#ced4da',
      '#adb5bd',
      '#868e96',
      '#495057',
      '#343a40',
      '#212529'
    ],
    red: [
      '#fff5f5',
      '#ffe3e3',
      '#ffc9c9',
      '#ffa8a8',
      '#ff8787',
      '#ff6b6b',
      '#fa5252',
      '#f03e3e',
      '#e03131',
      '#c92a2a'
    ],
    pink: [
      '#fff0f6',
      '#ffdeeb',
      '#fcc2d7',
      '#faa2c1',
      '#f783ac',
      '#f06595',
      '#e64980',
      '#d6336c',
      '#c2255c',
      '#a61e4d'
    ],
    grape: [
      '#f8f0fc',
      '#f3d9fa',
      '#eebefa',
      '#e599f7',
      '#da77f2',
      '#cc5de8',
      '#be4bdb',
      '#ae3ec9',
      '#9c36b5',
      '#862e9c'
    ],
    violet: [
      '#f3f0ff',
      '#e5dbff',
      '#d0bfff',
      '#b197fc',
      '#9775fa',
      '#845ef7',
      '#7950f2',
      '#7048e8',
      '#6741d9',
      '#5f3dc4'
    ],
    indigo: [
      '#edf2ff',
      '#dbe4ff',
      '#bac8ff',
      '#91a7ff',
      '#748ffc',
      '#5c7cfa',
      '#4c6ef5',
      '#4263eb',
      '#3b5bdb',
      '#364fc7'
    ],
    blue: [
      '#e7f5ff',
      '#d0ebff',
      '#a5d8ff',
      '#74c0fc',
      '#4dabf7',
      '#339af0',
      '#228be6',
      '#1c7ed6',
      '#1971c2',
      '#1864ab'
    ],
    cyan: [
      '#e3fafc',
      '#c5f6fa',
      '#99e9f2',
      '#66d9e8',
      '#3bc9db',
      '#22b8cf',
      '#15aabf',
      '#1098ad',
      '#0c8599',
      '#0b7285'
    ],
    teal: [
      '#e6fcf5',
      '#c3fae8',
      '#96f2d7',
      '#63e6be',
      '#38d9a9',
      '#20c997',
      '#12b886',
      '#0ca678',
      '#099268',
      '#087f5b'
    ],
    green: [
      '#ebfbee',
      '#d3f9d8',
      '#b2f2bb',
      '#8ce99a',
      '#69db7c',
      '#51cf66',
      '#40c057',
      '#37b24d',
      '#2f9e44',
      '#2b8a3e'
    ],
    lime: [
      '#f4fce3',
      '#e9fac8',
      '#d8f5a2',
      '#c0eb75',
      '#a9e34b',
      '#94d82d',
      '#82c91e',
      '#74b816',
      '#66a80f',
      '#5c940d'
    ],
    yellow: [
      '#fff9db',
      '#fff3bf',
      '#ffec99',
      '#ffe066',
      '#ffd43b',
      '#fcc419',
      '#fab005',
      '#f59f00',
      '#f08c00',
      '#e67700'
    ],
    orange: [
      '#fff4e6',
      '#ffe8cc',
      '#ffd8a8',
      '#ffc078',
      '#ffa94d',
      '#ff922b',
      '#fd7e14',
      '#f76707',
      '#e8590c',
      '#d9480f'
    ]
  },
  primaryColor: 'moss',
  primaryShade: {
    light: 6,
    dark: 8
  },
  white: '#fff',
  black: '#000',
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
  fontFamily: 'var(--font-ui)',
  fontFamilyMonospace: 'var(--font-ui)',
  
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
};


const blackedTheme: MantineThemeOverride = {
  colors: {
    blacked:[
      "#f5f5f5",
      "#e7e7e7",
      "#cdcdcd",
      "#b2b2b2",
      "#9a9a9a",
      "#8b8b8b",
      "#848484",
      "#717171",
      "#656565",
      "#575757"
    ],
    secondary:[
      "#ffeee7",
      "#fddcd4",
      "#f1b9aa",
      "#e7937d",
      "#de7356",
      "#da5e3d",
      "#d85330",
      "#c04423",
      "#ac3a1d",
      "#972f15"
    ],
    dark: [
      '#C9C9C9',
      '#b8b8b8',
      '#828282',
      '#696969',
      '#424242',
      '#3b3b3b',
      '#2e2e2e',
      '#242424',
      '#1f1f1f',
      '#141414'
    ],
    gray: [
      '#f8f9fa',
      '#f1f3f5',
      '#e9ecef',
      '#dee2e6',
      '#ced4da',
      '#adb5bd',
      '#868e96',
      '#495057',
      '#343a40',
      '#212529'
    ],
    red: [
      '#fff5f5',
      '#ffe3e3',
      '#ffc9c9',
      '#ffa8a8',
      '#ff8787',
      '#ff6b6b',
      '#fa5252',
      '#f03e3e',
      '#e03131',
      '#c92a2a'
    ],
    pink: [
      '#fff0f6',
      '#ffdeeb',
      '#fcc2d7',
      '#faa2c1',
      '#f783ac',
      '#f06595',
      '#e64980',
      '#d6336c',
      '#c2255c',
      '#a61e4d'
    ],
    grape: [
      '#f8f0fc',
      '#f3d9fa',
      '#eebefa',
      '#e599f7',
      '#da77f2',
      '#cc5de8',
      '#be4bdb',
      '#ae3ec9',
      '#9c36b5',
      '#862e9c'
    ],
    violet: [
      '#f3f0ff',
      '#e5dbff',
      '#d0bfff',
      '#b197fc',
      '#9775fa',
      '#845ef7',
      '#7950f2',
      '#7048e8',
      '#6741d9',
      '#5f3dc4'
    ],
    indigo: [
      '#edf2ff',
      '#dbe4ff',
      '#bac8ff',
      '#91a7ff',
      '#748ffc',
      '#5c7cfa',
      '#4c6ef5',
      '#4263eb',
      '#3b5bdb',
      '#364fc7'
    ],
    blue: [
      '#e7f5ff',
      '#d0ebff',
      '#a5d8ff',
      '#74c0fc',
      '#4dabf7',
      '#339af0',
      '#228be6',
      '#1c7ed6',
      '#1971c2',
      '#1864ab'
    ],
    cyan: [
      '#e3fafc',
      '#c5f6fa',
      '#99e9f2',
      '#66d9e8',
      '#3bc9db',
      '#22b8cf',
      '#15aabf',
      '#1098ad',
      '#0c8599',
      '#0b7285'
    ],
    teal: [
      '#e6fcf5',
      '#c3fae8',
      '#96f2d7',
      '#63e6be',
      '#38d9a9',
      '#20c997',
      '#12b886',
      '#0ca678',
      '#099268',
      '#087f5b'
    ],
    green: [
      '#ebfbee',
      '#d3f9d8',
      '#b2f2bb',
      '#8ce99a',
      '#69db7c',
      '#51cf66',
      '#40c057',
      '#37b24d',
      '#2f9e44',
      '#2b8a3e'
    ],
    lime: [
      '#f4fce3',
      '#e9fac8',
      '#d8f5a2',
      '#c0eb75',
      '#a9e34b',
      '#94d82d',
      '#82c91e',
      '#74b816',
      '#66a80f',
      '#5c940d'
    ],
    yellow: [
      '#fff9db',
      '#fff3bf',
      '#ffec99',
      '#ffe066',
      '#ffd43b',
      '#fcc419',
      '#fab005',
      '#f59f00',
      '#f08c00',
      '#e67700'
    ],
    orange: [
      '#fff4e6',
      '#ffe8cc',
      '#ffd8a8',
      '#ffc078',
      '#ffa94d',
      '#ff922b',
      '#fd7e14',
      '#f76707',
      '#e8590c',
      '#d9480f'
    ]
  },
  primaryColor: 'blacked',
  primaryShade: {
    light: 6,
    dark: 8
  },
  white: '#fff',
  black: '#000',
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
  fontFamily: 'var(--font-ui)',
  fontFamilyMonospace: 'var(--font-ui)',
  
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
};

export const staticThemes = [
  { label: 'Jio', theme: jioTheme},
  { label: 'Red', theme: redTheme},
  { label: 'Sea', theme: seaTheme},
  { label: 'Moss', theme: mossTheme},
  { label: 'blacked', theme: blackedTheme},

  ]