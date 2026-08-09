'use client';

import { Suspense, useEffect, useState } from 'react';
import { useQuery, useSubscription } from '@apollo/client/react';
import { LobbyFilter } from '@/components/lobby/lobby-filter';
import { LobbyList } from '@/components/lobby/lobby-list';
import { GET_LATEST_LOBBY_ID, GET_LOBBIES, LATEST_LOBBY_SUBSCRIPTION } from '@/lib/graphql/queries/lobbies';
import { ChevronsDownUp, ChevronsUpDown } from 'lucide-react';

type Filter = {
  username?: string;
  title?: string;
  beatmapId?: number;
  playerId?: number;
};

const PAGE_SIZES = [5, 10, 20, 50];

export default function HomePage() {
  const [filter, setFilter] = useState<Filter>({});
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [cachedTotal, setCachedTotal] = useState(0);

  function handleFilterChange(f: Filter) {
    setFilter(f);
    setPage(0);
  }

  function handlePageSizeChange(size: number) {
    setPageSize(size);
    setPage(0);
  }
  
  const hasFilter = Object.values(filter).some(v => v !== undefined && v !== null && v !== "");
  const { data, previousData, loading } = useQuery(GET_LOBBIES, {
    variables: {
      filter,
      pagination: { 
        skip: page * pageSize,
        limit: pageSize
      },
    },
    pollInterval: hasFilter ? 5000 : 0,
    notifyOnNetworkStatusChange: false,
  });

  const tableData = data ?? previousData;

  const totalPages = Math.ceil(cachedTotal / pageSize);
  const hasNextPage = page + 1 < totalPages;
  const hasPreviousPage = page > 0;

  const { data: latestData } = useQuery(GET_LATEST_LOBBY_ID);
  const { data: subData } = useSubscription(LATEST_LOBBY_SUBSCRIPTION);

  const [latestId, setLatestId] = useState(0);
  const [allExpanded, setAllExpanded] = useState(false);

  useEffect(() => {
    const sub = subData?.lobbyAdded ?? 0;
    const query = latestData?.latestLobbyId ?? 0;

    setLatestId(prev => Math.max(prev, sub, query));
  }, [subData, latestData]);

  useEffect(() => {
    if (data?.lobbies.total !== undefined) {
      setCachedTotal(data.lobbies.total);
    }
  }, [data?.lobbies.total]);

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
          latest #{latestId}
          {!loading && tableData && (
            <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
              {tableData.lobbies.total} results
            </span>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <Suspense fallback={<div className="h-16" />}>
          <LobbyFilter onChange={handleFilterChange} />
        </Suspense>
      </div>

      {/* Pagination */}
      <div className="mt-4 mb-4 flex items-center justify-between">
        <button
          onClick={() => setPage((p) => p - 1)}
          disabled={!hasPreviousPage}
          className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-30"
        >
          ← prev
        </button>

        {/* Page info + size selector */}
        <div className="flex items-center gap-3">
          <span className="font-mono text-[11px] text-muted-foreground">
            page {page + 1} of {totalPages}
          </span>

          <div className="flex items-center gap-1">
            {PAGE_SIZES.map((size) => (
              <button
                key={size}
                onClick={() => handlePageSizeChange(size)}
                className={`font-mono text-[11px] px-2 py-0.5 rounded-sm transition-colors ${
                  pageSize === size
                    ? 'bg-foreground text-background'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={!hasNextPage}
          className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-30"
        >
          next →
        </button>
      </div>

      {/* Expand all — sits between pagination and list */}
      {!loading && tableData?.lobbies.lobbies.length > 0 && (
        <div className="mt-2 mb-1 flex justify-end">
        <button
          onClick={() => setAllExpanded((p) => !p)}
          className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground"
        >
          {allExpanded ? (
            <>
              <ChevronsDownUp size={12} />
              hide all
            </>
          ) : (
            <>
              <ChevronsUpDown size={12} />
              expand all
            </>
          )}
        </button>
      </div>
      )}


      {/* Results */}
      <LobbyList lobbies={tableData?.lobbies.lobbies as any ?? []} loading={loading} allExpanded={allExpanded} />

      <img
        src="/kalsit.png"
        alt="https://x.com/freshorange_99/status/1909049022134014414"
        className="fixed bottom-0 right-0 w-[20vw] min-w-[80px] max-w-[200px] select-none pointer-events-none"
      />
    </main>
  );
}
