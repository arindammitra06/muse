import { useAppSelector } from "@/store/hooks";
import useAudioPlayer from "@/utils/useAudioPlayer";
import { Flex, SimpleGrid, Slider, Text, useMantineTheme } from "@mantine/core";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

export const SeekBar = () => {
    const dispatch = useDispatch();
    const { isPlaying, currentTrackIndex, playlist, isRepeat, isShuffle } = useAppSelector((state) => state.player);
    const { soundRef } = useAudioPlayer();
    const track = playlist[currentTrackIndex];
    const [seek, setSeek] = useState(0);
    const [duration, setDuration] = useState(100);
    const theme = useMantineTheme();

    // Poll the playback position every second
    useEffect(() => {
        const interval = setInterval(() => {
            if (soundRef.current && soundRef.current.playing()) {
                setSeek(soundRef.current.seek() as number);
                setDuration(soundRef.current.duration());
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [soundRef]);

    const handleSeekChange = (value: number) => {
        if (soundRef.current) {
            soundRef.current.seek(value);
            setSeek(value);
        }
    };

    function formatTime(sec: number): string {
        const minutes = Math.floor(sec / 60);
        const seconds = Math.floor(sec % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }

    return <SimpleGrid cols={1} px="0" mt={10} verticalSpacing={'xs'}>
        <Slider
            value={seek}
            max={duration}
            onChange={handleSeekChange}
            size="xs"
            radius={'xs'}
            color={'red'}
        />
        <Flex justify="space-between" align="center" >
            <Text size="xs" c="dimmed">{formatTime(seek)}</Text>
            <Text size="xs" c="dimmed">{formatTime(duration)}</Text>
        </Flex>
    </SimpleGrid>
}