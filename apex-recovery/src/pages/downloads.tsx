import React, {useState, useMemo} from 'react';
import {useReleases, Release} from '@/hooks/use-releases';
import {motion} from 'framer-motion';
import {
  Search,
  Download,
  AlertCircle,
  Calendar,
  Smartphone,
  Box,
  Terminal,
  Hash,
  ChevronDown,
  ExternalLink,
} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Card, CardContent} from '@/components/ui/card';
import {Badge} from '@/components/ui/badge';
import {Skeleton} from '@/components/ui/skeleton';
import {format} from 'date-fns';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ParsedRelease extends Release {
  parsed: {
    manufacturer: string;
    deviceFullName: string;
    codename: string;
    version: string;
    androidVersion: string;
    partitionType: string;
    changelog: string;
  };
}

// ---------------------------------------------------------------------------
// Release parsing helpers
// ---------------------------------------------------------------------------

/**
 * Parses a GitHub release into structured device metadata.
 *
 * Expected conventions:
 *   - Title:   "[Manufacturer Device Name] Apex Recovery v<version>"
 *   - Tag:     "<codename>-v<version>"
 *   - Body:    Markdown with "Android version: X", "Type: Y", and a
 *              "Changelog" section.
 */
function parseRelease(release: Release): ParsedRelease {
  const bodyText = release.body || '';

  const titleMatch = (release.name || '').match(/\[(.*?)\]/);
  const deviceFullName = titleMatch ? titleMatch[1] : 'Unknown Device';
  const parts = deviceFullName.split(' ');
  const manufacturer = parts.length > 0 && parts[0] !== 'Unknown' ? parts[0] : 'Unknown';

  const tagName = release.tag_name || '';
  const vIndex = tagName.lastIndexOf('-v');
  
  let codename = tagName;
  let version = tagName;
  
  if (vIndex !== -1) {
    codename = tagName.substring(0, vIndex);
    version = tagName.substring(vIndex + 2);
  }

  const androidMatch = bodyText.match(/Android(?:\sversion)?[*]*:\s*([^\n\r]+)/i);
  const typeMatch = bodyText.match(/(?:Partition\s)?Type[*]*:\s*([^\n\r]+)/i);
  
  const androidVersion = androidMatch ? androidMatch[1].trim() : 'Unknown';
  const partitionType = typeMatch ? typeMatch[1].trim() : 'A/B';

  const [, rawChangelog = ''] = bodyText.split(/Changelog/i);
  const changelog = rawChangelog
    .trim()
    .replace(/^[:\s*-]+/i, '')
    .replace(/^#+\s/gm, '')
    .replace(/^- /gm, '• ');

  return {
    ...release,
    parsed: {
      manufacturer,
      deviceFullName,
      codename,
      version,
      androidVersion,
      partitionType,
      changelog: changelog || 'No changelog provided.',
    },
  };
}

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

export function Downloads() {
  const {data: releases, isLoading, error} = useReleases();
  const [searchQuery, setSearchQuery] = useState('');

  const parsedReleases = useMemo<ParsedRelease[]>(() => {
    if (!releases || !Array.isArray(releases)) return [];
    return releases.map(parseRelease);
  }, [releases]);

  const filteredReleases = useMemo(() => {
    if (!searchQuery.trim()) return parsedReleases;
    const q = searchQuery.toLowerCase();
    return parsedReleases.filter(
      (r) =>
        r.parsed.deviceFullName.toLowerCase().includes(q) ||
        r.parsed.codename.toLowerCase().includes(q) ||
        r.parsed.manufacturer.toLowerCase().includes(q),
    );
  }, [parsedReleases, searchQuery]);

  return (
    <div className="flex flex-col w-full min-h-[calc(100vh-200px)]">
      <section className="bg-card/50 border-b border-border/50 py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-primary/8 rounded-full blur-[100px] pointer-events-none" />
        <div className="container mx-auto px-4 sm:px-8 max-w-5xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/60 border border-border/50 text-xs font-medium mb-6 text-muted-foreground">
            <span className="flex h-1.5 w-1.5 rounded-full bg-accent" />
            Official Builds
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-5 tracking-tight">
            Downloads
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mb-10 leading-relaxed">
            Latest official builds of Apex Recovery — signed, tested, and built
            directly from open-source device trees.
          </p>
          <div className="relative max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Device name, manufacturer, or codename…"
              className="h-12 pl-11 pr-4 bg-background border-border/50 rounded-xl focus-visible:ring-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 container mx-auto px-4 sm:px-8 max-w-5xl flex-1">
        {isLoading ? (
          <div className="space-y-5">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden border-border/50 bg-card">
                <CardContent className="p-0">
                  <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6">
                    <div className="flex-1 space-y-4">
                      <Skeleton className="h-7 w-56" />
                      <Skeleton className="h-4 w-40" />
                      <div className="flex gap-2">
                        <Skeleton className="h-6 w-16 rounded-full" />
                        <Skeleton className="h-6 w-20 rounded-full" />
                      </div>
                    </div>
                    <div className="w-full md:w-44 space-y-3">
                      <Skeleton className="h-11 w-full rounded-xl" />
                      <Skeleton className="h-11 w-full rounded-xl" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center text-destructive mb-6">
              <AlertCircle className="h-7 w-7" />
            </div>
            <h3 className="text-2xl font-display font-bold mb-2">
              Failed to load releases
            </h3>
            <p className="text-muted-foreground max-w-md text-sm">
              Could not reach the GitHub API. Check your connection or try
              again later.
            </p>
          </motion.div>
        ) : filteredReleases.length === 0 ? (
          <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
              <Box className="h-7 w-7" />
            </div>
            {searchQuery ? (
              <>
                <h3 className="text-2xl font-display font-bold mb-2">
                  No devices found
                </h3>
                <p className="text-muted-foreground text-sm">
                  No builds match &ldquo;{searchQuery}&rdquo;.
                </p>
                <Button
                  variant="outline"
                  className="mt-6 rounded-xl"
                  onClick={() => setSearchQuery('')}
                >
                  Clear search
                </Button>
              </>
            ) : (
              <>
                <h3 className="text-2xl font-display font-bold mb-3">
                  Builds coming soon
                </h3>
                <p className="text-muted-foreground max-w-sm text-sm leading-relaxed">
                  We&apos;re preparing the first official device builds. Star
                  the repo to get notified.
                </p>
                <Button
                  asChild
                  variant="outline"
                  className="mt-8 rounded-xl gap-2"
                >
                  <a
                    href="https://github.com/Apex-Recovery"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Follow on GitHub <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </Button>
              </>
            )}
          </motion.div>
        ) : (
          <div className="space-y-5">
            {filteredReleases.map((release, i) => (
              <ReleaseCard key={release.id} release={release} index={i} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Release card
// ---------------------------------------------------------------------------

function ReleaseCard({release, index}: {release: ParsedRelease; index: number}) {
  const {parsed} = release;
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{opacity: 0, y: 16}}
      animate={{opacity: 1, y: 0}}
      transition={{duration: 0.4, delay: index * 0.05}}
      className="rounded-2xl border border-border/50 bg-card overflow-hidden hover:border-primary/40 transition-all hover:shadow-[0_0_30px_-10px_hsl(var(--primary)/0.2)] group"
    >
      <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6 md:gap-10">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5 mb-3 flex-wrap">
            <Badge className="bg-primary/15 text-primary hover:bg-primary/25 border-0 font-mono">
              v{parsed.version}
            </Badge>
            <Badge
              variant="outline"
              className="border-border/70 gap-1 font-mono text-xs"
            >
              <Terminal className="h-3 w-3" />
              {parsed.codename}
            </Badge>
            <span className="text-xs text-muted-foreground flex items-center gap-1 ml-auto md:ml-0">
              <Calendar className="h-3 w-3" />
              {format(new Date(release.published_at), 'MMM d, yyyy')}
            </span>
          </div>

          <h2 className="text-xl md:text-2xl font-display font-bold text-foreground mb-1 truncate group-hover:text-primary transition-colors">
            {parsed.deviceFullName}
          </h2>
          <p className="text-sm text-muted-foreground mb-5">
            {parsed.manufacturer}
          </p>

          <div className="grid grid-cols-2 gap-3 mb-5 p-4 rounded-xl bg-secondary/25 border border-border/40">
            <div>
              <span className="text-[10px] text-muted-foreground block mb-1.5 uppercase tracking-widest font-semibold">
                Android
              </span>
              <div className="flex items-center gap-1.5 text-sm font-medium">
                <Smartphone className="h-3.5 w-3.5 text-primary" />
                {parsed.androidVersion}
              </div>
            </div>
            <div>
              <span className="text-[10px] text-muted-foreground block mb-1.5 uppercase tracking-widest font-semibold">
                Partition
              </span>
              <div className="flex items-center gap-1.5 text-sm font-medium">
                <Hash className="h-3.5 w-3.5 text-accent" />
                {parsed.partitionType}
              </div>
            </div>
          </div>

          {parsed.changelog && (
            <div>
              <button
                onClick={() => setExpanded(!expanded)}
                className="flex items-center gap-1.5 text-sm text-primary font-medium hover:underline"
              >
                Changelog
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-200 ${
                    expanded ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {expanded && (
                <motion.div
                  initial={{opacity: 0, height: 0}}
                  animate={{opacity: 1, height: 'auto'}}
                  className="mt-3 p-4 rounded-xl bg-background border border-border/50 text-muted-foreground"
                >
                  <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                    {parsed.changelog}
                  </pre>
                </motion.div>
              )}
            </div>
          )}
        </div>

        <div className="w-full md:w-52 shrink-0 flex flex-col gap-2.5 justify-center border-t md:border-t-0 md:border-l border-border/40 pt-6 md:pt-0 md:pl-8">
          <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground mb-1">
            Downloads
          </span>
          {release.assets.length > 0 ? (
            release.assets.map((asset) => {
              const isImg = asset.name.endsWith('.img');
              const isZip = asset.name.endsWith('.zip');
              return (
                <Button
                  key={asset.id}
                  asChild
                  variant={isImg ? 'default' : 'secondary'}
                  className="w-full justify-start h-11 rounded-xl"
                >
                  <a href={asset.browser_download_url}>
                    <Download className="mr-2 h-4 w-4 shrink-0" />
                    <div className="flex flex-col items-start overflow-hidden">
                      <span className="truncate w-full text-left text-sm">
                        {isImg
                          ? 'Recovery Image'
                          : isZip
                          ? 'Flashable ZIP'
                          : asset.name}
                      </span>
                      <span className="text-[10px] opacity-60 font-normal">
                        {(asset.size / 1024 / 1024).toFixed(1)} MB
                      </span>
                    </div>
                  </a>
                </Button>
              );
            })
          ) : (
            <div className="text-sm text-muted-foreground bg-secondary/40 p-3 rounded-xl text-center">
              No files yet
            </div>
          )}
          <Button
            asChild
            variant="ghost"
            className="w-full mt-1 text-xs text-muted-foreground hover:text-foreground gap-1.5 rounded-xl"
          >
            <a href={release.html_url} target="_blank" rel="noreferrer">
              View on GitHub <ExternalLink className="h-3 w-3" />
            </a>
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
