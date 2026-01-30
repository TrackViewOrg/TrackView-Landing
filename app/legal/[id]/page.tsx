// app/legal/[id]/page.tsx
import React from 'react';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getLegalDocument } from '@/lib/github';
import { LEGAL_MARKDOWN_THEME } from '@/components/MarkdownStyles';

// ------------------------------------------------------------------
// 2. Page Component
// ------------------------------------------------------------------

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function LegalPage(props: PageProps) {
  const params = await props.params;
  const { id } = params;

  const markdownContent = await getLegalDocument(id);

  if (!markdownContent) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background text-foreground py-12 px-4 sm:px-6">
      {/* Paper Container - Simulates a physical document */}
      <article className="max-w-[850px] mx-auto bg-background md:shadow-sm p-6 md:p-16  animate-in fade-in duration-500">
        <div className="max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={LEGAL_MARKDOWN_THEME}
          >
            {markdownContent}
          </ReactMarkdown>
        </div>

        {/* Formal Footer / Witness Area */}
        <div className="mt-20 pt-10 border-t border-foreground/20">
          <div className="grid md:grid-cols-2 gap-8 text-sm font-sans text-foreground/60">
            <div>
              <p className="font-bold text-foreground mb-1">TrackView</p>
              <p>Legal</p>
            </div>
            <div className="md:text-right">
              <p>
                This document is automatically synchronized with our open-source
                governance repository.
              </p>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
