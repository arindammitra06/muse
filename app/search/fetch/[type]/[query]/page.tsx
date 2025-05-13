'use client'

import { nprogress } from '@mantine/nprogress';
import { useEffect, useRef, useState } from 'react';
import { Box, Center, Loader, Title } from '@mantine/core';
import { useAppDispatch } from '@/store/hooks';
import { fetchAlbums } from '@/store/slices/jio.slice';
import { SearchResultSongBar } from '@/components/SearchedAlbumList/SearchResultSongBar';
import InfiniteScroll from 'react-infinite-scroll-component';

export default function AlbumSearchPage({ params }: { params: { type: string; query: string } }) {
  const { type, query } = params;
  const dispatch = useAppDispatch();
  const [albums, setAlbums] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);


  useEffect(() => {
    // Reset when query or type changes
    setAlbums([]);
    setPage(1);
    setHasMore(true);
    fetchInitial();
  }, [type, query]);

  const fetchInitial = async () => {
    nprogress.start();
    const res: any = await dispatch(fetchAlbums({ searchQuery: query, page: 1, type, count: 20 }));
    setAlbums(res.payload);
    setHasMore(res.payload.length === 20);
    setPage(2);
    nprogress.complete();
  };

  async function fetchCall() {
    nprogress.start();
    const res: any = await dispatch(fetchAlbums({ searchQuery: query, page, type, count: 20 }));
    setAlbums(prev => [...prev, ...res.payload]);
    setHasMore(res.payload.length === 20);
    setPage(prev => prev + 1);
    nprogress.complete();
  }

  return (
    <Box p="sm" mb={150} style={{ minHeight: '100vh' }}>
      <InfiniteScroll
        dataLength={albums.length}
        next={fetchCall}
        hasMore={hasMore}
        loader={<Center><Loader /></Center>}
        endMessage={<Title ta={'center'} order={5}>No more data</Title>}
      >
        {albums.map((album, index) => (
          <SearchResultSongBar
            key={index}
            idx={album.id}
            song={album}
            type={album.type}
            title={album.title} 
            perma_url={album.perma_url}          />
        ))}
      </InfiniteScroll>
    </Box>
  );
}
