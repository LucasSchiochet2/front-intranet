'use client'

import { useState, useOptimistic, startTransition } from 'react';
import { Task, Collaborator } from '../../api';
import { TaskCard } from './task-card';
import { EditTaskDialog } from './edit-task-dialog';
import { TaskDetailsDialog } from './task-details-dialog';
import { updateTaskStatus } from '../../actions';
import { Loader2 } from 'lucide-react';

interface KanbanBoardProps {
  initialTasks: Task[];
  isArchivedView?: boolean;
  collaborators?: Collaborator[];
}

const COLUMNS = [
  { id: 'open', title: 'A Fazer', color: 'bg-gray-50 border-gray-200' },
  { id: 'in_progress', title: 'Em Andamento', color: 'bg-blue-50 border-blue-200' },
  { id: 'done', title: 'Concluído', color: 'bg-green-50 border-green-200' }
];

export function KanbanBoard({ initialTasks, isArchivedView = false, collaborators = [] }: KanbanBoardProps) {
  const [viewingTask, setViewingTask] = useState<Task | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Use optimistic updates for instant feedback
  const [optimisticTasks, addOptimisticTask] = useOptimistic(
    initialTasks,
    (state: Task[], updatedTask: Task) => {
      // If task exists, update it. Else add it (for creation, though creation usually handled by reload)
      const exists = state.find(t => t.id === updatedTask.id);
      if (exists) {
        return state.map(t => t.id === updatedTask.id ? updatedTask : t);
      }
      return [...state, updatedTask];
    }
  );

  const [loadingId, setLoadingId] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, taskId: number) => {
    e.dataTransfer.setData('taskId', taskId.toString());
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>, status: string) => {
    e.preventDefault();
    const taskIdString = e.dataTransfer.getData('taskId');
    if (!taskIdString) return;

    const taskId = parseInt(taskIdString);
    const task = optimisticTasks.find(t => t.id === taskId);
    
    if (task && task.status !== status) {
      // Optimistic update
      startTransition(() => {
        addOptimisticTask({ ...task, status });
      });
      setLoadingId(taskId);

      // Server update
      try {
        await updateTaskStatus(taskId, status);
      } catch (error) {
        console.error('Failed to move task:', error);

      } finally {
        setLoadingId(null);
      }
    }
  };

  const getTasksForColumn = (columnId: string) => {
    return optimisticTasks.filter(t => {
      // Map 'todo', 'pending' or 'open' (default) to 'open' column
      if (columnId === 'open') {
         return !t.status || t.status === 'open' || t.status === 'todo' || t.status === 'pending';
      }
      // Map 'completed' or 'done'
      if (columnId === 'done') {
          return t.status === 'done' || t.status === 'completed';
      }
      return t.status === columnId;
    });
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 h-full overflow-x-auto pb-4">
      {COLUMNS.map((col) => {
        const tasks = getTasksForColumn(col.id);
        
        return (
        <div 
          key={col.id}
          className={`flex-1 min-w-75 flex flex-col rounded-xl border ${col.color} p-4 max-h-[calc(100vh-12rem)]`}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, col.id)}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-700">{col.title}</h3>
            <span className="bg-white/50 px-2 py-1 rounded text-sm font-semibold text-gray-600">
              {tasks.length}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3">
            {tasks.map(task => (
                <div key={task.id} className="relative group">
                   <TaskCard 
                      task={task} 
                      onDragStart={isArchivedView ? (e) => e.preventDefault() : handleDragStart} 
                      isArchived={isArchivedView}
                      onClick={(t) => setViewingTask(t)}
                   />
                   {loadingId === task.id && (
                     <div className="absolute inset-0 bg-white/50 flex items-center justify-center rounded-lg">
                       <Loader2 className="w-5 h-5 animate-spin text-primary" />
                     </div>
                   )}
                </div>
              ))}
              
            {tasks.length === 0 && (
              <div className="h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 text-sm">
                Solte itens aqui
              </div>
            )}
          </div>
        </div>
      )})} 
      
      {viewingTask && (
        <TaskDetailsDialog 
           task={viewingTask}
           onClose={() => setViewingTask(null)}
           onEdit={(t) => {
             setViewingTask(null);
             setEditingTask(t);
           }}
           collaborators={collaborators}
        />
      )}

      {editingTask && (
        <EditTaskDialog 
          key={editingTask.id}
          task={editingTask} 
          onClose={() => setEditingTask(null)} 
          collaborators={collaborators}
        />
      )}
    </div>
  );
}
