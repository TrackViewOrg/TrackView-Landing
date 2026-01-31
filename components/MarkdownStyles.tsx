import React from 'react';
import { Components } from 'react-markdown';

// ------------------------------------------------------------------
// Journal Theme (Professional/Science Style)
// ------------------------------------------------------------------
export const JOURNAL_MARKDOWN_THEME: Components = {
  // Made bigger, serif, and tighter tracking for a headline look
  h1: (props) => (
    <h1
      className="text-5xl md:text-6xl font-serif font-bold mt-12 mb-8 text-foreground tracking-tight leading-[1.1]"
      {...props}
    />
  ),
  // Distinct section headers, kept very clean
  h2: (props) => (
    <h2
      className="text-3xl md:text-4xl font-serif font-bold mt-12 mb-6 text-foreground pb-2 border-b border-border/60 tracking-tight"
      {...props}
    />
  ),
  h3: (props) => (
    <h3
      className="text-2xl md:text-3xl font-serif font-semibold mt-8 mb-4 text-foreground tracking-tight"
      {...props}
    />
  ),
  h4: (props) => (
    <h4
      className="text-lg md:text-2xl font-archivo font-semibold mt-6 mb-3 text-foreground/95"
      {...props}
    />
  ),
  // CRITICAL FIX: Changed 'p' to 'div' to prevent Hydration Error (<figure> inside <p>)
  // Added 'text-justify' and serif font for scientific journal look
  p: (props) => (
    <div
      className="mb-6 leading-8 text-foreground/90 text-lg font-archivo font-light text-justify"
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
      className="list-disc list-outside ml-6 mb-6 space-y-2 text-foreground/90 text-lg leading-relaxed font-archivo"
      {...props}
    />
  ),
  ol: (props) => (
    <ol
      className="list-decimal list-outside ml-6 mb-6 space-y-2 text-foreground/90 text-lg leading-relaxed font-archivo"
      {...props}
    />
  ),
  li: (props) => <li className="pl-2" {...props} />,
  // Made blockquotes look like formal citations/theorems
  blockquote: (props) => (
    <blockquote
      className="relative border-l-4 border-primary/40 pl-6 py-4 my-8 bg-muted/20 text-foreground/85 leading-relaxed text-lg font-archivo italic"
      {...props}
    />
  ),
  // Simplified code blocks: Removed gradient, made it look like technical documentation
  code: ({
    className,
    children,
    ...props
  }: React.ComponentPropsWithoutRef<'code'>) => {
    const isInline = !String(children).includes('\n');
    return isInline ? (
      <code
        className="bg-muted px-1.5 py-0.5 rounded text-[0.9em] font-mono text-foreground border border-border/50"
        {...props}
      >
        {children}
      </code>
    ) : (
      <div className="bg-muted/30 p-6 rounded-lg overflow-x-auto my-8 border border-border/40 shadow-sm">
        <code
          className="text-sm md:text-base font-mono text-foreground leading-relaxed"
          {...props}
        >
          {children}
        </code>
      </div>
    );
  },
  // Removed scale animation, tightened margins
  img: (props) => (
    <figure className="my-8 w-full flex flex-col items-center">
      <div className="overflow-hidden rounded-lg border border-border/40 shadow-md">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="w-full h-auto object-cover"
          alt={props.alt || 'Article Image'}
          {...props}
        />
      </div>
      {props.title && (
        <figcaption className="text-center text-sm text-muted-foreground mt-3 font-medium tracking-wide uppercase">
          {props.title}
        </figcaption>
      )}
    </figure>
  ),
  hr: (props) => <hr className="my-10 border-0 h-px bg-border" {...props} />,
  table: (props) => (
    <div className="overflow-x-auto my-8 rounded border border-border shadow-sm">
      <table
        className="w-full border-collapse text-sm md:text-base font-serif"
        {...props}
      />
    </div>
  ),
  th: (props) => (
    <th
      className="border-b-2 border-border p-3 text-left font-bold text-foreground bg-muted/30 uppercase tracking-wider text-xs"
      {...props}
    />
  ),
  td: (props) => (
    <td
      className="border-b border-border/40 p-3 text-foreground/80 align-top"
      {...props}
    />
  ),
  tr: (props) => (
    <tr className="hover:bg-muted/10 transition-colors" {...props} />
  ),
};

// ------------------------------------------------------------------
// Legal Theme (Serious, Contract-style)
// ------------------------------------------------------------------
export const LEGAL_MARKDOWN_THEME: Components = {
  // Titles: Serif, bold, authoritative
  h1: (props) => (
    <h1
      className="text-4xl md:text-5xl font-serif font-bold mt-10 mb-8 text-foreground tracking-tight border-b-2 border-foreground/10 pb-4"
      {...props}
    />
  ),
  h2: (props) => (
    <h2
      className="text-2xl md:text-3xl font-serif font-bold mt-10 mb-4 text-foreground/90 tracking-tight uppercase"
      {...props}
    />
  ),
  h3: (props) => (
    <h3
      className="text-xl md:text-2xl font-serif font-semibold mt-8 mb-3 text-foreground/90 underline decoration-foreground/20 underline-offset-4"
      {...props}
    />
  ),
  // Body: Sans-serif for readability, justified like a contract
  p: (props) => (
    <div
      className="mb-5 leading-7 text-foreground/85 text-[18px] font-sans text-justify"
      {...props}
    />
  ),
  // Links: Underlined, distinctive but serious
  a: (props) => (
    <a
      className="text-primary font-semibold underline decoration-primary/40 hover:decoration-primary/100 underline-offset-2 transition-all"
      {...props}
    />
  ),
  // Lists: Indented heavily like legal clauses
  ul: (props) => (
    <ul
      className="list-disc list-outside ml-8 mb-6 space-y-2 text-foreground/85 font-sans leading-relaxed"
      {...props}
    />
  ),
  ol: (props) => (
    <ol
      className="list-decimal list-outside ml-8 mb-6 space-y-2 text-foreground/85 font-sans leading-relaxed marker:font-bold marker:text-foreground/70"
      {...props}
    />
  ),
  li: (props) => <li className="pl-2" {...props} />,
  // Blockquotes: Highlighted clauses
  blockquote: (props) => (
    <blockquote
      className="border-l-4 border-foreground/20 pl-6 py-2 my-8 bg-foreground/5 text-foreground/80 italic font-serif"
      {...props}
    />
  ),
  // Table: Strict borders
  table: (props) => (
    <div className="overflow-x-auto my-8 border border-foreground/20">
      <table className="w-full border-collapse text-sm font-sans" {...props} />
    </div>
  ),
  th: (props) => (
    <th
      className="border-b border-r border-foreground/20 last:border-r-0 p-3 text-left font-bold bg-foreground/5 uppercase text-xs tracking-wider"
      {...props}
    />
  ),
  td: (props) => (
    <td
      className="border-b border-r border-foreground/20 last:border-r-0 p-3 align-top"
      {...props}
    />
  ),
  hr: (props) => <hr className="my-10 border-foreground/10" {...props} />,
};
