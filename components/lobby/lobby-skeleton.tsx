export function LobbySkeleton() {
  return (
    <div className="border-t border-border first:border-t-0 px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="h-3 w-24 animate-pulse rounded-sm bg-secondary" />
        <div className="h-4 w-14 animate-pulse rounded-sm bg-secondary" />
        <div className="h-3 flex-1 animate-pulse rounded-sm bg-secondary" />
        <div className="h-3 w-16 animate-pulse rounded-sm bg-secondary" />
      </div>
    </div>
  );
}