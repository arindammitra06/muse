import { Loader, Stack, Text } from '@mantine/core';

export function LoaderModal({ innerProps }: any) {
  return (
    <Stack align="center" gap="sm">
      <Loader size="lg" />
      {innerProps.message && (
        <Text size="sm" ta="center">
          {innerProps.message}
        </Text>
      )}
    </Stack>
  );
}
