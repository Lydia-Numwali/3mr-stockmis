import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Stock MIS - Authentication',
  description: 'Authentication for Stock MIS',
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className="min-h-screen bg-gray-50 flex items-center justify-center p-4 antialiased">
      {children}
    </section>
  );
}
