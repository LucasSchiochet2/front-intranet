import React from 'react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="md:min-h-screen max-md:mt-20 flex items-center justify-center bg-light">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg border border-gray-100">
        <div className="flex flex-col items-center mb-8">
           <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4 shadow-lg shadow-primary/30">
              <i className="las la-user-lock text-3xl text-white"></i>
           </div>
           <h2 className="text-2xl font-bold text-center text-mono-dark">Bem-vindo de volta</h2>
           <p className="text-sm text-center text-mono mt-2">Acesse sua conta para continuar</p>
        </div>
        {children}
      </div>
    </div>
  );
}