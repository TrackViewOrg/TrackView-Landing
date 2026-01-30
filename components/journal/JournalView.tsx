'use client';

import React, { useEffect, useState } from 'react';
import { Loader2, Search } from 'lucide-react';
import Link from 'next/link';
import { BlogPost, getPosts } from '@/lib/github';

export default function JournalView() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [cdnUrl, setCdnUrl] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { posts, cdnUrl } = await getPosts();
        setPosts(posts);
        setCdnUrl(cdnUrl);
      } catch (err) {
        console.error('Failed to load journal entries:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full flex flex-col gap-8">
      {/* Search Bar */}
      <div className="relative w-full max-w-md group">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/70 pointer-events-none">
          <Search size={18} strokeWidth={2} />
        </div>
        <input
          type="text"
          placeholder="Search articles..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-muted/30 focus:bg-muted/50 border border-transparent focus:border-border rounded-lg outline-none transition-colors text-sm placeholder:text-muted-foreground/50"
        />
      </div>

      {/* Content Area */}
      <div className="min-h-[50vh]">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : (
          <>
            {filteredPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
                {filteredPosts.map((post) => (
                  <BlogCard key={post.id} post={post} cdnUrl={cdnUrl} />
                ))}
              </div>
            ) : (
              <div className="py-20 text-center border border-dashed border-border/60 rounded-lg">
                <p className="text-muted-foreground text-sm">
                  No articles found matching "{searchQuery}".
                </p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="mt-2 text-sm font-medium text-foreground hover:underline underline-offset-4"
                >
                  Clear search
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function BlogCard({ post, cdnUrl }: { post: BlogPost; cdnUrl: string }) {
  const [imgStatus, setImgStatus] = useState<'loading' | 'loaded' | 'error'>(
    'loading'
  );

  const date = new Date(post.created_at * 1000).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const imageUrl = `${cdnUrl}/Blog/headers/${post.id}.webp`;

  return (
    <Link
      href={`/journal/${post.id}`}
      className="group flex flex-col gap-3 h-full"
    >
      {/* Image Container */}
      <div className="w-full aspect-[16/10] relative overflow-hidden rounded-lg bg-muted/20 border border-border/40">
        {/* 1. Spinner: Only visible while loading */}
        {imgStatus === 'loading' && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted/20 z-10">
            <Loader2 className="w-5 h-5 text-muted-foreground/50 animate-spin" />
          </div>
        )}

        {/* 2. Error State */}
        {imgStatus === 'error' && (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/30">
            <span className="text-[10px] uppercase tracking-widest font-semibold">
              No Image
            </span>
          </div>
        )}

        {/* 3. Image & Overlay Wrapper */}
        <img
          src={imageUrl}
          alt={post.title}
          loading="lazy"
          onLoad={() => setImgStatus('loaded')}
          onError={() => setImgStatus('error')}
          className={`w-full h-full object-cover transition-opacity duration-500 ease-in-out
                        ${imgStatus === 'loaded' ? 'opacity-100' : 'opacity-0'}
                    `}
        />

        {/* 4. OVERLAY: Only render if image is LOADED */}
        {imgStatus === 'loaded' && (
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[1px]">
            <span className="flex items-center gap-2 text-white font-medium text-sm tracking-wide px-2 border-border/20 border bg-background/70 py-1 rounded-sm backdrop-blur-xl">
              Read Article
            </span>
          </div>
        )}
      </div>

      {/* Text Content */}
      <div className="flex flex-col px-1">
        <time className="text-[11px] font-semibold text-muted-foreground/70 uppercase tracking-widest">
          {date}
        </time>
        <h2 className="text-3xl font-bold text-foreground font-serif leading-snug group-hover:text-primary transition-colors line-clamp-2">
          {post.title}
        </h2>
      </div>
    </Link>
  );
}

function SkeletonCard() {
  return (
    <div className="flex flex-col gap-3 animate-pulse">
      <div className="w-full aspect-[16/10] bg-muted/40 rounded-lg"></div>
      <div className="flex flex-col gap-2 px-1">
        <div className="h-3 w-20 bg-muted/40 rounded"></div>
        <div className="h-5 w-full bg-muted/40 rounded"></div>
        <div className="h-5 w-2/3 bg-muted/40 rounded"></div>
      </div>
    </div>
  );
}
