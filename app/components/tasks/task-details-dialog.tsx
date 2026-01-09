'use client';

import { useState, useEffect } from 'react';
import { Task, Collaborator, storageUrl } from '../../api';
import { getTaskDetailsAction } from '../../actions';
import { Calendar, Clock, Edit2, FileText, X, User, Tag, Paperclip, Download, CheckSquare, CheckCircle2, Circle, Loader2 } from 'lucide-react';

interface TaskDetailsDialogProps {
  task: Task | null;
  onClose: () => void;
  onEdit: (task: Task) => void;
  collaborators?: Collaborator[];
}

export function TaskDetailsDialog({ task: initialTask, onClose, onEdit, collaborators = [] }: TaskDetailsDialogProps) {
  if (!initialTask) return null;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [task, setTask] = useState<Task>(initialTask);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [isLoading, setIsLoading] = useState(true);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    let mounted = true;
    async function fetchDetails() {
        if (!initialTask?.id) return;
        setIsLoading(true);
        const res = await getTaskDetailsAction(initialTask.id);
        if (mounted && res.success && res.data) {
            setTask(res.data);
        }
        if (mounted) setIsLoading(false);
    }
    fetchDetails();
    return () => { mounted = false; };
  }, [initialTask?.id]);

  const title = task.title || task.subject || 'Sem título';
  const description = task.description || task.message || '';
  const tag = task.tag || task.type || 'Geral';
  const receiver = collaborators.find(c => c.id === task.collaborator_id_receiver);
  
  // Normalize attachments to array and ensure strings
  const attachments = (Array.isArray(task.attachment) 
    ? task.attachment 
    : (task.attachment ? [task.attachment] : [])
  ).filter(item => typeof item === 'string');

  const getAttachmentUrl = (path: string) => {
    if (!path) return '#';
    return path.startsWith('http') ? path : `${storageUrl}${path}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Detalhes da Tarefa
            {isLoading && <Loader2 className="w-4 h-4 animate-spin text-gray-400" />}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:bg-gray-100 p-2 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Header Info */}
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
               <Tag className="w-3 h-3" />
               {tag}
            </span>
            
            {task.deadline && (
               <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-orange-50 text-orange-700">
                 <Clock className="w-3 h-3" />
                 {new Date(task.deadline).toLocaleString()}
               </span>
            )}
            
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                task.status === 'done' ? 'bg-green-50 text-green-700' :
                task.status === 'in_progress' ? 'bg-blue-50 text-blue-700' :
                'bg-gray-100 text-gray-700'
            }`}>
               {task.status === 'done' ? 'Concluído' : task.status === 'in_progress' ? 'Em Andamento' : 'A Fazer'}
            </span>
          </div>

          {/* Title & Description */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
            <div className="prose prose-sm text-gray-600 bg-gray-50 p-4 rounded-lg border border-gray-100">
              {description || <span className="italic text-gray-400">Sem descrição</span>}
            </div>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-4 text-sm">
             <div>
               <label className="text-gray-500 text-xs font-medium uppercase tracking-wider">Criado em</label>
               <div className="flex items-center gap-2 mt-1 text-gray-700 font-medium">
                 <Calendar className="w-4 h-4 text-gray-400" />
                 {new Date(task.created_at).toLocaleDateString()}
               </div>
             </div>

             <div>
               <label className="text-gray-500 text-xs font-medium uppercase tracking-wider">Responsável</label>
               <div className="flex items-center gap-2 mt-1 text-gray-700 font-medium">
                 <User className="w-4 h-4 text-gray-400" />
                 {receiver?.name || 'Não atribuído'}
               </div>
             </div>
          </div>

          {/* Checklist */}
          {task.checklist_items && task.checklist_items.length > 0 && (
            <div>
              <h4 className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">
                <CheckSquare className="w-4 h-4 text-gray-500" />
                Checklist
              </h4>
              <div className="space-y-2 bg-gray-50 p-4 rounded-lg border border-gray-100">
                {task.checklist_items.map((item) => (
                  <div key={item.id} className="flex items-start gap-3">
                    <div className={`mt-0.5 ${item.is_completed ? 'text-green-500' : 'text-gray-300'}`}>
                      {item.is_completed ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                    </div>
                    <span className={`text-sm ${item.is_completed ? 'text-gray-500 line-through' : 'text-gray-700'}`}>
                      {item.description}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Attachment */}
          <div className="border-t pt-4">
             <label className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-2 block">Anexos</label>
             {attachments.length > 0 ? (
               <div className="space-y-2">
                 {attachments.map((file, index) => (
                   <a 
                     key={index}
                     href={getAttachmentUrl(file)} 
                     target="_blank" 
                     rel="noreferrer"
                     className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors group"
                   >
                     <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-100 transition-colors">
                        <Paperclip className="w-5 h-5" />
                     </div>
                     <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">
                          {file.split('/').pop() || file}
                        </p>
                        <p className="text-xs text-gray-500">Clique para baixar</p>
                     </div>
                     <Download className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                   </a>
                 ))}
               </div>
             ) : (
                <div className="text-sm text-gray-500 italic">
                  Nenhum anexo disponível
                </div>
             )}
          </div>

        </div>

        <div className="p-4 border-t bg-gray-50 flex justify-end gap-2">
            <button 
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-white transition-colors font-medium text-sm"
            >
                Fechar
            </button>
            <button 
                onClick={() => onEdit(task)}
                className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg transition-colors font-medium text-sm shadow-sm"
            >
                <Edit2 className="w-4 h-4" />
                Editar Tarefa
            </button>
        </div>
      </div>
    </div>
  );
}
