'use server'

import { login } from './api';
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
