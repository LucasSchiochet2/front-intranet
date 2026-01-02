'use server'

import { login, API_URL, getOmbudsmanProtocol } from './api';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function authenticate(prevState: any, formData: FormData) {
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

