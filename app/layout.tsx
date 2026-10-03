import type { Metadata } from 'next';
import { ApolloWrapper } from '@/lib/graphql/apollo-wrapper';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import './globals.css';
import { GoogleAnalytics } from '@next/third-parties/google'

export const metadata: Metadata = {
  title: 'osu! Multiplayer Lobby Search',
  description: 'Find osu! multiplayer lobbies by username, lobby title, beatmap ID, or player ID.',
  metadataBase: new URL("https://osump.chooh.moe"),
  openGraph: {
    title: "osu! Multiplayer Lobby Search",
    description: "Find osu! multiplayer lobbies by username, lobby title, beatmap ID, or player ID.",
    url: "https://osump.chooh.moe",
    siteName: "osu! mp search",
    images: [
      {
        url: '/kerusi.jpg',
        width: 1200,
        height: 630,
        alt: "https://www.pixiv.net/en/artworks/141863122"
      }
    ],
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "osu! Multiplayer Lobby Search",
    description: "Find osu! multiplayer lobbies by username, lobby title, beatmap ID, or player ID.",
    images: ['/kerusi.jpg']
  },
  alternates: {
    canonical: 'https://osump.chooh.moe',
  },
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
      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID as string} />
    </html>
  );
}
