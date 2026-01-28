import React from 'react';
import { getBirthDays,  storageUrl } from '../api';
import { BirthDay } from '../interfaces';
import Image from 'next/image';

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const isToday = date.getDate() === today.getDate() && date.getMonth() === today.getMonth();
  const isTomorrow = date.getDate() === tomorrow.getDate() && date.getMonth() === tomorrow.getMonth();

  if (isToday) {
    return 'Hoje';
  } else if (isTomorrow) {
    return 'Amanhã';
  } else {
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  }
}

export async function Birthdays() {
  const response = await getBirthDays();
  
  let birthdays: BirthDay[] = [];
  
  if (Array.isArray(response)) {
    birthdays = response;
  } else if (response && typeof response === 'object') {
    type BirthdaysResponse = { birthdays?: BirthDay[]; data?: BirthDay[] };
    const resp = response as BirthdaysResponse;
    if (Array.isArray(resp.birthdays)) {
      birthdays = resp.birthdays;
    } else if (Array.isArray(resp.data)) {
      birthdays = resp.data;
    }
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-mono-dark mb-4">Aniversariantes</h3>
      {birthdays.length === 0 ? (
        <p className="text-sm text-gray-500">Nenhum aniversariante próximo.</p>
      ) : (
        <ul className="space-y-3">
          {birthdays.slice(0, 3).map((birthday, index) => {
            const imageUrl = birthday.url_photo 
              ? (birthday.url_photo.startsWith('http') ? birthday.url_photo : `${storageUrl}storage/${birthday.url_photo}`)
              : null;

            return (
            <li key={index} className="flex items-center gap-3">
              {imageUrl ? (
                 <div className="w-10 h-10 rounded-full overflow-hidden relative">
                    <Image 
                      src={imageUrl} 
                      alt={birthday.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                 </div>
              ) : (
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                  index % 2 === 0 ? 'bg-accent/20 text-accent' : 'bg-primary/20 text-primary'
                }`}>
                  {getInitials(birthday.name)}
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-gray-700">{birthday.name}</p>
                <p className="text-xs text-gray-500">{formatDate(birthday.birth_date)}</p>
              </div>
            </li>
          )})}
        </ul>
      )}
    </div>
  );
}
