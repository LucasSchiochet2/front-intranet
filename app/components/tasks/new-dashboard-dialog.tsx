'use client'

import { useState } from 'react';
import { createDashboardAction } from '../../actions'; 
import { Loader2, X, Users, LayoutDashboard } from 'lucide-react';
import { Collaborator } from '../../api';

interface NewDashboardDialogProps {
  collaborators?: Collaborator[];
}

export function NewDashboardDialog({ collaborators = [] }: NewDashboardDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  // State for selected collaborators
  const [selectedCollaborators, setSelectedCollaborators] = useState<number[]>([]);

  const handleCollaboratorToggle = (id: number) => {
    setSelectedCollaborators(prev => 
      prev.includes(id) 
        ? prev.filter(cId => cId !== id)
        : [...prev, id]
    );
  };

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setMessage(null);

    // Manually add selected collaborators to formData since they are managed by state
    selectedCollaborators.forEach(id => {
      formData.append('collaborators[]', id.toString());
    });

    try {
      const result = await createDashboardAction(null, formData);
      if (result.success) {
        setIsOpen(false);
        setSelectedCollaborators([]);
      } else {
        setMessage({ type: 'error', text: result.error || 'Erro ao criar dashboard' });
      }
    } catch {
       setMessage({ type: 'error', text: 'Erro inesperado' });
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center md:h-[65px] gap-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 px-4 py-2 rounded-lg transition-colors font-medium shadow-sm"
      >
        <LayoutDashboard className="w-5 h-5" />
        Novo Dashboard
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <LayoutDashboard className="w-5 h-5 text-primary" />
            Novo Dashboard
          </h2>
          <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:bg-gray-100 p-2 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form action={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Dashboard</label>
            <input 
              name="name" 
              required 
              placeholder="Ex: Equipe de Marketing"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
            />
          </div>

          <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
             <textarea 
               name="description" 
               rows={3}
               placeholder="Objetivos e propósito deste dashboard..."
               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none resize-none"
             />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Colaboradores Participantes
            </label>
            <div className="border border-gray-200 rounded-lg max-h-48 overflow-y-auto">
              {collaborators.length === 0 ? (
                <p className="p-3 text-sm text-gray-500 text-center">Nenhum colaborador disponível.</p>
              ) : (
                <div className="divide-y divide-gray-100">
                    {collaborators.map(col => (
                        <label key={col.id} className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer transition-colors">
                            <input 
                                type="checkbox"
                                checked={selectedCollaborators.includes(col.id)}
                                onChange={() => handleCollaboratorToggle(col.id)}
                                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                            />
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-gray-700">{col.name}</span>
                                <span className="text-xs text-gray-500">{col.email}</span>
                            </div>
                        </label>
                    ))}
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">
                Selecione quem terá acesso e poderá visualizar tarefas neste dashboard.
            </p>
          </div>

          {message && (
            <div className={`p-3 rounded-lg text-sm ${message.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
              {message.text}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button 
              type="button" 
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Criar Dashboard
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
