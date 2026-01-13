import { getNewsBySlug, storageUrl } from '../../../api';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ImageGallery } from '../../../components/image-gallery';

interface NewsDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const { slug } = await params;
  const newsItem = await getNewsBySlug(slug);

  if (!newsItem) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2 mt-2">
          <span>{new Date(newsItem.published_at).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-6">
          {newsItem.title}
        </h1>

        {newsItem.image && (
          <div className="w-full rounded-xl overflow-hidden mb-8 shadow-sm">
            <img
              src={newsItem.image}
              alt={newsItem.title}
              className="w-full h-auto max-h-[500px] object-cover"
            />
          </div>
        )}

        <div 
          className="prose prose-lg max-w-none text-gray-700 mb-10"
          dangerouslySetInnerHTML={{ __html: newsItem.content }}
        />

        {newsItem.photos && newsItem.photos.length > 0 && (
          <ImageGallery 
            photos={newsItem.photos} 
            storageUrl={storageUrl} 
            title={newsItem.title} 
          />
        )}
      </div>
    </div>
  );
}
