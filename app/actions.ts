'use server'

import { login, API_URL, getOmbudsmanProtocol, createTask, updateTask, Task, archiveTask } from './api';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

export async function authenticate(prevState: unknown, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  try {
    const response = await login({ email, password });
    
    if (response.collaborator) {
      const cookieStore = await cookies();
      // Store the collaborator info in a cookie
      // In a production app, you should use a secure, HTTP-only session cookie
      cookieStore.set('user_session', JSON.stringify(response.collaborator), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: '/',
      });

      revalidatePath('/');
      return { success: true, user: response.collaborator };
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

