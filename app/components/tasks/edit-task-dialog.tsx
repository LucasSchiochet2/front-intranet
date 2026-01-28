'use client'

import { useState } from 'react';
import { editTaskAction, editTaskJsonAction } from '../../actions';
import { Loader2, Save, X, Paperclip, CheckSquare, Plus, Trash2 } from 'lucide-react';
import { Task, Collaborator, ChecklistItem, Dashboard } from '../../interfaces';

interface EditTaskDialogProps {
  task: Task | null;
  onClose: () => void;
  collaborators?: Collaborator[];
  dashboards?: Dashboard[];
}

export function EditTaskDialog({ task, onClose, collaborators = [], dashboards = [] }: EditTaskDialogProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [checklist, setChecklist] = useState<ChecklistItem[]>(task?.checklist_items || []);
  const [deletedChecklistItems, setDeletedChecklistItems] = useState<ChecklistItem[]>([]);

  if (!task) return null;

  const handleAddChecklistItem = () => {
    setChecklist([...checklist, { description: '', is_completed: false }]);
  };

  const handleUpdateChecklistItem = (index: number, field: keyof ChecklistItem, value: string | boolean) => {
    const newChecklist = [...checklist];
    newChecklist[index] = { ...newChecklist[index], [field]: value };
    setChecklist(newChecklist);
  };

  const handleRemoveChecklistItem = (index: number) => {
    const item = checklist[index];
    if (item.id) {
      setDeletedChecklistItems((prev) => [...prev, item]);
    }
    const newChecklist = checklist.filter((_, i) => i !== index);
    setChecklist(newChecklist);
  };

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setMessage(null);

    // Default values if not provided
    if (!formData.get('tag')) formData.set('tag', 'Geral');

    const attachmentInputs = formData.getAll('attachment[]');
    const hasFiles = attachmentInputs.some(file => (file as File).size > 0);

    let result;

    if (!hasFiles) {
      // Use JSON action for better structure handling
      const receiverId = formData.get('collaborator_id_receiver');
      
      const payload: Partial<Task> & { id: number; checklist: { id?: number; description: string; is_completed: boolean; _destroy?: boolean }[] } = {
        id: Number(task!.id),
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        tag: formData.get('tag') as string,
        deadline: formData.get('deadline') as string || undefined,
        collaborator_id_receiver: receiverId ? Number(receiverId) : undefined,
        checklist: [
          ...checklist.map(item => ({
            id: item.id ? Number(item.id) : undefined,
            description: item.description,
            is_completed: !!item.is_completed
          })),
          ...deletedChecklistItems.map(item => ({
            id: item.id,
            description: item.description,
            is_completed: item.is_completed,
            _destroy: true
          }))
        ]
      };
      
      console.log("Sending JSON payload:", payload);
      
      // Remove empty fields or handle logic as needed
      if (!payload.deadline) delete payload.deadline;

      try {
        result = await editTaskJsonAction(payload);
        console.log("Result JSON:", result);
      } catch (e) {
         console.error("Error JSON:", e);
         result = { success: false, error: 'Erro de comunicação' };
      }

    } else {
      // Ensure we clean up any pre-existing checklist items in formData to avoid duplicates if any
      formData.delete('checklist_items'); 
      formData.delete('checklist'); 
      
      let checklistIndex = 0;

      checklist.forEach((item) => {
        if (item.id) {
          formData.append(`checklist[${checklistIndex}][id]`, String(item.id));
        }
        formData.append(`checklist[${checklistIndex}][description]`, item.description);
        formData.append(`checklist[${checklistIndex}][is_completed]`, item.is_completed ? '1' : '0');
        checklistIndex++;
      });
      
      deletedChecklistItems.forEach((item) => {
        if (item.id) {
            formData.append(`checklist[${checklistIndex}][id]`, String(item.id));
            formData.append(`checklist[${checklistIndex}][description]`, item.description);
            formData.append(`checklist[${checklistIndex}][is_completed]`, item.is_completed ? '1' : '0');
            formData.append(`checklist[${checklistIndex}][_destroy]`, '1');
            checklistIndex++;
        }
      });

      try {
        result = await editTaskAction(null, formData);
        console.log("Result FormData:", result);
      } catch (e) {
         console.error("Error FormData:", e);
         result = { success: false, error: 'Erro de comunicação' };
      }
    }
    
    if (result && result.success) {
      onClose();
    } else {
      setMessage({ type: 'error', text: result?.error || 'Erro ao editar tarefa' });
    }
    setLoading(false);
  }

  // Format deadline for datetime-local input
  const defaultDate = task.deadline ? new Date(task.deadline).toISOString().slice(0, 16) : '';

  // Handle compatibility fields
  const title = task.title || task.subject || '';
  const description = task.description || task.message || '';
  
  const attachments = (Array.isArray(task.attachment) 
    ? task.attachment 
    : (task.attachment ? [task.attachment] : [])
  ).filter(item => typeof item === 'string');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200 overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">Editar Tarefa</h2>
          <button onClick={onClose} className="text-gray-500 hover:bg-gray-100 p-2 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form action={handleSubmit} className="p-4 space-y-4">
          <input type="hidden" name="id" value={task.id} />
          
          {dashboards.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dashboard</label>
              <select 
                name="dashboard_id" 
                required
                defaultValue={task.dashboard_id || ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
              >
                <option value="">Selecione um dashboard...</option>
                {dashboards.map(dashboard => (
                  <option key={dashboard.id} value={dashboard.id}>
                    {dashboard.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
            <input 
              name="title" 
              required 
              defaultValue={title}
              placeholder="Título da tarefa"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
            />
          </div>

          <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
             <textarea 
               name="description" 
               defaultValue={description}
               rows={3}
               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none resize-none"
             />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tag</label>
              <input 
                name="tag" 
                defaultValue={task.tag || ''}
                placeholder="Ex: Urgente, Bug..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prazo</label>
              <input 
                name="deadline" 
                type="datetime-local"
                defaultValue={defaultDate}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Destinatário</label>
            <select 
              name="collaborator_id_receiver" 
              required
              defaultValue={task.collaborator_id_receiver}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
            >
              <option value="">Selecione...</option>
              {collaborators.map(col => (
                <option key={col.id} value={col.id}>{col.name}</option>
              ))}
            </select>
          </div>

          {/* Checklist Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <CheckSquare className="w-4 h-4" />
                Checklist
              </label>
              <button
                type="button"
                onClick={handleAddChecklistItem}
                className="text-xs flex items-center gap-1 text-primary hover:text-primary-dark font-medium px-2 py-1 rounded hover:bg-primary/5 transition-colors"
              >
                <Plus className="w-3 h-3" />
                Adicionar Item
              </button>
            </div>
            
            <div className="space-y-2 bg-gray-50 p-3 rounded-lg border border-gray-200">
              {checklist.length === 0 && (
                <p className="text-xs text-gray-400 text-center italic py-2">Nenhum item na checklist</p>
              )}
              {checklist.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={!!item.is_completed}
                    onChange={(e) => handleUpdateChecklistItem(index, 'is_completed', e.target.checked)}
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary cursor-pointer"
                  />
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => handleUpdateChecklistItem(index, 'description', e.target.value)}
                    placeholder="Descrição do item"
                    className="flex-1 text-sm bg-white px-2 py-1.5 border border-gray-300 rounded focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveChecklistItem(index)}
                    className="text-gray-400 hover:text-red-500 p-1 rounded hover:bg-gray-200 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Anexos</label>
             {attachments.length > 0 ? (
                <div className="mb-2 space-y-1">
                  <p className="text-xs text-gray-500 font-medium uppercase">Atuais:</p>
                  {attachments.map((file, idx) => (
                    <div key={idx} className="text-sm text-blue-600 truncate flex items-center gap-2">
                      <Paperclip className="w-3 h-3" />
                      {file.split('/').pop() || file}
                    </div>
                  ))}
                </div>
             ) : (
                <div className="mb-2 text-sm text-gray-500 italic">
                  Nenhum anexo atual
                </div>
             )}
             <input
               name="attachment[]"
               type="file"
               multiple
               className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
             />
             <p className="text-xs text-gray-400 mt-1">Selecione arquivos para adicionar/substituir.</p>
          </div>

          <div className="flex gap-2 pt-2">
            <button 
                type="button" 
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
                Cancelar
            </button>
            <button 
                type="submit" 
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
            >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                Salvar Alterações
            </button>
          </div>
          
          {message && (
            <div className={`p-3 rounded-lg text-sm ${
              message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
            }`}>
              {message.text}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
