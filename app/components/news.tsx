import { getNews, storageUrl } from '../api';
import Link from 'next/link';

export async function News() {
  const news = await getNews();

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Notícias</h2>
        <Link href="/noticias" className="text-sm text-[var(--color-primary)] hover:underline">
          Ver todas
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Featured News */}
        {news[0] && (
          <Link href={`/noticias/${news[0].slug}`} className="group cursor-pointer">
            {news[0].image && (
              <div className="w-full h-48 rounded-lg overflow-hidden bg-gray-100 mb-3">
                <img 
                  src={news[0].image} 
                  alt={news[0].title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs text-gray-500">
                {new Date(news[0].published_at).toLocaleDateString('pt-BR')}
              </span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[var(--color-primary)] transition-colors">
              {news[0].title}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-2">
              {news[0].content.replace(/<[^>]*>?/gm, '')}
            </p>
          </Link>
        )}

        {/* Other News List */}
        <div className="space-y-4">
          {news.slice(1, 4).map((item) => (
            <Link href={`/noticias/${item.slug}`} key={item.id} className="flex gap-3 border-b border-gray-100 pb-3 last:border-0 last:pb-0 group cursor-pointer">
              {item.image && (
                <div className="w-20 h-20 flex-shrink-0 rounded-md overflow-hidden bg-gray-100">
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] text-gray-400">
                    {new Date(item.published_at).toLocaleDateString('pt-BR')}
                  </span>
                </div>
                <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1 group-hover:text-[var(--color-primary)] transition-colors">
                  {item.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
