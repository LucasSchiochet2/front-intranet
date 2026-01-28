'use client'

import { useState, useEffect } from 'react';
import { updateDashboardAction, deleteDashboardAction } from '../../actions'; 
import { Loader2, X, Users, Save, Trash2 } from 'lucide-react';
import { Collaborator, Dashboard } from '../../interfaces';

interface EditDashboardDialogProps {
  dashboard: Dashboard & { collaborators?: Collaborator[] | {id: number}[] }; // Flexible to handle what backend sends
  collaborators: Collaborator[];
  isOpen: boolean;
  onClose: () => void;
}

export function EditDashboardDialog({ dashboard, collaborators = [], isOpen, onClose }: EditDashboardDialogProps) {
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  // State for selected collaborators
  const [selectedCollaborators, setSelectedCollaborators] = useState<number[]>([]);

  useEffect(() => {
    if (isOpen && dashboard) {
      // Try to populate selected collaborators from dashboard data
      // This assumes dashboard.collaborators exists and is an array of objects with id
      if (Array.isArray(dashboard.collaborators)) {
         setSelectedCollaborators(dashboard.collaborators.map((c: { id: number }) => c.id));
      }
    }
  }, [isOpen, dashboard]);

  const handleCollaboratorToggle = (id: number) => {
    setSelectedCollaborators(prev => 
      prev.includes(id) 
        ? prev.filter(cId => cId !== id)
        : [...prev, id]
    );
  };

  async function handleDelete() {
    if (!confirm('Tem certeza que deseja excluir este dashboard? Essa ação não pode ser desfeita.')) {
      return;
    }

    setDeleteLoading(true);
    setMessage(null);

    try {
      const result = await deleteDashboardAction(dashboard.id);
      if (result.success) {
        onClose();
      } else {
        setMessage({ type: 'error', text: result.error || 'Erro ao excluir dashboard' });
      }
    } catch {
       setMessage({ type: 'error', text: 'Erro inesperado' });
    } finally {
      setDeleteLoading(false);
    }
  }

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setMessage(null);

    // Manually add selected collaborators
    selectedCollaborators.forEach(id => {
      formData.append('collaborators[]', id.toString());
    });
    
    // Add ID
    formData.append('id', dashboard.id.toString());

    try {
      const result = await updateDashboardAction(null, formData);
      if (result.success) {
        onClose();
      } else {
        setMessage({ type: 'error', text: result.error || 'Erro ao atualizar dashboard' });
      }
    } catch {
       setMessage({ type: 'error', text: 'Erro inesperado' });
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">Editar Dashboard</h2>
          <button onClick={onClose} className="text-gray-500 hover:bg-gray-100 p-2 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-4 overflow-y-auto">
            {message && (
                <div className={`p-3 rounded-lg mb-4 text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                {message.text}
                </div>
            )}

            <form action={handleSubmit} id="edit-dashboard-form" className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Dashboard</label>
                    <input 
                        name="name" 
                        defaultValue={dashboard.name}
                        required 
                        placeholder="Ex: Marketing, TI, Vendas..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Descrição (Opcional)</label>
                    <textarea 
                        name="description" 
                        defaultValue={dashboard.description}
                        placeholder="Uma breve descrição sobre este quadro..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all min-h-20"
                    />
                </div>

                <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Participantes
                    </label>
                    <div className="border border-gray-200 rounded-lg max-h-48 overflow-y-auto divide-y divide-gray-100">
                        {collaborators.map(collaborator => (
                        <label 
                            key={collaborator.id} 
                            onClick={(e) => {
                                e.preventDefault(); // Prevent double triggering if label wraps input
                                handleCollaboratorToggle(collaborator.id);
                            }}
                            className="flex items-center gap-3 p-3 hover:bg-gray-50 bg-white cursor-pointer transition-colors"
                        >
                            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                            selectedCollaborators.includes(collaborator.id)
                                ? 'bg-primary border-primary text-white'
                                : 'border-gray-300 bg-white'
                            }`}>
                            {selectedCollaborators.includes(collaborator.id) && <X className="w-3 h-3 rotate-45" strokeWidth={3} />} 
                            </div>
                            <span className="text-sm text-gray-700 select-none">{collaborator.name}</span>
                        </label>
                        ))}
                        
                        {collaborators.length === 0 && (
                            <div className="p-4 text-center text-gray-500 text-sm">
                                Nenhum colaborador encontrado.
                            </div>
                        )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                        Selecione quem terá acesso a este dashboard.
                    </p>
                </div>
            </form>
        </div>

        <div className="p-4 border-t bg-gray-50 flex justify-between items-center gap-3">
             <button
                type="button"
                onClick={handleDelete}
                disabled={loading || deleteLoading}
                className="px-4 py-2 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
                {deleteLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                Excluir
            </button>
            <div className="flex gap-3">
                <button 
                type="button" 
                onClick={onClose}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg text-sm font-medium transition-colors"
                >
                Cancelar
                </button>
                <button 
                type="submit" 
                form="edit-dashboard-form"
                disabled={loading || deleteLoading}
                className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg transition-colors font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Salvar Alterações
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}
