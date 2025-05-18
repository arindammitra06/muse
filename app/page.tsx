'use client'

import AlbumList from '@/components/AlbumList/albumlist';
import { nprogress } from '@mantine/nprogress';
import { useEffect, useState } from 'react';
import { SimpleGrid, useMantineTheme, Text, Button, Drawer, Stack } from '@mantine/core';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchHomePageData } from '@/store/slices/jio.slice';
import HomePageSkeleton from '@/components/Skeletons/HomeSkeleton';
import { fetchGaanaData, fetchGaanaHomepage } from '@/store/slices/gaana.slice';
import SignInPage from '@/components/Login/LoginPage';
import { useSelector } from 'react-redux';
import { useDisclosure } from '@mantine/hooks';
import SortableOfflineDrawer from '@/components/SongBar/SortableOfflineDrawer';
import { useNetworkListener } from '@/utils/useNetworkListener';
import { RootState } from '@/store/store';
import OfflinePage from './_offline/page';

export default function HomePage() {
  const dispatch = useAppDispatch();
  const theme = useMantineTheme();
  const homedata = useAppSelector((state) => state.api.homedata);
  const user = useAppSelector((state) => state.user.currentUser);
  const isOnline = useAppSelector((state: RootState) => state.network.isOnline);
  


  useEffect(() => {
    if (isOnline) {
      fetchCall();
    }
  }, [user, isOnline]);


  async function fetchCall() {
    nprogress.reset();
    nprogress.start();
    dispatch(fetchHomePageData())
      .then((res: any) => {
        nprogress.complete();
      });
  }


  if (!isOnline) {
    return (<OfflinePage/>);
  }

  return (
    <>

      {user !== null && user !== undefined ?
        <SimpleGrid cols={1} spacing="xs" verticalSpacing="xs" mb={150}>
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

        : <SignInPage />
      }

    </>
  );
}
