import React from 'react';
import Link from 'next/link';
import { searchIntranet } from '../../api';

type Document = {
  id: string | number;
  title?: string | null;
  description?: string | null;
  preview?: string | null;
  category_id?: number | null;
};

type NewsItem = {
  id: number;
  slug?: string | null;
  title?: string | null;
  preview?: string | null;
  content?: string | null;
  published_at?: string | null;
};

type CalendarItem = {
  id: number;
  title?: string | null;
  preview?: string | null;
  event_date?: string | null;
};

type PageItem = {
  id: number;
  title?: string | null;
  slug?: string | null;
  preview?: string | null;
};

type BannerItem = {
  id: number;
  title?: string | null;
  preview?: string | null;
};

type SearchResult =
  | ({ type: 'news' } & NewsItem)
  | ({ type: 'document' } & Document)
  | ({ type: 'calendar' } & CalendarItem)
  | ({ type: 'page' } & PageItem)
  | ({ type: 'banner' } & BannerItem)
  | ({ type: 'collaborator' } & { id: number; title?: string | null; preview?: string | null; name?: string | null; email?: string | null });

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const resolved = await searchParams;
  const q = typeof resolved.q === 'string' ? resolved.q.trim() : '';

  if (!q) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-primary">Buscar</h1>
        <p className="text-gray-600 mt-2">Digite um termo para buscar na intranet.</p>
      </div>
    );
  }

  // Use shared API function for search
  const data = await searchIntranet(q);
  const results: SearchResult[] = data.results || [];

  const news = results.filter((r): r is Extract<SearchResult, { type: 'news' }> => r.type === 'news');
  const documents = results.filter((r): r is Extract<SearchResult, { type: 'document' }> => r.type === 'document');
  const calendars = results.filter((r): r is Extract<SearchResult, { type: 'calendar' }> => r.type === 'calendar');
  const pages = results.filter((r): r is Extract<SearchResult, { type: 'page' }> => r.type === 'page');
  // const banners = results.filter((r): r is Extract<SearchResult, { type: 'banner' }> => r.type === 'banner');
  const collaboratorsRes = results.filter((r): r is Extract<SearchResult, { type: 'collaborator' }> => r.type === 'collaborator');
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary">Resultados para &quot;{q}&quot;</h1>
        <p className="text-sm text-gray-500 mt-1">{data.total || results.length} resultados</p>
      </div>

      <div className="grid gap-6">
        <section>
          <h2 className="font-semibold mb-3">Notícias ({news.length})</h2>
          <div className="space-y-3">
            {news.map((n: Extract<SearchResult, { type: 'news' }>) => (
              <Link key={`news-${n.id}`} href={`/noticias/${n.slug}`} className="block p-4 bg-white rounded-lg border border-gray-100 hover:shadow-sm">
                <div className="text-primary font-medium">{n.title}</div>
                <p className="text-sm text-gray-600 line-clamp-2">{n.preview}</p>
                <div className="text-xs text-gray-400 mt-2">{n.published_at ? new Date(n.published_at).toLocaleString() : ''}</div>
              </Link>
            ))}
            {news.length === 0 && <p className="text-sm text-gray-500">Nenhuma notícia encontrada.</p>}
          </div>
        </section>

        <section>
          <h2 className="font-semibold mb-3">Calendário ({calendars.length})</h2>
          <div className="space-y-3">
            {calendars.map((c: Extract<SearchResult, { type: 'calendar' }>) => (
              <div key={`cal-${c.id}`} className="p-4 bg-white rounded-lg border border-gray-100">
                <div className="text-primary font-medium">{c.title}</div>
                <p className="text-sm text-gray-600">{c.preview}</p>
              </div>
            ))}
            {calendars.length === 0 && <p className="text-sm text-gray-500">Nenhum evento encontrado.</p>}
          </div>
        </section>

        <section>
          <h2 className="font-semibold mb-3">Documentos ({documents.length})</h2>
          <div className="space-y-3">
            {documents.map((d: Extract<SearchResult, { type: 'document' }>) => (
              <Link key={`doc-${d.id}`} href={`/documentos/${d.id}`} className="block p-4 bg-white rounded-lg border border-gray-100 hover:shadow-sm">
                <div className="text-primary font-medium">{d.title || `Documento #${d.id}`}</div>
                <p className="text-sm text-gray-600">{d.preview}</p>
              </Link>
            ))}
            {documents.length === 0 && <p className="text-sm text-gray-500">Nenhum documento encontrado.</p>}
          </div>
        </section>

        <section>
          <h2 className="font-semibold mb-3">Páginas ({pages.length})</h2>
          <div className="space-y-3">
            {pages.map((p: Extract<SearchResult, { type: 'page' }>) => (
              <Link key={`page-${p.id}`} href={`/${p.slug}`} className="block p-4 bg-white rounded-lg border border-gray-100 hover:shadow-sm">
                <div className="text-primary font-medium">{p.title}</div>
                <p className="text-sm text-gray-600">{p.preview}</p>
              </Link>
            ))}
            {pages.length === 0 && <p className="text-sm text-gray-500">Nenhuma página encontrada.</p>}
          </div>
        </section>

        {/* <section>
          <h2 className="font-semibold mb-3">Banners ({banners.length})</h2>
          <div className="space-y-3">
            {banners.map((b: Extract<SearchResult, { type: 'banner' }>) => (
              <div key={`ban-${b.id}`} className="p-4 bg-white rounded-lg border border-gray-100">
                <div className="text-primary font-medium">{b.title}</div>
                <p className="text-sm text-gray-600">{b.preview}</p>
              </div>
            ))}
            {banners.length === 0 && <p className="text-sm text-gray-500">Nenhum banner encontrado.</p>}
          </div>
        </section> */}

        <section>
          <h2 className="font-semibold mb-3">Colaboradores ({collaboratorsRes.length})</h2>
          <div className="space-y-2">
            {collaboratorsRes.map((c: Extract<SearchResult, { type: 'collaborator' }>) => (
              <div key={`col-${c.id}`} className="p-3 bg-white rounded-lg border border-gray-100">
                <div className="font-medium text-gray-800">{c.title || c.name}</div>
                <div className="text-xs text-gray-500">{c.preview}</div>
              </div>
            ))}
            {collaboratorsRes.length === 0 && <p className="text-sm text-gray-500">Nenhum colaborador encontrado.</p>}
          </div>
        </section>
      </div>
    </div>
  );
}
