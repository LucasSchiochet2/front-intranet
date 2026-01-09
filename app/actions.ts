'use server'

import { login, API_URL, getOmbudsmanProtocol, createTask, updateTask, Task, archiveTask, createDashboard, updateDashboard, deleteDashboard, getCollaborators, getMenu, getCollaboratorDashboards, getDashboard, getTask } from './api';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

export async function getTaskDetailsAction(id: number) {
    try {
        const task = await getTask(id);
        return { success: true, data: task };
    } catch (error) {
        console.error('getTaskDetailsAction error:', error);
        return { success: false, error: 'Falha ao buscar detalhes da tarefa' };
    }
}

export async function getDashboardDetailsAction(id: number) {
    try {
        const dashboard = await getDashboard(id);
        return { success: true, data: dashboard };
    } catch (error) {
        console.error('getDashboardDetailsAction error:', error);
        return { success: false, error: 'Falha ao buscar detalhes do dashboard' };
    }
}

export async function authenticate(prevState: unknown, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  try {
    const response = await login({ email, password });
    
    if (response.collaborator) {
      const cookieStore = await cookies();
      
      // Merge tenant_id into user object if present in response
      const userData = {
        ...response.collaborator,
        ...(response.tenant_id ? { tenant_id: response.tenant_id } : {})
      };

      // Store the collaborator info in a cookie
      // In a production app, you should use a secure, HTTP-only session cookie
      cookieStore.set('user_session', JSON.stringify(userData), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: '/',
      });

      revalidatePath('/');
      return { success: true, user: userData };
    }

    return { success: false, error: 'Credenciais inválidas' };
  } catch (error: unknown) {
    console.error('Authentication error:', error);
    const message = error instanceof Error ? error.message : 'Falha na autenticação';
    return { success: false, error: message };
  }
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete('user_session');
  revalidatePath('/');
}

export type OmbudsmanState = {
  success: boolean;
  error?: string;
  message?: string;
  token?: string;
};

