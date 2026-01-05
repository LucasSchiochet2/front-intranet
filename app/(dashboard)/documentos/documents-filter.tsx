"use client";

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';
import { DocumentCategory } from '@/app/api';

export function DocumentsFilter({ categories }: { categories: DocumentCategory[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const currentSearch = searchParams.get('search') || '';
  const currentCategory = searchParams.get('category') || '';

  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (term) {
      params.set('search', term);
    } else {
      params.delete('search');
    }
    params.set('page', '1'); // Reset to page 1 on search
    router.push(`/documentos?${params.toString()}`);
  };

  const handleCategoryChange = (categoryId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (categoryId) {
      params.set('category', categoryId);
    } else {
      params.delete('category');
    }
    params.set('page', '1'); // Reset to page 1 on filter
    router.push(`/documentos?${params.toString()}`);
  };

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Buscar documentos..."
          defaultValue={currentSearch}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
        />
      </div>
      
      <div className="space-y-2 border border-primary p-2 rounded-lg bg-primary/10">
        <h3 className="font-semibold text-primary mb-3">Categorias</h3>
        <button
          onClick={() => handleCategoryChange('')}
          className={`w-full text-left px-4 py-2 rounded-lg transition-all text-sm font-medium ${
            !currentCategory
              ? 'bg-primary text-white shadow-md'
              : 'text-gray-600 hover:bg-gray-50 hover:text-primary'
          }`}
        >
          Todas as categorias
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryChange(category.id.toString())}
            className={`w-full text-left px-4 py-2 rounded-lg transition-all text-sm font-medium ${
              currentCategory === category.id.toString()
                ? 'bg-primary text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-50 hover:text-primary'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
}
