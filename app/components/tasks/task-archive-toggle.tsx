'use client';

import { Archive, LayoutList } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface TaskArchiveToggleProps {
  isArchived: boolean;
}

export function TaskArchiveToggle({ isArchived }: TaskArchiveToggleProps) {
  const router = useRouter();

  const toggleView = () => {
    if (isArchived) {
      router.push('/tarefas');
    } else {
      router.push('/tarefas?archived=true');
    }
  };

  return (
    <button
      onClick={toggleView}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors shadow-sm max-sm:h-16.5
        ${isArchived 
          ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
          : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
        }
      `}
      title={isArchived ? 'Voltar para tarefas ativas' : 'Ver tarefas arquivadas'}
    >
      {isArchived ? (
        <>
          <LayoutList className="w-5 h-5" />
          <span>Ativas</span>
        </>
      ) : (
        <>
          <Archive className="w-5 h-5" />
          <span>Arquivadas</span>
        </>
      )}
    </button>
  );
}
