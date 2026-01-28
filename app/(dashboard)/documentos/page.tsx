import { getDocuments, getDocumentCategories, searchDocuments } from '../../api';
import Link from 'next/link';
import { FileText, Calendar } from 'lucide-react';
import { DocumentsFilter } from './documents-filter';

export default async function DocumentsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;
  const page = typeof resolvedSearchParams.page === 'string' ? parseInt(resolvedSearchParams.page) : 1;
  const search = typeof resolvedSearchParams.search === 'string' ? resolvedSearchParams.search : undefined;
  const categoryId = typeof resolvedSearchParams.category === 'string' ? parseInt(resolvedSearchParams.category) : undefined;

  const categories = await getDocumentCategories();

  let documentsData;
  if (search) {
    documentsData = await searchDocuments(search);
  } else {
    documentsData = await getDocuments(page, categoryId);
  }

  const { data: documents = [], current_page, last_page } = documentsData;
  // Helper to build pagination URL preserving other params
  const getPaginationUrl = (newPage: number) => {
    const params = new URLSearchParams();
    params.set('page', newPage.toString());
    if (search) params.set('search', search);
    if (categoryId) params.set('category', categoryId.toString());
    return `/documentos?${params.toString()}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-primary">Documentos</h1>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <aside className="w-full md:w-64 shrink-0">
          <DocumentsFilter categories={categories} />
        </aside>

        <div className="flex-1">
          <div className="grid gap-4">
            {documents.map((doc) => (
              <Link 
                key={doc.id} 
                href={`/documentos/${doc.id}`}
                className="block bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {doc.category && (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium border-primary bg-green-50 text-primary">
                          {doc.category.name}
                        </span>
                      )}
                      <span className="flex items-center text-xs text-gray-500">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(doc.created_at).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-primary mb-2">{doc.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{doc.description}</p>
                  </div>
                </div>
              </Link>
            ))}

            {documents.length === 0 && (
              <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Nenhum documento encontrado.</p>
              </div>
            )}
          </div>

          <div className="flex justify-center gap-2 mt-8">
            {page > 1 && (
              <Link
                href={getPaginationUrl(page - 1)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Anterior
              </Link>
            )}
            {last_page && page < last_page && (
              <Link
                href={getPaginationUrl(page + 1)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Próxima
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
