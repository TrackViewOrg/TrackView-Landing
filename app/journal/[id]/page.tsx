import React from 'react';
import Link from 'next/link';
import { Calendar } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getArticleData } from '@/lib/github';
import { JOURNAL_MARKDOWN_THEME } from '@/components/MarkdownStyles';

// ------------------------------------------------------------------
// 2. Main Component
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
    'en-US',
    {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
  );

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      {/* Reduced bottom padding from pb-20 to pb-10 */}
      <article className="max-w-4xl mx-auto px-6 pt-10 pb-10 animate-in fade-in duration-500">
        {/* Header Section */}
        <header className="mb-8 flex flex-col gap-6">
          <div className="space-y-6">
            {/* Header Image */}
            <div className="w-full h-[100px] md:h-[300px] relative overflow-hidden rounded-lg border border-border/40 bg-muted/20 shadow-sm mt-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={headerImage}
                alt={metadata.title}
                className="w-full h-full object-cover"
                style={{ objectPosition: 'center center' }}
              />
            </div>

            {/* Metadata Row */}
            <div className="flex items-center gap-4 border-b border-border pb-6">
              <span className="flex items-center gap-2 text-xs text-primary font-bold tracking-wide uppercase">
                <Calendar size={12} />
                {formattedDate}
              </span>
              {/* Optional: Add reading time or author here if available in metadata */}
            </div>

            {/* Main Title - Huge & Professional */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-extrabold leading-[1.1] text-foreground tracking-tight">
              {metadata.title}
            </h1>
          </div>
        </header>

        {/* Markdown Content */}
        <div className="max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={JOURNAL_MARKDOWN_THEME}
          >
            {content}
          </ReactMarkdown>
        </div>
      </article>
    </div>
  );
}

// ------------------------------------------------------------------
// 3. Helper Components
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
        href="/journal"
        className="text-primary hover:underline underline-offset-4 mt-2"
      >
        Go back
      </Link>
    </div>
  );
}
