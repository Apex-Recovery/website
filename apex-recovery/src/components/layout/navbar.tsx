import React, {useState, useEffect} from 'react';
import {Link, useLocation} from 'wouter';
import {Moon, Sun, Menu, X} from 'lucide-react';
import {Button} from '@/components/ui/button';

function applyTheme(dark: boolean) {
  document.documentElement.classList.toggle('dark', dark);
}

export function Navbar() {
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)');

  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    // Fall back to the OS preference when the user has not set a manual override.
    return saved ? saved === 'dark' : systemDark.matches;
  });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    applyTheme(isDark);
  }, []);

  useEffect(() => {
    /**
     * Sync the theme with the OS in real time, but only when the user has not
     * stored a manual preference. If `localStorage.theme` is set, the toggle
     * button is treated as the source of truth and the OS listener is ignored.
     */
    const handler = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('theme')) {
        setIsDark(e.matches);
        applyTheme(e.matches);
      }
    };
    systemDark.addEventListener('change', handler);
    return () => systemDark.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, {passive: true});
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const toggleTheme = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    localStorage.setItem('theme', newDark ? 'dark' : 'light');
    applyTheme(newDark);
  };

  const navLinks = [{href: '/', label: 'Home'}];

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${
        scrolled
          ? 'border-border/60 bg-background/95 backdrop-blur-xl shadow-sm'
          : 'border-transparent bg-background/60 backdrop-blur-md'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-8 flex h-16 items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 transition-opacity hover:opacity-80"
        >
          <img
            src="/logo.png"
            alt="Apex Recovery"
            className="h-16 w-16 object-contain"
          />
          <span className="font-display font-bold text-lg tracking-tight">
            Apex Recovery
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:text-primary hover:bg-primary/5 ${
                location === link.href
                  ? 'text-primary bg-primary/8'
                  : 'text-muted-foreground'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="h-4 w-px bg-border mx-3" />
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="rounded-lg"
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <Button
            asChild
            className="ml-2 font-semibold bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl shadow-[0_0_20px_-5px_hsl(var(--primary)/0.5)]"
          >
            <Link href="/downloads">Get Apex</Link>
          </Button>
        </nav>

        <div className="flex md:hidden items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-lg"
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="rounded-lg"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden border-t border-border/40 bg-background/98 backdrop-blur-xl px-4 py-4">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  location === link.href
                    ? 'text-primary bg-primary/8'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Button asChild className="w-full justify-center mt-3 rounded-xl">
              <Link
                href="/downloads"
                onClick={() => setIsMenuOpen(false)}
              >
                Get Apex Recovery
              </Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
