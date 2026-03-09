import type { Metadata } from 'next';
import { Mona_Sans } from 'next/font/google';
import './globals.css';
import ReactQueryProvider from '@/providers/react-query.provider';
import NextTopLoader from 'nextjs-toploader';
import { Toaster } from 'sonner';
import { FontLoader } from '@/components/FontLoader';
import 'leaflet/dist/leaflet.css';

const mont = Mona_Sans({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: '3MR',
  description: 'Stock Management Information System',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${mont.className} antialiased`}>
        <FontLoader>
          <ReactQueryProvider>{children}</ReactQueryProvider>
          <NextTopLoader color="#001526" showSpinner={false} />
          <Toaster richColors position="top-center" />
        </FontLoader>
      </body>
    </html>
  );
}
