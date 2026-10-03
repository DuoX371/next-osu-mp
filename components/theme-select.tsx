'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { Check, ChevronUp, Monitor, Moon, Sun } from 'lucide-react';

type Theme = 'system' | 'light' | 'dark';

const STORAGE_KEY = 'osu-mp-theme';
const THEME_EVENT = 'osu-mp-theme-change';
const THEMES = [
  { value: 'system', label: 'System', Icon: Monitor },
  { value: 'light', label: 'Light', Icon: Sun },
  { value: 'dark', label: 'Dark', Icon: Moon },
] as const;

function getTheme(): Theme {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return saved === 'system' || saved === 'light' || saved === 'dark' ? saved : 'dark';
  } catch {
    return 'dark';
  }
}

function subscribe(onChange: () => void) {
  window.addEventListener('storage', onChange);
  window.addEventListener(THEME_EVENT, onChange);

  return () => {
    window.removeEventListener('storage', onChange);
    window.removeEventListener(THEME_EVENT, onChange);
  };
}

export function ThemeSelect() {
  const theme = useSyncExternalStore(subscribe, getTheme, () => 'dark');
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const current = THEMES.find((option) => option.value === theme) ?? THEMES[2];
  const CurrentIcon = current.Icon;

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  function changeTheme(nextTheme: Theme) {
    try {
      window.localStorage.setItem(STORAGE_KEY, nextTheme);
    } catch {
      // The selected theme still applies for this visit when storage is unavailable.
    }

    const isDark = nextTheme === 'dark' ||
      (nextTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.classList.toggle('dark', isDark);
    window.dispatchEvent(new Event(THEME_EVENT));
    setOpen(false);
    triggerRef.current?.focus();
  }

  return (
    <div ref={containerRef} className="fixed bottom-4 left-4 z-50">
      {open && (
        <div
          id="theme-options"
          role="group"
          aria-label="Theme"
          className="absolute bottom-full left-0 mb-2 w-40 rounded-xl border border-border bg-background/95 p-1 shadow-xl shadow-black/15 backdrop-blur-xl"
        >
          {THEMES.map(({ value, label, Icon }) => (
            <button
              key={value}
              type="button"
              aria-pressed={theme === value}
              onClick={() => changeTheme(value)}
              className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs transition-colors hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${theme === value ? 'bg-secondary text-foreground' : 'text-muted-foreground'}`}
            >
              <Icon size={15} aria-hidden="true" />
              <span className="flex-1">{label}</span>
              {theme === value && <Check size={14} aria-hidden="true" />}
            </button>
          ))}
        </div>
      )}
      <button
        ref={triggerRef}
        type="button"
        aria-label={`Theme: ${current.label}. Choose theme`}
        aria-expanded={open}
        aria-controls={open ? 'theme-options' : undefined}
        onClick={() => setOpen((value) => !value)}
        className="inline-flex items-center gap-2 rounded-full border border-border bg-background/90 px-3 py-2 font-mono text-xs text-foreground shadow-lg shadow-black/10 backdrop-blur-xl transition-colors hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        <CurrentIcon size={15} aria-hidden="true" />
        <span>{current.label}</span>
        <ChevronUp size={13} aria-hidden="true" className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
    </div>
  );
}
