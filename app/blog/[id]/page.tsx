import React from "react";
import Link from "next/link";
import { ArrowLeft, Calendar } from "lucide-react";
import ReactMarkdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";

// ------------------------------------------------------------------
// 1. Configuration & Types
// ------------------------------------------------------------------
const REPO_USER = "TrackViewOrg";
const REPO_NAME = "TrackView-Data";
const DEFAULT_BRANCH = "main";

interface PostMetadata {
  id: string;
  title: string;
  created_at: number;
  [key: string]: any;
}

interface ArticleData {
  metadata: PostMetadata;
  content: string;
  baseUrl: string;
}

// ------------------------------------------------------------------
// 2. Extracted Markdown Theme
// ------------------------------------------------------------------
const MARKDOWN_THEME: Components = {
  h1: (props) => (
      <h1
          className="text-3xl md:text-4xl font-serif font-bold mt-16 mb-6 text-foreground tracking-tight"
          {...props}
      />
  ),
  h2: (props) => (
      <h2
          className="text-2xl md:text-3xl font-serif font-bold mt-14 mb-6 text-foreground pb-3 border-b-2 border-border/50 tracking-tight"
          {...props}
      />
  ),
  h3: (props) => (
      <h3
          className="text-xl md:text-2xl font-serif font-semibold mt-12 mb-4 text-foreground tracking-tight"
          {...props}
      />
  ),
  h4: (props) => (
      <h4
          className="text-lg md:text-xl font-serif font-semibold mt-10 mb-3 text-foreground/95"
          {...props}
      />
  ),
  p: (props) => (
      <p
          className="mb-6 leading-[1.8] text-foreground/90 text-base md:text-lg font-light"
          {...props}
      />
  ),
  a: (props) => (
      <a
          className="text-primary font-medium hover:text-primary/80 underline decoration-primary/30 hover:decoration-primary/60 underline-offset-4 transition-all duration-200"
          {...props}
      />
  ),
  ul: (props) => (
      <ul
          className="list-disc list-outside ml-6 mb-8 space-y-2 text-foreground/90 leading-relaxed"
          {...props}
      />
  ),
  ol: (props) => (
      <ol
          className="list-decimal list-outside ml-6 mb-8 space-y-2 text-foreground/90 leading-relaxed"
          {...props}
      />
  ),
  li: (props) => <li className="pl-2 text-base md:text-lg" {...props} />,
  blockquote: (props) => (
      <blockquote
          className="relative border-l-4 border-primary/60 pl-8 pr-6 py-5 my-10 italic bg-gradient-to-r from-muted/30 to-transparent rounded-r-xl text-foreground/85 leading-relaxed text-lg before:content-['\201C'] before:absolute before:left-3 before:top-2 before:text-4xl before:text-primary/40 before:font-serif"
          {...props}
      />
  ),
  code: ({ className, children, ...props }: any) => {
    const isInline = !String(children).includes("\n");
    return isInline ? (
        <code
            className="bg-muted/80 px-2 py-0.5 rounded-md text-[0.9em] font-mono text-foreground font-medium border border-border/50 whitespace-nowrap"
            {...props}
        >
          {children}
        </code>
    ) : (
        <pre className="bg-gradient-to-br from-muted/50 to-muted/30 p-6 rounded-xl overflow-x-auto my-10 border border-border/60 shadow-lg">
        <code
            className="text-sm md:text-base font-mono text-foreground leading-relaxed"
            {...props}
        >
          {children}
        </code>
      </pre>
    );
  },
  img: (props) => (
      <figure className="my-12 group">
        <div className="overflow-hidden rounded-xl border border-border/50 shadow-lg transition-shadow duration-300 group-hover:shadow-xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
              className="w-full transition-transform duration-300 group-hover:scale-[1.02]"
              alt={props.alt || ""}
              {...props}
          />
        </div>
        {props.title && (
            <figcaption className="text-center text-sm text-muted-foreground mt-4 italic font-light">
              {props.title}
            </figcaption>
        )}
      </figure>
  ),
  hr: (props) => (
      <hr
          className="my-16 border-0 h-px bg-gradient-to-r from-transparent via-border to-transparent"
          {...props}
      />
  ),
  table: (props) => (
      <div className="overflow-x-auto my-10 rounded-lg border border-border shadow-sm">
        <table
            className="w-full border-collapse text-sm md:text-base"
            {...props}
        />
      </div>
  ),
  th: (props) => (
      <th
          className="border-b-2 border-border p-4 text-left font-semibold text-foreground bg-muted/40 first:rounded-tl-lg last:rounded-tr-lg"
          {...props}
      />
  ),
  td: (props) => (
      <td
          className="border-b border-border/50 p-4 text-foreground/80"
          {...props}
      />
  ),
  tr: (props) => (
      <tr className="transition-colors hover:bg-muted/20" {...props} />
  ),
};

