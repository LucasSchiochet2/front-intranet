import React from 'react';

export function QuickAccess() {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-mono-dark mb-4">Acesso Rápido</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-gray-50 rounded-lg text-center hover:bg-gray-100 transition-colors cursor-pointer">
          <i className="las la-file-invoice-dollar text-3xl text-primary mb-2"></i>
          <p className="text-sm font-medium text-gray-700">Documentos</p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg text-center hover:bg-gray-100 transition-colors cursor-pointer">
          <i className="las la-comments text-3xl text-primary mb-2"></i>
          <p className="text-sm font-medium text-gray-700">Ouvidoria</p>
        </div>
      </div>
    </div>
  );
}
