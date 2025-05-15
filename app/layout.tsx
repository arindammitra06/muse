'use client'
import '@mantine/core/styles.css';

import React from 'react';
import { ColorSchemeScript, mantineHtmlProps, } from '@mantine/core';
import RootApp from '@/components/Root/root.route';
import { Exo_2, Inter, } from 'next/font/google';


const inter = Exo_2({
  subsets: ['latin'],
  weight: ['100', '200','300', '400', '500','600', '700','800','900'],
  variable: '--font-ui',
  display: 'swap',
});

// export const metadata = {
//   title: 'Mantine Next.js template',
//   description: 'I am using Mantine with Next.js!',
// };

export default function RootLayout({ children }: { children: any }) {

  return (
    <html lang="en" {...mantineHtmlProps} className={`${inter.variable}`}>
      <head>
        <ColorSchemeScript />
        <link rel="manifest" href="/manifest.json" />
        <link rel="shortcut icon" href="/favicon.svg" />

        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
      </head>
      <body className={`${inter.className}`}>
        <RootApp>{children}</RootApp>
      </body>
    </html>
  );
}
