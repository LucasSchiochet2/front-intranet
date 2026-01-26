import { notFound } from 'next/navigation';
import { getPageBySlug } from '@/app/api';
import React from 'react';

interface PageProps {
  params: Promise<{ slug: string }> | { slug: string };
}

export default async function PaginaInterna({ params }: PageProps) {
  const resolvedParams = await params;
  const page = await getPageBySlug(resolvedParams.slug);

  if (!page) return notFound();

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-4">{page.title}</h1>
      <article
        className="prose prose-lg"
        dangerouslySetInnerHTML={{ __html: page.content ?? '' }}
      />
    </div>
  );
}