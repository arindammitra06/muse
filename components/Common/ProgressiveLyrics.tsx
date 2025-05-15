import { useEffect, useState } from 'react';
import { ScrollArea, Text, Stack } from '@mantine/core';

interface LyricLine {
  timeTag?: number; // optional
  words: string;
}

interface ProgressiveLyricsProps {
  lines: LyricLine[];
  duration: number; // in seconds
  currentTime: number; // in seconds
}

export const ProgressiveLyrics = ({ lines, duration, currentTime }: ProgressiveLyricsProps) => {
  const [currentLineIndex, setCurrentLineIndex] = useState(0);

  const totalLines = lines.length;
  const secondsPerLine = duration / totalLines;
  
  useEffect(() => {
    const index = Math.floor(currentTime / secondsPerLine);
    setCurrentLineIndex(index >= totalLines ? totalLines - 1 : index);
  }, [currentTime, secondsPerLine, totalLines]);

  return (
    <ScrollArea h="40vh" p="xs">
      <Stack gap="xs" align="center">
        {lines.map((line, index) => {

          return <Text
          key={index}
          size="md"
          style={{
            whiteSpace: 'pre-wrap',
            fontSize: index === currentLineIndex ? '1.2rem' : '1rem',
            fontWeight: index === currentLineIndex ? 700 : 400,
            opacity: index <= currentLineIndex ? 1 : 0.3,
            transition: 'all 0.3s ease',
            textAlign: 'center',
          }}
        >
          {line.words}
        </Text>
        })}
      </Stack>
    </ScrollArea>
  );
};
