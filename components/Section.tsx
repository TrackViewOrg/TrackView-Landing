import React from 'react';

function Section({
  children,
  title,
  description,
}: {
  children: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div
      className={
        'flex flex-col w-full h-full bg-background px-3 py-10 gap-6 md:px-12 md:py-16 md:gap-10 lg:px-32 xl:px-80'
      }
    >
      <div className="flex flex-col gap-3 md:gap-4">
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-foreground">
          {title}
        </h1>
        <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-prose md:max-w-2xl">
          {description}
        </p>
      </div>
      <div className="flex-1 min-h-0 w-full">{children}</div>
    </div>
  );
}

export default Section;
