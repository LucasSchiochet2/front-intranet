import React from 'react';

export function Birthdays() {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-mono-dark mb-4">Aniversariantes</h3>
      <ul className="space-y-3">
        <li className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold text-xs">
            JS
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">João Silva</p>
            <p className="text-xs text-gray-500">Hoje</p>
          </div>
        </li>
        <li className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">
            MA
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">Maria Almeida</p>
            <p className="text-xs text-gray-500">Amanhã</p>
          </div>
        </li>
      </ul>
    </div>
  );
}
