import { Suspense } from 'react';
import { getCollaboratorTasks, getCollaborators, getArchivedTasks, getCollaboratorDashboards, getPersonalDashboards, getDashboard } from '../../api';
import { Task } from '../../interfaces';
import { KanbanBoard } from '../../components/tasks/kanban-board';
import { NewTaskDialog } from '../../components/tasks/new-task-dialog';
import { NewDashboardDialog } from '../../components/tasks/new-dashboard-dialog';
import { TaskArchiveToggle } from '@/app/components/tasks/task-archive-toggle';
import { Loader2 } from 'lucide-react';
import { cookies } from 'next/headers';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export default async function TarefasPage(props: { searchParams: SearchParams }) {
  const searchParams = await props.searchParams;
  const showArchived = searchParams.archived === 'true';

  const cookieStore = await cookies();
  const userCookie = cookieStore.get('user_session');
  const user = userCookie ? JSON.parse(userCookie.value) : null;

  const collaborators = await getCollaborators();
  const dashboards = (user && user.id) ? await getCollaboratorDashboards(user.id) : [];

  let tasks: Task[] = [];
  
  if (showArchived) {
    tasks = await getArchivedTasks();
  } else if (user && user.id) {
    // Busca todas as tarefas atribuídas ao usuário (inclusive sem dashboard)
    const assignedTasks = await getCollaboratorTasks(user.id);

    // Busca tarefas pessoais (origem: endpoint personal)
    const personalDashboards = await getPersonalDashboards(user.id);
    const personalTasks = personalDashboards.flatMap(d => d.tasks || []);
    
    // Busca tarefas dos dashboards compartilhados para preencher as abas quando selecionadas
    const dashboardDetailsPromises = dashboards.map(d => getDashboard(d.id));
    const dashboardsWithDetails = await Promise.all(dashboardDetailsPromises);
    const dashboardTasks = dashboardsWithDetails.flatMap(d => (d && d.tasks) ? d.tasks : []);

    // Merge everything
    const allTasks = [...assignedTasks, ...personalTasks, ...dashboardTasks];
    tasks = Array.from(new Map(allTasks.map(item => [item.id, item])).values());
    
    // Ensure default status
    tasks = tasks.map(t => ({...t, status: t.status || 'todo'}));
  }

  return (
    <div className="h-full flex flex-col p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {showArchived ? 'Tarefas Arquivadas' : 'Tarefas'}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {showArchived ? 'Visualizando histórico de tarefas antigas.' : 'Gerencie suas atividades e acompanhe o progresso.'}
          </p>
        </div>
        <div className="flex items-center gap-3">
           <TaskArchiveToggle isArchived={showArchived} />
           {!showArchived && (
            <>
              <NewDashboardDialog collaborators={collaborators} />
            </>
           )}
        </div>
        <div className="flex items-center w-full">
           <NewTaskDialog userEmail={user?.email} collaborators={collaborators} dashboards={dashboards} />
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <Suspense fallback={
          <div className="h-full w-full flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        }>
          <KanbanBoard 
            initialTasks={tasks} 
            isArchivedView={showArchived} 
            collaborators={collaborators} 
            dashboards={dashboards} 
            currentUserId={user?.id}
          />
        </Suspense>
      </div>
    </div>
  );
}
