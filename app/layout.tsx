import type { Metadata } from 'next';
import { ApolloWrapper } from '@/lib/graphql/apollo-wrapper';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import './globals.css';

export const metadata: Metadata = {
  title: 'osu! mp search',
  description: 'Search osu! multiplayer lobbies',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-foreground antialiased">
        <NuqsAdapter>
          <ApolloWrapper>
            {children}
          </ApolloWrapper>
        </NuqsAdapter>
      </body>
    </html>
  );
}