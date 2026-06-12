import {useQuery} from '@tanstack/react-query';

export interface ReleaseAsset {
  id: number;
  name: string;
  size: number;
  browser_download_url: string;
  created_at: string;
}

export interface Release {
  id: number;
  name: string;
  tag_name: string;
  body: string;
  published_at: string;
  html_url: string;
  assets: ReleaseAsset[];
}

const RELEASES_URL =
  'https://api.github.com/repos/Apex-Recovery/releases/releases';

/** Fetches all published Apex Recovery releases from the GitHub API. */
export function useReleases() {
  return useQuery<Release[], Error>({
    queryKey: ['apex-releases'],
    queryFn: async () => {
      const res = await fetch(RELEASES_URL);
      if (!res.ok) {
        // A 404 means the repo exists but has no releases yet — treat as empty.
        if (res.status === 404) return [];
        throw new Error('Failed to fetch releases from GitHub API');
      }
      return res.json();
    },
    staleTime: 1000 * 60 * 5,
  });
}
