import Link from 'next/link';
import { ThemeToggle } from '@/components/theme-toggle';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex h-16 items-center justify-between">
          <Link
            href="/"
            className="flex items-center space-x-2 transition-opacity hover:opacity-80"
          >
            <span className="text-xl font-bold">Computer Use Benchmark</span>
          </Link>

          <nav className="flex items-center gap-6">
            <Link
              href="/"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              WebArena
            </Link>
            <Link
              href="/econwebarena"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              EconWebArena
            </Link>
            <Link
              href="/visualwebarena"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              VisualWebArena
            </Link>
            <Link
              href="/osworld"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              OSWorld
            </Link>
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  );
}
