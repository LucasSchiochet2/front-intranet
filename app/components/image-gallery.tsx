'use client';

import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, A11y } from 'swiper/modules';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface ImageGalleryProps {
  photos: string[];
  storageUrl: string;
  title: string;
}

export function ImageGallery({ photos, storageUrl, title }: ImageGalleryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [initialSlide, setInitialSlide] = useState(0);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const openGallery = (index: number) => {
    setInitialSlide(index);
    setIsOpen(true);
  };

  const closeGallery = () => {
    setIsOpen(false);
  };

  if (!photos || photos.length === 0) return null;

  return (
    <div className="border-t pt-8 mt-8">
      <h3 className="text-xl text-primary font-semibold mb-4">Galeria de Fotos</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {photos.map((photo, index) => (
          <div 
            key={index} 
            className="rounded-lg overflow-hidden h-48 bg-gray-100 cursor-pointer group relative"
            onClick={() => openGallery(index)}
          >
            <img
              src={`${storageUrl}${photo}`}
              alt={`Foto ${index + 1} - ${title}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
              <span className="opacity-0 group-hover:opacity-100 text-white bg-black/50 px-3 py-1 rounded-full text-sm transition-opacity">
                Ampliar
              </span>
            </div>
          </div>
        ))}
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
          <button 
            onClick={closeGallery}
            className="absolute top-4 right-4 text-white/70 hover:text-white z-50 p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <X size={32} />
          </button>

          <div className="w-full max-w-5xl h-full max-h-[85vh] flex items-center justify-center">
            <Swiper
              modules={[Navigation, Pagination, A11y]}
              spaceBetween={30}
              slidesPerView={1}
              navigation={{
                prevEl: '.custom-prev',
                nextEl: '.custom-next',
              }}
              pagination={{ clickable: true, dynamicBullets: true }}
              initialSlide={initialSlide}
              className="w-full h-full flex items-center"
            >
              {photos.map((photo, index) => (
                <SwiperSlide key={index} className="flex items-center justify-center h-full">
                  <div className="relative w-full h-full flex items-center justify-center">
                    <img
                      src={`${storageUrl}${photo}`}
                      alt={`Foto ${index + 1} - ${title}`}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                </SwiperSlide>
              ))}
              
              <button className="custom-prev absolute left-2 top-1/2 -translate-y-1/2 z-10 text-white/70 hover:text-white p-2 rounded-full hover:bg-black/20 transition-colors disabled:opacity-30">
                <ChevronLeft size={40} />
              </button>
              <button className="custom-next absolute right-2 top-1/2 -translate-y-1/2 z-10 text-white/70 hover:text-white p-2 rounded-full hover:bg-black/20 transition-colors disabled:opacity-30">
                <ChevronRight size={40} />
              </button>
            </Swiper>
          </div>
        </div>
      )}
    </div>
  );
}
