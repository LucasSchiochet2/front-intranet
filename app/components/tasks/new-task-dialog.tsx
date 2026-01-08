'use client'

import { useState } from 'react';
import { submitTask } from '../../actions'; // Ensure this path is correct
import { Loader2, Plus, X, Upload } from 'lucide-react';
import { Collaborator } from '../../api';

interface NewTaskDialogProps {
  userEmail?: string;
  collaborators?: Collaborator[];
}

export function NewTaskDialog({ userEmail, collaborators = [] }: NewTaskDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const currentUser = collaborators.find(c => c.email === userEmail);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setMessage(null);

    // Default values if not provided
    if (!formData.get('tag')) formData.set('tag', 'Geral');
    
    try {
      const result = await submitTask(null, formData);
      if (result.success) {
        setIsOpen(false);
      } else {
        setMessage({ type: 'error', text: result.error || 'Erro ao criar tarefa' });
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
        className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg transition-colors font-medium shadow-sm"
      >
        <Plus className="w-5 h-5" />
        Nova Tarefa
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200 overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">Nova Tarefa</h2>
          <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:bg-gray-100 p-2 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form action={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
            <input 
              name="title" 
              required 
              placeholder="Título da tarefa"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tag</label>
              <input 
                name="tag" 
                placeholder="Ex: Urgente, Bug..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prazo</label>
              <input 
                name="deadline" 
                type="datetime-local"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Destinatário</label>
            <select 
              name="collaborator_id_receiver" 
              required
              defaultValue={currentUser?.id}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
            >
              <option value="">Selecione um colaborador</option>
              {collaborators.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.email === userEmail ? `Você (${c.name})` : c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="hidden">
            <input name="email" type="hidden" value={userEmail || ''} />
          </div>

          <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Anexos</label>
             <div className="border border-dashed border-gray-300 rounded-lg p-4 text-center hover:bg-gray-50 transition-colors cursor-pointer relative">
               <input 
                 type="file" 
                 name="attachment[]" 
                 multiple
                 className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
               />
               <div className="flex flex-col items-center gap-1 text-gray-500">
                 <Upload className="w-6 h-6" />
                 <span className="text-xs">Clique ou arraste arquivos (múltiplos permitidos)</span>
               </div>
             </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
            <textarea 
              name="description" 
              required 
              rows={4}
              placeholder="Detalhes da tarefa..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none"
            />
          </div>

          {message && (
             <div className={`p-3 rounded-lg text-sm ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
               {message.text}
             </div>
          )}

          <div className="flex justify-end gap-3 pt-2">

            <button 
              type="button" 
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium shadow-sm transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Criar Tarefa
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
