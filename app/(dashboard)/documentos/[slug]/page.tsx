import React from 'react';
import { getShowDocuments, storageUrl } from '@/app/api';
import Link from 'next/link';
import { FileText, Download, Calendar, ArrowLeft } from 'lucide-react';
import { notFound } from 'next/navigation';

export default async function DocumentDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const id = parseInt(slug);

  if (isNaN(id)) {
    return notFound();
  }

  const doc = await getShowDocuments(id);

  if (!doc) {
    return notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link 
          href="/documentos" 
          className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold text-primary">Detalhes do Documento</h1>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-4">
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

        <h2 className="text-xl font-bold text-gray-900 mb-4">{doc.title}</h2>
        
        <div className="prose prose-gray max-w-none mb-8 text-gray-600">
          <p>{doc.description}</p>
        </div>

        {doc.files && doc.files.length > 0 && (
          <div className="border-t border-gray-100 pt-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Arquivos Anexos</h3>
            <div className="flex flex-wrap gap-3">
              {doc.files.map((file, index) => {
                const fileUrl = file.startsWith('http') ? file : `${storageUrl}storage/${file}`;
                const fileName = file.split('/').pop() || 'Download';
                
                return (
                  <a
                    key={index}
                    href={fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-primary bg-gray-50 rounded-lg hover:bg-primary/10 transition-colors border border-gray-200"
                  >
                    <FileText className="w-4 h-4 mr-2 text-gray-500" />
                    <span className="max-w-[300px] truncate">{fileName}</span>
                    <Download className="w-4 h-4 ml-2 text-gray-400" />
                  </a>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
