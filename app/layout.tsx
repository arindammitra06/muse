'use client'
import '@mantine/core/styles.css';

import React from 'react';
import { ColorSchemeScript, mantineHtmlProps, MantineProvider } from '@mantine/core';
import RootApp from '@/components/Root/root.route';
import { Inter } from 'next/font/google'

const noto = Inter({
  subsets: ['latin'],
  display: 'swap', // optional
})

// export const metadata = {
//   title: 'Mantine Next.js template',
//   description: 'I am using Mantine with Next.js!',
// };

export default function RootLayout({ children }: { children: any }) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
        <link rel="shortcut icon" href="/favicon.svg" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
      </head>
      <body className={noto.className}>
        <RootApp>{children}</RootApp>
      </body>
    </html>
  );
}
