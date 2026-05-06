'use client';

import { useState } from 'react';
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
};

export function LobbyCard({ lobby, index }: Props) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="border-t border-border first:border-t-0 animate-in fade-in slide-in-from-bottom-1"
      style={{ animationDelay: `${index * 40}ms`, animationFillMode: 'both' }}
    >
      {/* Main row */}
      <div
        className="flex cursor-pointer items-center gap-3 px-4 py-3 transition-colors hover:bg-secondary/60"
        onClick={() => setExpanded((p) => !p)}
      >
        {/* ID */}
        <span className="w-24 shrink-0 font-mono text-[11px] text-muted-foreground">
          #{lobby.lobbyId}
        </span>

        {/* Status */}
        <span
          className={`shrink-0 rounded-sm px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider ${
            lobby.status === 'ongoing'
              ? 'bg-green-500/10 text-green-600 dark:text-green-400'
              : 'bg-secondary text-muted-foreground'
          }`}
        >
          {lobby.status}
        </span>

        {/* Title */}
        <span className="flex-1 truncate text-sm font-medium text-foreground">
          {lobby.title}
        </span>

        {/* Date */}
        <span className="shrink-0 font-mono text-[11px] text-muted-foreground">
          {formatDistanceToNow(new Date(lobby.createdAt), { addSuffix: true })}
        </span>

        {/* Actions */}
        <div className="flex shrink-0 items-center gap-1" onClick={(e) => e.stopPropagation()}>
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