// ------------------------------------------------------------------
// 3. Data Fetching (Server-Side)
// ------------------------------------------------------------------

async function getDynamicCdnRoot() {
  try {
    const res = await fetch(
        `https://api.github.com/repos/${REPO_USER}/${REPO_NAME}/commits/${DEFAULT_BRANCH}`,
        {
          cache: "no-store",
        },
    );

    if (res.ok) {
      const data = await res.json();
      return `https://cdn.jsdelivr.net/gh/${REPO_USER}/${REPO_NAME}@${data.sha}`;
    }
  } catch (error) {
    console.warn(
        "GitHub API fetch failed, falling back to default branch.",
        error,
    );
  }
  return `https://cdn.jsdelivr.net/gh/${REPO_USER}/${REPO_NAME}@${DEFAULT_BRANCH}`;
}

async function getArticleData(id: string): Promise<ArticleData | null> {
  try {
    const baseUrl = await getDynamicCdnRoot();
    const [metadataRes, contentRes] = await Promise.all([
      fetch(`${baseUrl}/Blog/posts.json`, { cache: "no-store" }),
      fetch(`${baseUrl}/Blog/articles/${id}.md`, { cache: "no-store" }),
    ]);

    if (!metadataRes.ok || !contentRes.ok) return null;

    const postsData = await metadataRes.json();
    const metadata = postsData.posts.find((p: any) => p.id === id);
    const content = await contentRes.text();

    if (!metadata) return null;

    return { metadata, content, baseUrl };
  } catch (error) {
    console.error("Failed to fetch article:", error);
    return null;
  }
}

// ------------------------------------------------------------------
// 4. Main Component
// ------------------------------------------------------------------
export default async function ArticlePage({
                                            params,
                                          }: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getArticleData(id);

  if (!data) return <NotFoundState />;

  const { metadata, content, baseUrl } = data;
  const headerImage = `${baseUrl}/Blog/headers/${id}.webp`;

  const formattedDate = new Date(metadata.created_at * 1000).toLocaleDateString(
      "en-US",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
      },
  );

  return (
      // 1. Root Container: Fixed height (h-screen) with column layout
      <div className="h-screen flex flex-col overflow-hidden bg-background text-foreground">

        {/* 2. Navigation: Fixed (non-scrolling) header area */}
        <nav className="flex-none border-b border-border/40 bg-background/95 backdrop-blur z-10">
          <div className="max-w-4xl mx-auto px-6 py-6">
            <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group text-sm font-medium"
            >
              <ArrowLeft
                  size={16}
                  className="group-hover:-translate-x-1 transition-transform"
              />
              Back to Writings
            </Link>
          </div>
        </nav>

        {/* 3. Scroll Area: Takes remaining space (flex-1) and handles scrolling */}
        <div className="flex-1 overflow-y-auto scroll-smooth">
          <article className="max-w-4xl mx-auto px-6 pt-10 pb-20 animate-in fade-in duration-500">
            {/* Header Section */}
            <header className="mb-12 flex flex-col gap-6">
              <div className="space-y-4">
                  <div className="w-full h-70 aspect-video relative overflow-hidden rounded-2xl border border-border/50 bg-muted/30 shadow-sm mt-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                          src={headerImage}
                          alt={metadata.title}
                          className="w-full h-full object-cover"
                          style={{ objectPosition: "center center" }}
                      />
                  </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground font-medium tracking-wide uppercase">
                <span className="flex items-center gap-1.5">
                  <Calendar size={14} />
                  {formattedDate}
                </span>
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold leading-tight text-foreground">
                  {metadata.title}
                </h1>
              </div>
            </header>

            {/* Markdown Content */}
            <div className="max-w-none">
              <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={MARKDOWN_THEME}
              >
                {content}
              </ReactMarkdown>
            </div>

            {/* Footer */}
            <hr className="my-16 border-border" />
            <div className="flex justify-center">
              <Link
                  href="/blog"
                  className="px-8 py-3 rounded-full bg-primary/5 hover:bg-primary/10 text-primary transition-colors font-medium"
              >
                Read more articles
              </Link>
            </div>
          </article>
        </div>
      </div>
  );
}

// ------------------------------------------------------------------
// 5. Helper Components
// ------------------------------------------------------------------

function NotFoundState() {
  return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-6">
        <h2 className="text-3xl font-serif font-bold">Article not found</h2>
        <p className="text-muted-foreground">
          The article you are looking for doesn&apos;t exist or could not be
          loaded.
        </p>
        <Link
            href="/blog"
            className="text-primary hover:underline underline-offset-4 mt-2"
        >
          Go back home
        </Link>
      </div>
  );
}