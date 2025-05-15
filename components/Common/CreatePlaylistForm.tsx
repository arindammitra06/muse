import { useAppDispatch } from "@/store/hooks";
import { createPlaylist } from "@/store/slices/playlist.slice";
import { Stack, TextInput, Button } from "@mantine/core";
import { modals } from "@mantine/modals";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';


export function CreatePlaylistForm() {
    const [playlistName, setPlaylistName] = useState('');
    const dispatch = useAppDispatch();
  
    useEffect(() => {
      setPlaylistName(''); // resets on mount
    }, []);
  
    return (
      <Stack>
        <TextInput
          placeholder="Add Playlist Name"
          value={playlistName}
          radius={'sm'}
          onChange={(e) => setPlaylistName(e.currentTarget.value)}
          data-autofocus />
        <Button
          radius={'md'}
          fullWidth
          onClick={() => {
            if (playlistName.trim()) {
              dispatch(createPlaylist({ id: uuidv4(), name: playlistName.trim(), image: null }));
              setPlaylistName('');
            }
            modals.closeAll()
          }
          } mt="md">
          Submit
        </Button>
      </Stack>
    );
  }