'use client'
import { AppLogo } from '@/components/Common/custom-logo.component';
import { FadingWeightLogo } from '@/components/Common/FadingWeightLogo';
import { useAppDispatch } from '@/store/hooks';
import { setPageTitle } from '@/store/slices/pageTitleSlice';
import { capitalizeFirst } from '@/utils/generic.utils';
import { Container, Title, Text, Grid, Card, Image, Stack, Button, Group, Badge, Anchor, Box } from '@mantine/core';
import { IconBrandGithub, IconStar } from '@tabler/icons-react';
import { useEffect } from 'react';

export default function AboutPage() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setPageTitle(capitalizeFirst('abouts')));

  }, [dispatch]);


  return (
    <Container size="lg" py="xl" pb={150}>
      <Grid gutter="xl" align="center">

        <Grid.Col span={{ base: 12, md: 7 }}>
          <Stack gap="sm">
            <Title order={2}>About ... <FadingWeightLogo text={'muse'} /></Title>
            <Text size="lg" c="dimmed">
              A modern, open-source music player built with React, focused on seamless mobile playback and inspired by the Flutter-based BlackHole app.
              Designed for personal use, it offers a responsive, immersive experience across devices. Contributions are welcome!
            </Text>
            <Group mt="md">
              <Badge color="indigo" variant="light">React</Badge>
              <Badge color="teal" variant="light">Redux Toolkit</Badge>
              <Badge color="grape" variant="light">Mantine v7</Badge>
              <Badge color="cyan" variant="light">TypeScript</Badge>
              <Badge color="orange" variant="light">HTMLAudioElement</Badge>
              <Badge color="red" variant="light">ChatGPT</Badge>
            </Group>
            <Card shadow="md" mt="xl" p="lg" radius="md" withBorder>
              <Title order={4}>Terms of usage</Title>
              <Text mt="xs">
                We do not support or promote piracy in any form. This project is created strictly for educational and personal use. It serves as a learning tool for developers interested in building music applications with modern web technologies.
                Please respect artists and copyright laws by streaming music only through legal and authorized sources.
              </Text>
            </Card>

            <Button
              component="a"
              href="https://github.com/arindammitra06/muse"
              target="_blank"
              rel="noopener noreferrer"
              leftSection={<IconBrandGithub size={18} />}
              variant="default"
              mt="lg"
            >
              View on GitHub
            </Button>
            <Box mt="lg" ta="center">
              <Anchor href="https://github.com/arindammitra06/muse" target="_blank" underline="never">
                <Button
                  leftSection={<IconStar size={20} />}
                  variant="gradient"
                  gradient={{ from: 'yellow', to: 'orange', deg: 105 }}
                  size="md"
                  radius="xl"
                >
                  Like this project? Star it on GitHub ⭐
                </Button>
              </Anchor>
            </Box>
          </Stack>
        </Grid.Col>
      </Grid>

      <Card shadow="md" mt="xl" p="lg" radius="md" withBorder>
        <Title order={4}>Why Open Source?</Title>
        <Text mt="xs">
          We believe in community, collaboration, and transparency. Our player is fully open-source,
          encouraging contributions from developers and music lovers worldwide. Join us on GitHub to contribute,
          report issues, or star the project.
        </Text>
      </Card>
    </Container>
  );
};

