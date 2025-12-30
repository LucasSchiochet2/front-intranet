import { getNews, storageUrl } from '../../api';
import Link from 'next/link';

export default async function NoticiasPage() {
  const news = await getNews();

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl lg:text-4xl font-bold text-primary">Notícias</h1>
        <p className="text-gray-600">Fique por dentro de tudo que acontece na empresa.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {news.map((item) => (
          <Link href={`/noticias/${item.slug}`} key={item.id} className="group block h-full">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden h-full hover:shadow-md transition-shadow flex flex-col">
              <div className="relative h-48 w-full bg-gray-100">
                {item.image ? (
                  <img
                    src={`${storageUrl}${item.image}`}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-200">
                    <span className="text-sm">Sem imagem</span>
                  </div>
                )}
              </div>
              <div className="p-3 flex flex-col flex-1">
                <div className="text-xs text-gray-500 mb-1">
                  {new Date(item.published_at).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                  })}
                </div>
                <h2 className="text-lg font-bold text-primary mb-3 group-hover:text-[var(--color-primary)] transition-colors line-clamp-2 min-h-[3.3rem]">
                  {item.title}
                </h2>
                <p className="text-sm text-gray-600 flex-1 overflow-hidden" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                  {item.content.replace(/<[^>]*>?/gm, '')}
                </p>
                {/* <span className="text-sm font-medium text-[var(--color-primary)] group-hover:underline mt-auto">
                  Ler mais &rarr;
                </span> */}
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      {news.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          Nenhuma notícia encontrada.
        </div>
      )}
    </div>
  );
}
