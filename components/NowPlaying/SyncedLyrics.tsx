// components/NowPlayingLyrics.tsx
import { Text, ScrollArea, Stack } from '@mantine/core';
import { useEffect, useRef, useState } from 'react';

interface ProgressiveLyricsProps {
  lines: any[];
  currentTime: number; // in seconds
}
export const LineSyncedLyrics = ({ lines, currentTime }: ProgressiveLyricsProps) => {
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const lineRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const index = lines.findIndex((line, i) => {
      const start = parseInt(line.startTimeMs) / 1000; // convert ms to s
      const nextStart = lines[i + 1] ? parseInt(lines[i + 1].startTimeMs) / 1000 : Infinity;
      return currentTime >= start && currentTime < nextStart;
    });

    if (index !== -1 && index !== currentLineIndex) {
      setCurrentLineIndex(index);
      const el = lineRefs.current[index];
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [currentTime, lines, currentLineIndex]);

  return (
    <ScrollArea h="40vh" p="md">
      <Stack gap="xs" align="center">
        {lines.map((line, index) => (
          <div
            key={index}
            ref={(el) => {
              lineRefs.current[index] = el;
            }}
          >
            <Text
              size="md"
              style={{
                fontSize: index === currentLineIndex ? '1.2rem' : '1rem',
                fontWeight: index === currentLineIndex ? 700 : 400,
                opacity: index === currentLineIndex ? 1 : 0.4,
                textAlign: 'center',
                transition: 'all 0.3s ease',
              }}
            >
              {line.words}
            </Text>
          </div>
        ))}
      </Stack>
    </ScrollArea>
  );
};