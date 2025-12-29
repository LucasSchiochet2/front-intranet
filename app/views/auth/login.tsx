"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authenticate } from '@/app/actions';
// import Link from 'next/link';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('email', email);
      formData.append('password', password);

      const result = await authenticate(null, formData);

      if (result.success) {
        router.push('/');
      } else {
        setError(result.error || 'Falha ao realizar login. Verifique suas credenciais.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Ocorreu um erro inesperado. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-500 text-sm p-3 rounded-lg border border-red-100">
          {error}
        </div>
      )}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-mono-dark mb-2">
          Email
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <i className="las la-envelope text-xl text-gray-400"></i>
          </div>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary sm:text-sm transition-colors outline-none"
            placeholder="seu@email.com"
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-mono-dark mb-2">
          Senha
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <i className="las la-lock text-xl text-gray-400"></i>
          </div>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary sm:text-sm transition-colors outline-none"
            placeholder="••••••••"
            required
          />
        </div>
        {/* <div className="flex justify-end mt-1">
          <Link href="/forgot-password" className="text-sm text-primary hover:text-primary-dark font-medium">
            Esqueceu a senha?
          </Link>
        </div> */}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <i className="las la-spinner animate-spin text-xl"></i>
            Entrando...
          </span>
        ) : (
          'Entrar'
        )}
      </button>
    </form>
  );
}
