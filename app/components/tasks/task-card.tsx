import { Task } from '../../api';
import { Calendar, Paperclip, Clock, Archive, Undo2 } from 'lucide-react';
import { archiveTaskAction, unarchiveTaskAction } from '../../actions';

interface TaskCardProps {
  task: Task;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, taskId: number) => void;
  isArchived?: boolean;
  onClick?: (task: Task) => void;
}

export function TaskCard({ task, onDragStart, isArchived, onClick }: TaskCardProps) {
  // Use tag or type or default
  const tag = task.tag || task.type || 'Geral';
  const description = task.description || task.message || '';
  
  const handleArchive = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm('Deseja arquivar esta tarefa?')) {
      await archiveTaskAction(task.id);
    }
  };

  const handleUnarchive = async (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (confirm('Deseja desarquivar esta tarefa?')) {
        await unarchiveTaskAction(task.id);
      }
  };

  return (
    <div
      draggable={!isArchived}
      onDragStart={(e) => onDragStart(e, task.id)}
      onClick={() => onClick?.(task)}
      className={`bg-white p-4 rounded-lg shadow-sm border border-gray-200 ${isArchived ? 'opacity-75' : 'cursor-move hover:shadow-md'} transition-shadow mb-3 space-y-3 relative group`}
    >
      <div className="flex justify-between items-start mb-2">
        <span className={`text-xs px-2 py-1 rounded-full font-medium bg-gray-100 text-gray-700`}>
          {tag}
        </span>
        {task.deadline && (
           <div className="flex items-center gap-1 text-xs text-orange-600 font-medium" title="Prazo">
             <Clock className="w-3 h-3" />
             <span>Até {new Date(task.deadline).toLocaleDateString()}</span>
           </div>
        )}
      </div>
      
      <h4 className="font-semibold text-gray-800 line-clamp-2">{task.title || task.subject || 'Sem título'}</h4>
      
      <div className="text-sm text-gray-600 line-clamp-3">
        {description}
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-gray-100 mt-2">
        <div className="flex items-center gap-3 text-xs text-gray-500">
            {task.created_at && (
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>{new Date(task.created_at).toLocaleDateString()}</span>
              </div>
            )}
            {task.attachment && task.attachment.length > 0 && (
              <div className="flex items-center gap-1 text-blue-600">
                <Paperclip className="w-3 h-3" />
                <span>Anexo</span>
              </div>
            )}
        </div>
        
        {isArchived ? (
            <button 
               onClick={handleUnarchive}
               className="p-1.5 text-gray-400 hover:text-green-500 hover:bg-green-50 rounded transition-colors"
               title="Desarquivar tarefa"
            >
              <Undo2 className="w-4 h-4" />
            </button>
        ) : (
            <button 
               onClick={handleArchive}
               className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
               title="Arquivar tarefa"
            >
              <Archive className="w-4 h-4" />
            </button>
        )}
      </div>
    </div>
  );
}
