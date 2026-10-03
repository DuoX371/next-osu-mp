import type { Metadata } from 'next';
import { ApolloWrapper } from '@/lib/graphql/apollo-wrapper';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import './globals.css';
import { GoogleAnalytics } from '@next/third-parties/google'
import { ThemeSelect } from '@/components/theme-select';

const themeScript = `
  (() => {
    const key = 'osu-mp-theme';
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const apply = () => {
      let theme = 'dark';
      try { theme = localStorage.getItem(key) || 'dark'; } catch {}
      document.documentElement.classList.toggle('dark', theme === 'dark' || (theme === 'system' && media.matches));
    };
    apply();
    media.addEventListener('change', apply);
    window.addEventListener('storage', (event) => { if (event.key === key) apply(); });
  })();
`;

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
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="bg-background text-foreground antialiased">
        <NuqsAdapter>
          <ApolloWrapper>
            {children}
          </ApolloWrapper>
        </NuqsAdapter>
        <footer className="fixed bottom-3 right-4 z-40 font-mono text-[10px] text-muted-foreground/75">
          Made by{' '}
          <a
            href="https://osu.ppy.sh/users/9560694"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 transition-colors hover:text-foreground"
          >
            Ramizel
          </a>
        </footer>
        <ThemeSelect />
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID as string} />
      </body>
    </html>
  );
}
