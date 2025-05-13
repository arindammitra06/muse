'use client'

import { Box, Stack, useMantineTheme, Paper, TextInput, FocusTrap, Badge, Flex, Pill, Kbd, Center, Loader, Title } from '@mantine/core';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { IconSearch } from '@tabler/icons-react';
import { useFocusTrap } from '@mantine/hooks';
import { useEffect, useState } from 'react';
import {  fetchSearchResults, getTopSearches, } from '@/store/slices/search.slice';
import { SkeletonSongBar, SongBar } from '@/components/SongBar/SongBar';
import SearchedAlbumList from '@/components/SearchedAlbumList/SearchedAlbumList';
import { nprogress } from '@mantine/nprogress';
import { title } from 'process';
import { AppTitles } from '@/components/Common/custom-title';
import { addSearchedString, removeSearchedString, setSearchQuery } from '@/store/slices/search-params.slice';

export default function SearchPage() {
  const dispatch = useAppDispatch();
  const theme = useMantineTheme();
  const focusTrapRef = useFocusTrap();
  const {topSearches, searchResult, isLoading } = useAppSelector((state) => state.search);
  const {searchedStrings, queryString } = useAppSelector((state) => state.searchParams);


    useEffect(() => {
      nprogress.reset();
      nprogress.start();
      dispatch(getTopSearches())
          .then((res: any) => {
            nprogress.complete();
          });
    }, []);
  
  
  const handlePillClick = (key:string) => {
      dispatch(setSearchQuery(key));
      dispatch(addSearchedString(key));
      dispatch(fetchSearchResults({searchQuery: key}));
    };


  const handleEnter = () => {
    dispatch(addSearchedString(queryString));
    dispatch(fetchSearchResults({searchQuery: queryString}));
  };



  return (
    <Box p="0">

      <Stack gap="xs" mb={200} >
        
        <Paper shadow="md"
         p={0} m={'xs'}
         radius={'xl'}
         style={{ position: 'sticky',
          top: 80,
          zIndex: 90, 
          boxShadow: '0 4px 12px rgba(93, 92, 92, 0.3)'
           }}>
          <TextInput radius={'xl'} ref={focusTrapRef}
            placeholder="Type songs, albums or artists and press ->"
            leftSection={<IconSearch size={20} color={theme.colors[theme.primaryColor][5]} />}
            size="md"
            variant="filled"
            mx={0}
            value={queryString}
            onChange={(e) => dispatch(setSearchQuery(e.currentTarget.value))}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                handleEnter();
              }
            }}
            rightSection={
              <Kbd  mr={22} onClick={()=>handleEnter()}>Enter</Kbd>
            }
          />
        </Paper>

        {searchedStrings !== null && searchedStrings !== undefined && searchedStrings.length > 0
          && <Flex
            p={10}
            gap="sm"
            justify="flex-start"
            align="flex-start"
            direction="row"
            wrap="wrap"
          >
            {searchedStrings.map((str, idx) => (
              <Pill onClick={()=>handlePillClick(str)} style={{cursor:'pointer'}}
                onRemove={()=>dispatch(removeSearchedString(str))}
                 withRemoveButton key={idx} size='md' >{str}</Pill>
            ))}
          </Flex>
          }


          {topSearches !== null && topSearches !== undefined && topSearches.length > 0
          && 
          <>
          <AppTitles title={'Trending Search'}/>

          <Flex
            p={10}
            gap="sm"
            justify="flex-start"
            align="flex-start"
            direction="row"
            wrap="wrap"
          >
            {topSearches.map((str, idx) => (
              <Pill onClick={()=>handlePillClick(str.title)} style={{cursor:'pointer'}} key={idx} size='md' >{str.title}</Pill>
            ))}
          </Flex>
          </>
          }



            {isLoading ? 
            <Center mt={20}><Loader size="md" /></Center> :
            <>
            {searchResult !== null && searchResult !== undefined && searchResult.length>0?
                     searchResult.map((each:any, idx:number) => (
                      <SearchedAlbumList key={idx} title={each.title} 
                            list={each.items} 
                            type={each.title==='Albums'? 'album': each.title==='Playlists' ? 'playlist' : each.title==='Artists' ? 'artist' : 'song' } 
                            query={queryString}/>
                    ))
                    :
              <></>
            }
            </>
            }
      </Stack>
    </Box>
  );
}
