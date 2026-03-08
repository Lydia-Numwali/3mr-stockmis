import type { Metadata } from 'next';
import { Mona_Sans } from 'next/font/google';
import './globals.css';
import ReactQueryProvider from '@/providers/react-query.provider';
import NextTopLoader from 'nextjs-toploader';
import { Toaster } from 'sonner';
import 'leaflet/dist/leaflet.css';

const mont = Mona_Sans({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'QT VMS',
  description: 'Visitor management system',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${mont.className} antialiased`}>
        <ReactQueryProvider>{children}</ReactQueryProvider>
        <NextTopLoader color="#001526" showSpinner={false} />
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
