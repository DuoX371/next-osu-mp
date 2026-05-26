import type { Metadata } from 'next';
import { ApolloWrapper } from '@/lib/graphql/apollo-wrapper';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import './globals.css';
import { GoogleAnalytics } from '@next/third-parties/google'

export const metadata: Metadata = {
  title: 'osu! mp search',
  description: 'Search osu! multiplayer lobbies',
  metadataBase: new URL("https://osump.chooh.moe"),
  openGraph: {
    title: "osu! mp search",
    description: "Search osu! multiplayer lobbies for 🤓",
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
    title: "osu! mp search",
    description: "Search osu! multiplayer lobbies for 🤓",
    images: ['/kerusi.jpg']
  },
    keywords: [
    'osu',
    'osu! multiplayer',
    'osu mp',
    'osu lobby search',
    'osu match history',
    'osu player search',
    'osu beatmap lobby',
  ],
  alternates: {
    canonical: 'https://osump.chooh.moe',
  },
  verification: {
    google: "ecf09391390bc834"
  }
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