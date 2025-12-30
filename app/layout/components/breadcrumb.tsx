'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';

export function Breadcrumb() {
  const pathname = usePathname();
  
  // Remove query parameters and trailing slashes, then split
  const paths = pathname.split('/').filter(path => path);

  if (paths.length === 0) return null;

  return (
    <nav className="flex items-center text-sm text-gray-500 my-6" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        <li>
          <Link 
            href="/" 
            className="flex items-center hover:text-[var(--color-primary)] transition-colors"
          >
            <Home size={16} />
            <span className="sr-only">Início</span>
          </Link>
        </li>
        
        {paths.map((path, index) => {
          const href = `/${paths.slice(0, index + 1).join('/')}`;
          const isLast = index === paths.length - 1;
          
          // Format the path name: replace hyphens with spaces and capitalize
          const label = path
            .replace(/-/g, ' ')
            .replace(/^\w/, (c) => c.toUpperCase());

          return (
            <li key={path} className="flex items-center">
              <ChevronRight size={16} className="mx-1 text-gray-400" />
              {isLast ? (
                <span className="font-medium text-gray-900" aria-current="page">
                  {label}
                </span>
              ) : (
                <Link 
                  href={href}
                  className="hover:text-[var(--color-primary)] transition-colors"
                >
                  {label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
