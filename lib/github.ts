// lib/github.ts
const REPO_USER = 'TrackViewOrg';
const REPO_NAME = 'TrackView-Data';
const DEFAULT_BRANCH = 'main';

// --- Types ---
export interface BlogPost {
  id: string;
  title: string;
  created_at: number;

  [key: string]: unknown;
}

export interface PostsResponse {
  posts: BlogPost[];
}

export interface ArticleData {
  metadata: BlogPost;
  content: string;
  baseUrl: string;
}

async function getDynamicCdnRoot() {
  // Default to Raw GitHub content as fallback.
  // JsDelivr's branch URL (e.g. @main) has aggressive caching (up to 12h),
  // so if we fail to get the specific SHA, Raw GitHub is safer for freshness (5m cache).
  let currentBaseUrl = `https://raw.githubusercontent.com/${REPO_USER}/${REPO_NAME}/${DEFAULT_BRANCH}`;

  try {
    // Use refs endpoint which is lighter and returns the latest SHA directly
    const noCacheUrl = `https://api.github.com/repos/${REPO_USER}/${REPO_NAME}/git/refs/heads/${DEFAULT_BRANCH}?t=${Date.now()}`;

    const commitRes = await fetch(noCacheUrl, {
      // FIX: 'no-store' forces Next.js to NEVER cache this request.
      // It will check GitHub every single time you refresh.
      cache: 'no-store',
      headers: {
        // Optional: Good practice for GitHub API to avoid rate limits
        Accept: 'application/vnd.github.v3+json',
      },
    });

    if (commitRes.ok) {
      const refData = await commitRes.json();
      // refData.object.sha contains the commit SHA
      const sha = refData.object.sha;
      currentBaseUrl = `https://cdn.jsdelivr.net/gh/${REPO_USER}/${REPO_NAME}@${sha}`;
      console.log(`[GitHub] Latest Commit SHA: ${sha.substring(0, 7)}`);
    } else {
      console.warn(
        `[GitHub] API Error: ${commitRes.status}. Using Raw GitHub fallback.`
      );
    }
  } catch (err) {
    console.warn(
      'Failed to fetch latest commit SHA, falling back to Raw GitHub.',
      err
    );
  }

  return currentBaseUrl;
}

// Helper to parse JSON that might have syntax errors (like unquoted keys)
async function fetchAndParseJson<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(url, options);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);

  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch (e) {
    console.warn(`JSON parse failed for ${url}, attempting repair...`, e);
    try {
      const fixedText = text
        // Fix unquoted keys: { key: value } -> { "key": value }
        .replace(/([{,]\s*)([a-zA-Z0-9_]+)\s*:/g, '$1"$2":')
        // Fix single-quoted keys: { 'key': value } -> { "key": value }
        .replace(/([{,]\s*)'([^']+)'\s*:/g, '$1"$2":')
        // Fix trailing commas: { a: 1, } -> { a: 1 }
        .replace(/,(\s*[}\]])/g, '$1');

      return JSON.parse(fixedText);
    } catch (repairError) {
      console.error(`Failed to repair JSON for ${url}`, text);
      throw e;
    }
  }
}

export async function getLegalDocument(id: string) {
  try {
    // 1. Always get the absolute latest SHA
    const baseUrl = await getDynamicCdnRoot();

    // 2. Construct the URL
    const url = `${baseUrl}/Blog/Legal/${id}.md`;

    // 3. Fetch the content
    // Since the URL now changes with every commit (due to the SHA),
    // we can safely cache THIS response heavily.
    const res = await fetch(url, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error(`Failed to fetch legal document: ${res.status}`);
    }

    return await res.text();
  } catch (error) {
    console.error('Error fetching legal document:', error);
    return null;
  }
}

export async function getArticleData(id: string): Promise<ArticleData | null> {
  try {
    const baseUrl = await getDynamicCdnRoot();

    // Fetch content first
    const contentRes = await fetch(`${baseUrl}/Blog/articles/${id}.md`, {
      next: { revalidate: 3600 },
    });

    if (!contentRes.ok) return null;
    const content = await contentRes.text();

    // Fetch metadata using safe parser
    let postsData: PostsResponse;
    try {
      postsData = await fetchAndParseJson<PostsResponse>(
        `${baseUrl}/Blog/posts.json`,
        { next: { revalidate: 3600 } }
      );
    } catch (e) {
      console.error('Failed to fetch/parse posts metadata', e);
      return null;
    }

    const metadata = postsData.posts.find((p: any) => p.id === id);

    if (!metadata) return null;

    return { metadata, content, baseUrl };
  } catch (error) {
    console.error('Failed to fetch article:', error);
    return null;
  }
}

export async function getPosts(): Promise<{
  posts: BlogPost[];
  cdnUrl: string;
}> {
  const baseUrl = await getDynamicCdnRoot();
  try {
    const postsData = await fetchAndParseJson<PostsResponse>(
      `${baseUrl}/Blog/posts.json`,
      {
        next: { revalidate: 3600 },
      }
    );

    return { posts: postsData.posts || [], cdnUrl: baseUrl };
  } catch (err) {
    console.error('Failed to load journal entries:', err);
    return { posts: [], cdnUrl: baseUrl };
  }
}
