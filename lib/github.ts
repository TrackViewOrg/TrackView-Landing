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
  // Default to @main
  let currentBaseUrl = `https://cdn.jsdelivr.net/gh/${REPO_USER}/${REPO_NAME}@${DEFAULT_BRANCH}`;

  try {
    // FIX: Add timestamp to URL to bust external caches
    const noCacheUrl = `https://api.github.com/repos/${REPO_USER}/${REPO_NAME}/commits/${DEFAULT_BRANCH}?t=${Date.now()}`;

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
      const commitData = await commitRes.json();
      // Upgrade to specific SHA
      currentBaseUrl = `https://cdn.jsdelivr.net/gh/${REPO_USER}/${REPO_NAME}@${commitData.sha}`;
      console.log(
        `[GitHub] Latest Commit SHA: ${commitData.sha.substring(0, 7)}`
      );
    } else {
      console.warn(`[GitHub] API Error: ${commitRes.status}`);
    }
  } catch (err) {
    console.warn(
      'Failed to fetch latest commit SHA, falling back to default branch.',
      err
    );
  }

  return currentBaseUrl;
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
    const [metadataRes, contentRes] = await Promise.all([
      fetch(`${baseUrl}/Blog/posts.json`, { next: { revalidate: 3600 } }),
      fetch(`${baseUrl}/Blog/articles/${id}.md`, {
        next: { revalidate: 3600 },
      }),
    ]);

    if (!metadataRes.ok || !contentRes.ok) return null;

    const postsData = await metadataRes.json();
    const metadata = postsData.posts.find((p: any) => p.id === id);
    const content = await contentRes.text();

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
    const postsRes = await fetch(`${baseUrl}/Blog/posts.json`, {
      next: { revalidate: 3600 },
    });

    if (!postsRes.ok)
      throw new Error(`Failed to fetch posts: ${postsRes.status}`);

    const postsData: PostsResponse = await postsRes.json();
    return { posts: postsData.posts || [], cdnUrl: baseUrl };
  } catch (err) {
    console.error('Failed to load journal entries:', err);
    return { posts: [], cdnUrl: baseUrl };
  }
}
