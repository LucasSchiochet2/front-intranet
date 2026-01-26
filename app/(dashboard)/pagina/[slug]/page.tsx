import { notFound } from 'next/navigation';
import { getPageBySlug } from '@/app/api';
import { Metadata } from 'next';
import React from 'react';

interface PageProps {
  params: Promise<{ slug: string }>;
}

// 1. Geração Dinâmica de Metadados (SEO)
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPageBySlug(slug);

  if (!page) return { title: 'Página não encontrada' };

  return {
    title: page.title,
    description: page.extras || '',
  };
}

export default async function PaginaInterna({ params }: PageProps) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);

  if (!page) {
    notFound();
  }

  return (
    <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <header className="mb-8 border-b pb-8">
        <p className="text-primary font-extrabold text-4xl!" style={{ fontSize: '36px' }}>
          {page.title}
        </p>
      </header>
      
      <article className="prose prose-slate prose-lg max-w-none">
        <section 
          dangerouslySetInnerHTML={{ __html: page.content ?? '' }} 
        />
      </article>
    </main>
  );
}