'use client';

import { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ExternalLink, ChevronDown } from 'lucide-react';

type Player = {
  playerId: number;
  username: string;
};

type Props = {
  lobby: {
    lobbyId: number;
    title: string;
    createdAt: string;
    status: string;
    players?: Player[];
  };
  index: number;
  allExpanded?: boolean;
};

export function LobbyCard({ lobby, index, allExpanded }: Props) {
  const [expanded, setExpanded] = useState(allExpanded ?? false);

  useEffect(() => {
    setExpanded(allExpanded ?? false);
  }, [allExpanded]);

  return (
    <div
      className="border-t border-border first:border-t-0 animate-in fade-in slide-in-from-bottom-1"
      style={{ animationDelay: `${index * 40}ms`, animationFillMode: 'both' }}
    >
      {/* Main row */}
      <div
        className="flex cursor-pointer flex-wrap items-center gap-x-3 gap-y-2 px-4 py-3 transition-colors hover:bg-secondary/60 sm:flex-nowrap"
        onClick={() => setExpanded((p) => !p)}
      >
        {/* ID */}
        <span className="order-2 shrink-0 font-mono text-[11px] text-muted-foreground sm:order-none sm:w-24">
          #{lobby.lobbyId}
        </span>

        {/* Status */}
        <span
          className={`order-3 shrink-0 rounded-sm px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider sm:order-none ${
            lobby.status === 'ongoing'
              ? 'bg-green-500/10 text-green-600 dark:text-green-400'
              : 'bg-secondary text-muted-foreground'
          }`}
        >
          {lobby.status}
        </span>

        {/* Title */}
        <span className="order-1 min-w-0 basis-full break-words text-sm font-medium text-foreground sm:order-none sm:basis-auto sm:flex-1 sm:truncate">
          {lobby.title}
        </span>

        {/* Date */}
        <span className="order-4 shrink-0 font-mono text-[11px] text-muted-foreground sm:order-none">
          {formatDistanceToNow(new Date(lobby.createdAt), { addSuffix: true })}
        </span>

        {/* Actions */}
        <div className="order-5 ml-auto flex shrink-0 items-center gap-1 sm:order-none sm:ml-0" onClick={(e) => e.stopPropagation()}>
          <a
            href={`https://osu.ppy.sh/community/matches/${lobby.lobbyId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-6 w-6 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:bg-border hover:text-foreground"
          >
            <ExternalLink size={12} />
          </a>
          {lobby.players && lobby.players.length > 0 && (
            <button
              className="flex h-6 w-6 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:bg-border hover:text-foreground"
              onClick={() => setExpanded((p) => !p)}
            >
              <ChevronDown
                size={12}
                className={`transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
              />
            </button>
          )}
        </div>
      </div>

      {/* Players panel */}
      {expanded && lobby.players && (
        <div className="border-t border-border bg-secondary/40 px-4 py-3 animate-in fade-in slide-in-from-top-1">
          <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            {lobby.players.length} players
          </p>
          <div className="flex flex-wrap gap-1.5">
            {lobby.players.map((player) => (
              <a
                key={player.playerId}
                href={`https://osu.ppy.sh/users/${player.playerId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-sm border border-border px-2 py-1 font-mono text-[11px] text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground"
              >
                {player.username}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
