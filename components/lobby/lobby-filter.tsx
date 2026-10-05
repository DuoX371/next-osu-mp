'use client';

import { useQueryStates, parseAsString, parseAsInteger, parseAsArrayOf } from 'nuqs';
import { useEffect, useMemo, useState } from 'react';
import { X } from 'lucide-react';

type Filter = {
  username?: string;
  title?: string;
  beatmapIds?: number[];
  playerId?: number;
};

type Props = {
  onChange: (filter: Filter) => void;
};

const fields = [
  { key: 'username', label: 'Username', placeholder: 'Ramizel' },
  { key: 'title',    label: 'Title',    placeholder: 'amongus' },
] as const;
const MAX_BEATMAP_IDS = 5;

export function LobbyFilter({ onChange }: Props) {
  const [params, setParams] = useQueryStates({
    username:  parseAsString.withDefault(''),
    title:     parseAsString.withDefault(''),
    beatmapIds: parseAsArrayOf(parseAsInteger).withDefault([]),
    playerId:  parseAsInteger,
  });
  const [beatmapInput, setBeatmapInput] = useState('');
  const [beatmapError, setBeatmapError] = useState('');
  const beatmapIds = useMemo(
    () => [...new Set(params.beatmapIds.filter((id) => Number.isSafeInteger(id) && id > 0))].slice(0, MAX_BEATMAP_IDS),
    [params.beatmapIds],
  );

  function addBeatmapId(rawValue: string) {
    const value = rawValue.trim();
    const id = Number(value);

    if (!/^\d+$/.test(value) || !Number.isSafeInteger(id) || id <= 0) {
      setBeatmapError('Enter a valid beatmap ID.');
      return;
    }
    if (beatmapIds.includes(id)) {
      setBeatmapError('That beatmap ID is already added.');
      return;
    }
    if (beatmapIds.length >= MAX_BEATMAP_IDS) {
      setBeatmapError('You can add up to 5 beatmap IDs.');
      return;
    }

    void setParams({ beatmapIds: [...beatmapIds, id] });
    setBeatmapInput('');
    setBeatmapError('');
  }

  function removeBeatmapId(id: number) {
    void setParams({ beatmapIds: beatmapIds.filter((value) => value !== id) });
    setBeatmapError('');
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      onChange({
        username:  params.username  || undefined,
        title:     params.title     || undefined,
        beatmapIds: beatmapIds.length ? beatmapIds : undefined,
        playerId:  params.playerId  ?? undefined,
      });
    }, 400);
    return () => clearTimeout(timer);
  }, [params.username, params.title, beatmapIds, params.playerId]);

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {fields.map(({ key, label, placeholder }) => (
        <div key={key} className="flex min-w-0 flex-col gap-1">
          <label htmlFor={key} className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            {label}
          </label>
          <input
            id={key}
            type="text"
            placeholder={placeholder}
            value={params[key]}
            onChange={(e) => void setParams({ [key]: e.target.value })}
            className="w-full rounded-sm border border-border bg-secondary px-3 py-2 font-sans text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-foreground/40 focus:outline-none"
          />
        </div>
      ))}

      <div className="flex min-w-0 flex-col gap-1">
        <label htmlFor="beatmap-id-input" className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          Beatmap IDs
        </label>
        <div className="flex min-w-0 gap-1">
          <input
            id="beatmap-id-input"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="1430354"
            value={beatmapInput}
            disabled={beatmapIds.length >= MAX_BEATMAP_IDS}
            onChange={(event) => {
              setBeatmapInput(event.target.value);
              setBeatmapError('');
            }}
            onPaste={(event) => {
              const pasted = event.clipboardData.getData('text').trim();
              const id = Number(pasted);
              if (!beatmapInput && /^\d+$/.test(pasted) && Number.isSafeInteger(id) && id > 0) {
                event.preventDefault();
                addBeatmapId(pasted);
              }
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                addBeatmapId(beatmapInput);
              }
            }}
            aria-invalid={!!beatmapError}
            aria-describedby={beatmapError ? 'beatmap-id-hint beatmap-id-error' : 'beatmap-id-hint'}
            className="min-w-0 flex-1 rounded-sm border border-border bg-secondary px-3 py-2 font-sans text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-foreground/40 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          />
          <button
            type="button"
            onClick={() => addBeatmapId(beatmapInput)}
            disabled={beatmapIds.length >= MAX_BEATMAP_IDS}
            className="shrink-0 rounded-sm border border-border bg-secondary px-2.5 font-mono text-xs text-foreground transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-50"
          >
            Add
          </button>
        </div>
        <p id="beatmap-id-hint" className="font-mono text-[10px] text-muted-foreground">
          {beatmapIds.length >= MAX_BEATMAP_IDS
            ? 'Maximum of 5 beatmap IDs reached'
            : 'Paste to add · Enter after typing'}
        </p>
        {beatmapError && (
          <p id="beatmap-id-error" role="alert" className="text-xs text-destructive">
            {beatmapError}
          </p>
        )}
        {beatmapIds.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1" aria-label="Selected beatmap IDs">
            {beatmapIds.map((id) => (
              <span key={id} className="inline-flex items-center gap-1 rounded-sm border border-border bg-secondary px-2 py-1 font-mono text-[11px] text-foreground">
                {id}
                <button
                  type="button"
                  onClick={() => removeBeatmapId(id)}
                  aria-label={`Remove beatmap ID ${id}`}
                  className="rounded-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  <X size={12} aria-hidden="true" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-col gap-1">
        <label htmlFor="player-id-input" className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          Player ID
        </label>
        <input
          id="player-id-input"
          type="number"
          placeholder="9560694"
          value={params.playerId ?? ''}
          onChange={(e) => void setParams({ playerId: e.target.value ? Number(e.target.value) : null })}
          className="w-full rounded-sm border border-border bg-secondary px-3 py-2 font-sans text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-foreground/40 focus:outline-none"
        />
      </div>
    </div>
  );
}
