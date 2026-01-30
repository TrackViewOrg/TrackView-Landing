import React from 'react';
import Section from '@/components/Section';
import JournalView from '@/components/journal/JournalView';

function Page() {
  return (
    <Section
      title={'Journal'}
      description={
        'A collection of thoughts, updates, and engineering articles.'
      }
    >
      <JournalView />
    </Section>
  );
}

export default Page;
