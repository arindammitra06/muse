'use client'

import AlbumList from '@/components/AlbumList/albumlist';
import { nprogress } from '@mantine/nprogress';
import { useEffect } from 'react';
import { SimpleGrid, useMantineTheme } from '@mantine/core';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchHomePageData } from '@/store/slices/jio.slice';
import HomePageSkeleton from '@/components/Skeletons/HomeSkeleton';

export default function HomePage() {
  const dispatch = useAppDispatch();
  const theme = useMantineTheme();
  const homedata = useAppSelector((state) => state.api.homedata);

  useEffect(() => {
    fetchCall();
  }, []);


  function fetchCall() {
    nprogress.reset();
    nprogress.start();
    dispatch(fetchHomePageData({ lang: 'hi', genre: '' }))
      .then((res: any) => {
        nprogress.complete();
      });


  }



  return (
    <>
    <SimpleGrid cols={1} spacing="xs" verticalSpacing="xs" mb={100}>
      {
        homedata !== null && homedata !== undefined &&
          homedata.modules !== null && homedata.modules !== undefined ?
          <div>
            {(Object.entries(homedata.modules) as [keyof any, any[keyof any]][]).map(([key, value]) => (

              <AlbumList key={String(key)}
                name={value.title} subtitle={value.subtitle}
                list={homedata[String(key)]} />
            ))}
          </div>
          :
          <HomePageSkeleton />
      }


    </SimpleGrid>
    </>
  );
}
