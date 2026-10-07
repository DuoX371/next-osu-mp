import type { Metadata } from 'next';
import Link from 'next/link';
import { getSiteOrigin } from '@/lib/site-origin';

const description =
  'Find recent osu! multiplayer matches and tournament practice lobbies by title, player, or beatmap. Learn what the site keeps and for how long.';

export async function generateMetadata(): Promise<Metadata> {
  const origin = await getSiteOrigin();
  return {
    title: 'About | osu! Multiplayer Lobby Search',
    description,
    alternates: { canonical: `${origin}/about` },
    openGraph: {
      title: 'About | osu! Multiplayer Lobby Search',
      description,
      url: `${origin}/about`,
      siteName: 'osu! mp search',
      type: 'website',
      images: ['/kerusi.jpg'],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'About | osu! Multiplayer Lobby Search',
      description,
      images: ['/kerusi.jpg'],
    },
  };
}

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 pt-12 pb-24">
      <Link
        href="/"
        className="font-mono text-xs text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
      >
        ← Back to lobby search
      </Link>

      <article className="mt-10 space-y-8">
        <div className="border-b border-border pb-5">
          <h1 className="font-display text-3xl font-normal text-foreground">About this site</h1>
        </div>

        <section className="text-sm leading-7 text-muted-foreground">
          <p>
            osu! Multiplayer Lobby Search makes it easier to explore recent multiplayer activity.
          </p>
        </section>

        <section aria-label="What you can do" className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-md border border-border bg-card/70 p-4 shadow-sm">
            <span className="font-mono text-[10px] text-muted-foreground">01 / SEARCH</span>
            <h2 className="mt-3 font-display text-lg text-foreground">Find a lobby</h2>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              Search by <strong className="font-semibold text-foreground">title, username, player ID, or beatmap ID</strong>.
            </p>
          </div>
          <div className="rounded-md border border-border bg-card/70 p-4 shadow-sm">
            <span className="font-mono text-[10px] text-muted-foreground">02 / EXPLORE</span>
            <h2 className="mt-3 font-display text-lg text-foreground">See who played</h2>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              Open a result to see its listed players when available.
            </p>
          </div>
          <div className="rounded-md border border-border bg-card/70 p-4 shadow-sm">
            <span className="font-mono text-[10px] text-muted-foreground">03 / OPEN</span>
            <h2 className="mt-3 font-display text-lg text-foreground">Visit the match</h2>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              Follow the link straight to the match page on osu!.
            </p>
          </div>
        </section>

        <section className="border-t border-border pt-6 text-sm leading-7 text-muted-foreground">
          <h2 className="mb-2 font-display text-xl text-foreground">What gets saved?</h2>
          <p>
            The site keeps <strong className="font-semibold text-foreground">roughly six months</strong> of
            multiplayer match links. Matches with <strong className="font-semibold text-foreground">more than 50 maps</strong> are
            not stored, so some matches will not appear in search results.
          </p>
        </section>
      </article>
    </main>
  );
}
