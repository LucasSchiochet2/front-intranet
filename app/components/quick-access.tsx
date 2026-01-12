import React from 'react';
import Link from 'next/link';
import { getFastAccess } from '../api';

export async function QuickAccess() {
  const items = await getFastAccess();

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-mono-dark mb-4">Acesso Rápido</h3>
      <div className="grid grid-cols-2 gap-4">
        {items.map((item) => (
          <Link 
            key={item.id} 
            href={item.link || '#'} 
            className="p-4 bg-gray-50 rounded-lg text-center hover:bg-gray-100 transition-colors cursor-pointer block group"
          >
            <i className={`${item.icon || 'las la-external-link-alt'} text-3xl text-primary mb-2 group-hover:scale-110 transition-transform`}></i>
            <p className="text-sm font-medium text-gray-700">{item.name}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
