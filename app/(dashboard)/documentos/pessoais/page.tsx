import React from 'react';
import { getCollaboratorDocuments } from '@/app/api';
import Link from 'next/link';
import { FileText, Calendar } from 'lucide-react';
import { cookies } from 'next/headers';
export default async function DocumentsPage() {
  // Substitua pelo id real do colaborador (ex: vindo do contexto de auth)
  const cookieStore = await cookies();
  const userCookie = cookieStore.get('user_session');
  const collaboratorId= userCookie ? JSON.parse(userCookie.value) : null;

  // Busca os documentos pessoais do colaborador
  const documents = await getCollaboratorDocuments(collaboratorId.id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-primary">Documentos Pessoais</h1>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
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
        </div>
      </div>
    </div>
  );
}