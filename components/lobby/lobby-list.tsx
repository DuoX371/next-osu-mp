import { LobbyCard } from './lobby-card';
import { LobbySkeleton } from './lobby-skeleton';

type Player = { playerId: number; username: string };
type Lobby = {
  lobbyId: number;
  title: string;
  createdAt: string;
  status: string;
  players?: Player[];
};

type Props = {
  lobbies: Lobby[];
  loading?: boolean;
};

export function LobbyList({ lobbies, loading }: Props) {
  if (loading) {
    return (
      <div className="rounded-md border border-border">
        {Array.from({ length: 6 }).map((_, i) => (
          <LobbySkeleton key={i} />
        ))}
      </div>
    );
  }

  if (lobbies.length === 0) {
    return (
      <div className="flex items-center justify-center rounded-md border border-border py-16">
        <p className="font-mono text-xs text-muted-foreground">no lobbies found</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border border-border">
      {lobbies.map((lobby, i) => (
        <LobbyCard key={lobby.lobbyId} lobby={lobby} index={i} />
      ))}
    </div>
  );
}