export async function submitOmbudsman(prevState: OmbudsmanState, formData: FormData): Promise<OmbudsmanState> {
  try {
    const response = await fetch(`${API_URL}ombudsman`, {
      method: 'POST',
      headers: {
        'X-Frontend-Secret': process.env.FRONTEND_SECRET || '',
      },
      body: formData,
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      return { success: false, error: data.message || 'Erro ao enviar solicitação' };
    }

    const data = await response.json();
    return { 
      success: true, 
      message: 'Solicitação enviada com sucesso!',
      token: data.token 
    };
  } catch (error) {
    console.error('Ombudsman error:', error);
    return { success: false, error: 'Erro de conexão ao enviar solicitação' };
  }
}

export async function fetchOmbudsmanProtocol(token: string) {
  return await getOmbudsmanProtocol(token);
}

export async function submitTask(prevState: unknown, formData: FormData) {
  try {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get('user_session');
    const user = userCookie ? JSON.parse(userCookie.value) : null;

    if (!user || !user.id) {
      return { success: false, error: 'Usuário não autenticado' };
    }

    formData.set('collaborator_id_sender', user.id);
    
    // Ensure defaults
    if (!formData.get('status')) formData.set('status', 'pending');
    if (!formData.get('is_completed')) formData.set('is_completed', '0');

    // Remove dashboard_id if empty (so it's sent as null or omitted if backend expects that)
    // Or simpler: if empty string, simply delete it.
    const dashboardId = formData.get('dashboard_id');
    if (dashboardId === '' || dashboardId === '0') {
      formData.delete('dashboard_id');
    }

    const response = await createTask(formData);
    revalidatePath('/tarefas');
    revalidatePath('/'); 
    return { success: true, message: 'Tarefa criada com sucesso!', data: response };
  } catch (error: unknown) {
    console.error('Submit task error:', error);
    const message = error instanceof Error ? error.message : 'Erro ao criar tarefa';
    return { success: false, error: message };
  }
}

export async function createDashboardAction(prevState: unknown, formData: FormData) {
  try {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get('user_session');
    const user = userCookie ? JSON.parse(userCookie.value) : null;
    
    console.log('User from cookie:', user);

    let tenant_id = user?.tenant_id || user?.company_id; 

    // If tenant_id is missing, try to fetch it from collaborators
    if (!tenant_id && user?.id) {
       try {
           const allCollaborators = await getCollaborators();
           // Use loose equality for ID matching (string vs number)
           const currentUser = allCollaborators.find(c => c.id == user.id);
           
           if (currentUser?.tenant_id) {
               tenant_id = currentUser.tenant_id;
           } else if (allCollaborators.length > 0 && allCollaborators[0].tenant_id) {
               // Fallback: if user not found or has no tenant_id, use first collaborator's tenant_id
               // assuming all collaborators are in the same tenant context
               tenant_id = allCollaborators[0].tenant_id;
           }
       } catch (err) {
           console.error('Error fetching collaborators to find tenant_id:', err);
       }
    }

    // Try to get tenant_id from common resources like Menu if still missing
    if (!tenant_id) {
        try {
            const menu = await getMenu();
            // Find first item with tenant_id (recursively if needed, but top level is fine usually)
            type MenuItem = { tenant_id?: string | number; children?: MenuItem[] };
            
            const findTenantId = (items: MenuItem[]): string | number | null => {
                for (const item of items) {
                    if (item.tenant_id) return item.tenant_id;
                    if (item.children && item.children.length) {
                        const found = findTenantId(item.children);
                        if (found) return found;
                    }
                }
                return null;
            };
            tenant_id = findTenantId(menu as MenuItem[]);
        } catch (err) {
            console.error('Error fetching menu to find tenant_id:', err);
        }
    }

    // Try to get tenant_id from existing dashboards
    if (!tenant_id && user?.id) {
        try {
            const dashboards = await getCollaboratorDashboards(user.id);
            // Cast to a type that includes tenant_id, assuming it might preserve it from API
            const firstDashboard = dashboards[0] as { tenant_id?: string | number };
            if (dashboards.length > 0 && firstDashboard.tenant_id) {
                tenant_id = firstDashboard.tenant_id;
            }
        } catch (err) {
             console.error('Error fetching dashboards to find tenant_id:', err);
        }
    }
    
    // Fallback if still missing (development environment usually is 1)
    if (!tenant_id) {
        console.warn('Tenant ID not found in user session or collaborators list. Defaulting to 1.');
        tenant_id = 1;
    }

    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const collaboratorsRaw = formData.getAll('collaborators[]'); // or just 'collaborators' depending on how multiselect works
    
    // Convert collaborators to numbers
    const collaborators = collaboratorsRaw.map(Number).filter(id => !isNaN(id));

    if (!name) {
        return { success: false, error: 'Nome do dashboard é obrigatório' };
    }
    
    console.log('Creating dashboard with:', { name, description, collaborators, tenant_id });

    const response = await createDashboard({ 
      name, 
      description, 
      collaborators,
      tenant_id
    });
    
    revalidatePath('/tarefas');
    return { success: true, message: 'Dashboard criado com sucesso!', data: response };
  } catch (error: unknown) {
    console.error('Create dashboard error:', error);
    const message = error instanceof Error ? error.message : 'Erro ao criar dashboard';
    return { success: false, error: message };
  }
}

export async function updateDashboardAction(prevState: unknown, formData: FormData) {
  try {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get('user_session');
    
    let tenant_id = '1';
    if (userCookie) {
        const user = JSON.parse(userCookie.value);
        tenant_id = user.tenant_id || '1';
    } else {
        tenant_id = '1';
    }

    const id = formData.get('id');
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const collaboratorsRaw = formData.getAll('collaborators[]');
    
    // Convert collaborators to numbers
    const collaborators = collaboratorsRaw.map(Number).filter(id => !isNaN(id));

    if (!id) {
        return { success: false, error: 'ID do dashboard é obrigatório' };
    }

    if (!name) {
        return { success: false, error: 'Nome do dashboard é obrigatório' };
    }
    
    console.log('Updating dashboard with:', { id, name, description, collaborators, tenant_id });

    // Create FormData to use with the robust update pattern (POST + _method=PUT)
    const payload = new FormData();
    payload.append('name', name);
    payload.append('description', description);
    payload.append('tenant_id', String(tenant_id));
    
    // Append collaborators as array
    collaborators.forEach(cId => {
        payload.append('collaborators[]', String(cId));
    });

    const response = await updateDashboard(Number(id), payload);
    
    revalidatePath('/tarefas');
    return { success: true, message: 'Dashboard atualizado com sucesso!', data: response };
  } catch (error: unknown) {
    console.error('Update dashboard error:', error);
    const message = error instanceof Error ? error.message : 'Erro ao atualizar dashboard';
    return { success: false, error: message };
  }
}

export async function deleteDashboardAction(id: number) {
  try {
    await deleteDashboard(id);
    revalidatePath('/tarefas');
    return { success: true, message: 'Dashboard excluído com sucesso!' };
  } catch (error: unknown) {
    console.error('Delete dashboard error:', error);
    const message = error instanceof Error ? error.message : 'Erro ao excluir dashboard';
    return { success: false, error: message };
  }
}

export async function editTaskAction(prevState: unknown, formData: FormData) {
  try {
    const id = formData.get('id');
    if (!id) return { success: false, error: 'ID da tarefa não fornecido' };
    
    // We can filter out empty fields if we want partial updates, but FormData usually sends everything.
    // If we want to support file uploads in edit, updateTask needs to handle it.
    
    const response = await updateTask(Number(id), formData);
    revalidatePath('/tarefas');
    return { success: true, message: 'Tarefa atualizada com sucesso!', data: response };
  } catch (error: unknown) {
    console.error('Edit task error:', error);
    const message = error instanceof Error ? error.message : 'Erro ao atualizar tarefa';
    return { success: false, error: message };
  }
}

export async function editTaskJsonAction(data: Partial<Task> & { id: number; checklist?: { id?: number; description: string; is_completed: boolean; _destroy?: boolean }[] }) {
  try {
    if (!data.id) return { success: false, error: 'ID da tarefa não fornecido' };
    
    // Ensure is_completed is boolean or compatible
    // Pass strictly strictly what API expects
    
    const response = await updateTask(data.id, data);
    revalidatePath('/tarefas');
    return { success: true, message: 'Tarefa atualizada com sucesso!', data: response };
  } catch (error: unknown) {
    console.error('Edit task JSON error:', error);
    const message = error instanceof Error ? error.message : 'Erro ao atualizar tarefa';
    return { success: false, error: message };
  }
}

export async function updateTaskStatus(id: number, status: string) {
  try {
    await updateTask(id, { status });
    revalidatePath('/tarefas');
    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, error: message };
  }
}

export async function archiveTaskAction(id: number) {
  try {
    await archiveTask(id);
    revalidatePath('/tarefas');
    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, error: message };
  }
}

export async function unarchiveTaskAction(id: number) {
  try {
    // Assuming unarchiveTask is imported from ./api
    const { unarchiveTask } = await import('./api');
    await unarchiveTask(id);
    revalidatePath('/tarefas');
    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, error: message };
  }
}

