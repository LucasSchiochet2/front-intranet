import React from 'react';
import Link from 'next/link';

export function UsefulLinks() {
  const links = [
    { name: 'Helpdesk TI', url: '#', icon: 'la-laptop' },
    { name: 'Políticas Internas', url: '#', icon: 'la-book' },
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-mono-dark mb-4">Links Úteis</h3>
      <ul className="space-y-2">
        {links.map((link, index) => (
          <li key={index}>
            <Link 
              href={link.url}
              className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors group"
            >
              <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                <i className={`las ${link.icon} text-lg`}></i>
              </div>
              <span className="text-sm font-medium text-gray-700 group-hover:text-primary transition-colors">
                {link.name}
              </span>
              <i className="las la-external-link-alt text-xs text-gray-400 ml-auto opacity-0 group-hover:opacity-100 transition-opacity"></i>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
