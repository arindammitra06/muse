import { render as testingLibraryRender } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import { getCustomTheme } from '@/theme';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';


export function render(ui: React.ReactNode) {
  const primaryColor = useSelector((state: RootState) => state.theme.primaryColor);

  return testingLibraryRender(<>{ui}</>, {
    wrapper: ({ children }: { children: React.ReactNode }) => (
      <MantineProvider theme={getCustomTheme(primaryColor)}>{children}</MantineProvider>
    ),
  });
}
