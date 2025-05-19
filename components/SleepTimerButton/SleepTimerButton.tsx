// components/SleepTimerButton.tsx
import { useDisclosure } from '@mantine/hooks';
import { Button, Modal, Stack, Text, Slider, SimpleGrid, useMantineTheme, ActionIcon, Tooltip } from '@mantine/core';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { RootState } from '@/store/store';
import { clearSleepTimer, startSleepTimer } from '@/store/slices/sleepTimer.slice';
import { IconAlarm, IconAlarmFilled } from '@tabler/icons-react';

export function SleepTimerButton() {
    const [opened, { open, close }] = useDisclosure(false);
    const dispatch = useDispatch();
    const { isActive, remaining } = useSelector((state: RootState) => state.sleepTimer);
    const [minutes, setMinutes] = useState(15);
    const theme = useMantineTheme();
    
    const handleStart = () => {
        dispatch(startSleepTimer(minutes * 60 * 1000));
        close();
    };

    return (
        <>
            <Tooltip label={isActive ? `Sleep in ${Math.ceil((remaining ?? 0) / 60000)} min` : 'Set Sleep Timer'}
                position="right" transitionProps={{ duration: 0 }}>
                <ActionIcon variant="subtle" color={isActive ? theme.colors[theme.primaryColor][6] : 'gray'} onClick={open}>
                    {isActive ? <IconAlarmFilled size={22} /> : <IconAlarm size={22} />}
                </ActionIcon></Tooltip>

            {/* <Button variant="light" onClick={open}>
                {isActive ? `Sleep in ${Math.ceil((remaining ?? 0) / 60000)} min` : 'Set Sleep Timer'}
            </Button> */}
            <Modal.Root opened={opened} onClose={close} centered>
                <Modal.Overlay />
                <Modal.Content>
                    <Modal.Header styles={{
                        header: {
                            borderBottom: '1px solid #e0e0e0',
                        },
                    }}>
                        <Modal.Title>Set Sleep Timer in minutes</Modal.Title>
                        <Modal.CloseButton />
                    </Modal.Header>
                    <Modal.Body>
                        <SimpleGrid cols={1}>

                            <Slider
                                mt={50}
                                mb={30}
                                mx={0}
                                min={5}
                                max={120}
                                step={5}
                                styles={{ label: { zIndex: 1000 } }}
                                labelAlwaysOn
                                label={(v) => `${v} mins`}
                                value={minutes}
                                marks={[
                                    { value: 5, label: '5' },
                                    { value: 30, label: '30' },
                                    { value: 60, label: '60' },
                                    { value: 90, label: '90' },
                                    { value: 120, label: '120' },
                                ]}
                                onChange={setMinutes}
                            />
                            <Button fullWidth onClick={handleStart}>Set Timer</Button>
                            {isActive && (
                                <Button fullWidth variant="light" color="red" onClick={() => dispatch(clearSleepTimer())}>
                                    Cancel Sleep Timer
                                </Button>
                            )}
                        </SimpleGrid>
                    </Modal.Body>
                </Modal.Content>
            </Modal.Root>

        </>
    );
}
