import { getNews } from '../api';
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
          <div className="group cursor-pointer">
            {news[0].image_url && (
              <div className="w-full h-48 rounded-lg overflow-hidden bg-gray-100 mb-3">
                <img 
                  src={news[0].image_url} 
                  alt={news[0].title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">
                {news[0].category}
              </span>
              <span className="text-xs text-gray-500">
                {new Date(news[0].date).toLocaleDateString('pt-BR')}
              </span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[var(--color-primary)] transition-colors">
              {news[0].title}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-3">
              {news[0].summary}
            </p>
          </div>
        )}

        {/* Other News List */}
        <div className="space-y-4">
          {news.slice(1).map((item) => (
            <div key={item.id} className="flex gap-3 border-b border-gray-100 pb-3 last:border-0 last:pb-0 group cursor-pointer">
              {item.image_url && (
                <div className="w-20 h-20 flex-shrink-0 rounded-md overflow-hidden bg-gray-100">
                  <img 
                    src={item.image_url} 
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-600">
                    {item.category}
                  </span>
                  <span className="text-[10px] text-gray-400">
                    {new Date(item.date).toLocaleDateString('pt-BR')}
                  </span>
                </div>
                <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1 group-hover:text-[var(--color-primary)] transition-colors">
                  {item.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
