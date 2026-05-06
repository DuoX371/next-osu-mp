'use client';

import { Suspense, useState } from 'react';
import { useQuery } from '@apollo/client/react';
import { LobbyFilter } from '@/components/lobby/lobby-filter';
import { LobbyList } from '@/components/lobby/lobby-list';
import { GET_LATEST_LOBBY_ID, GET_LOBBIES } from '@/lib/graphql/queries/lobbies';

type Filter = {
  username?: string;
  title?: string;
  beatmapId?: number;
  playerId?: number;
};

export default function HomePage() {
  const [filter, setFilter] = useState<Filter>({});

  const { data, loading } = useQuery(GET_LOBBIES, {
    variables: {
      filter,
      pagination: { skip: 0, limit: 20 },
    },
  });

  const { data: latestData } = useQuery(GET_LATEST_LOBBY_ID, {
    pollInterval: 30_000,
  });

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      {/* Masthead */}
      <div className="mb-8 flex items-baseline justify-between border-b border-border pb-5">
        <h1 className="font-display text-2xl font-normal tracking-tight text-foreground">
          osu! 🤓
        </h1>
        <div className="flex items-center gap-4">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-500" />
          </span>
          latest #{latestData?.latestLobbyId}
          {!loading && data && (
            <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
              {data.lobbies.length} results
            </span>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <Suspense fallback={<div className="h-16" />}>
          <LobbyFilter onChange={setFilter} />
        </Suspense>
      </div>

      {/* Results */}
      <LobbyList lobbies={data?.lobbies as any ?? []} loading={loading} />

      <img
        src="/kalsit.png"
        alt="https://x.com/freshorange_99/status/1909049022134014414"
        className="fixed bottom-0 right-0 w-[20vw] min-w-[80px] max-w-[200px] select-none pointer-events-none"
      />
    </main>
  );
}