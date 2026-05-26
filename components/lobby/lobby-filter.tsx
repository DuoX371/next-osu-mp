'use client';

import { useQueryStates, parseAsString, parseAsInteger } from 'nuqs';
import { useEffect } from 'react';

type Filter = {
  username?: string;
  title?: string;
  beatmapId?: number;
  playerId?: number;
};

type Props = {
  onChange: (filter: Filter) => void;
};

const fields = [
  { key: 'username', label: 'Username', placeholder: 'Ramizel', type: 'text' },
  { key: 'title',    label: 'Title',    placeholder: 'amongus',  type: 'text' },
  { key: 'beatmapId', label: 'Beatmap ID', placeholder: '1430354', type: 'number' },
  { key: 'playerId',  label: 'Player ID',  placeholder: '9560694', type: 'number' },
] as const;

export function LobbyFilter({ onChange }: Props) {
  const [params, setParams] = useQueryStates({
    username:  parseAsString.withDefault(''),
    title:     parseAsString.withDefault(''),
    beatmapId: parseAsInteger,
    playerId:  parseAsInteger,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      onChange({
        username:  params.username  || undefined,
        title:     params.title     || undefined,
        beatmapId: params.beatmapId ?? undefined,
        playerId:  params.playerId  ?? undefined,
      });
    }, 400);
    return () => clearTimeout(timer);
  }, [params.username, params.title, params.beatmapId, params.playerId]);

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {fields.map(({ key, label, placeholder, type }) => (
        <div key={key} className="flex flex-col gap-1">
          <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            {label}
          </label>
          <input
            type={type}
            placeholder={placeholder}
            value={type === 'number' ? (params[key] ?? '') : (params[key] as string)}
            onChange={(e) =>
              setParams({
                [key]: type === 'number'
                  ? (e.target.value ? Number(e.target.value) : null)
                  : e.target.value,
              })
            }
            className="w-full rounded-sm border border-border bg-secondary px-3 py-2 font-sans text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-foreground/40 focus:outline-none"
          />
        </div>
      ))}
    </div>
  );
}
