import { NextResponse } from 'next/server';
import { API_URL } from '../../api';

export async function GET(req: Request) {
  try {
    // Request.url can be relative (e.g. "/api/search?q=ab") depending on environment.
    // Try to construct a URL with a base; if that fails, fall back to manual parsing.
    const raw = req.url;
    let q = '';

    try {
      const base = req.headers.get('host') ? `http://${req.headers.get('host')}` : process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000';
      const url = raw && (raw as string).startsWith('http') ? new URL(raw as string) : new URL(raw as string, base);
      q = (url.searchParams.get('q') || '').trim();
    } catch (innerErr) {
      // Fallback: extract query string manually from possible relative URL
      try {
        const s = typeof raw === 'string' ? raw : '';
        const idx = s.indexOf('?');
        if (idx !== -1) {
          const params = new URLSearchParams(s.slice(idx + 1));
          q = (params.get('q') || '').trim();
        }
      } catch (e) {
        q = '';
      }
    }

    const remoteUrl = `${API_URL}search?query=${encodeURIComponent(q)}`;
    const res = await fetch(remoteUrl);

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      console.error('Upstream search error:', res.status, text);
      return NextResponse.json({ query: q, total: 0, results: [] }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('API /api/search error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
