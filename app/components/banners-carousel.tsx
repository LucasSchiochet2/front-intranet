"use client";

import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {  storageUrl } from '../api';
import { Banner } from '../interfaces';

export function BannersCarousel({ banners }: { banners: Banner[] }) {
  if (!banners || banners.length === 0) return null;

  return (
    <div className="w-full rounded-xl overflow-hidden shadow-lg">
      <Swiper
        modules={[Pagination, Autoplay, Navigation]}
        direction="vertical"
        spaceBetween={0}
        slidesPerView={1}
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        className="w-full h-[250px] sm:h-[400px]"
      >
        {banners.map((banner) => {
          const imageUrl = banner.image_url 
            ? (banner.image_url.startsWith('http') ? banner.image_url : `${storageUrl}storage/${banner.image_url}`)
            : 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80';

          return (
          <SwiperSlide key={banner.id} className="relative">
            <div className="relative w-full h-full">
              <Image
                src={imageUrl}
                alt={banner.title}
                fill
                className="object-cover"
                priority
                unoptimized={imageUrl.includes('intranetproject.test')}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4 md:p-8 text-white">
                <h2 className="text-xl md:text-3xl font-bold mb-2">{banner.title}</h2>
                {banner.description && (
                  <p className="text-sm md:text-lg mb-4 max-w-2xl line-clamp-2 md:line-clamp-none">{banner.description}</p>
                )}
                {banner.link_url && (
                  <Link 
                    href={banner.link_url}
                    className="inline-block bg-primary hover:bg-primary-dark text-white px-4 py-1.5 md:px-6 md:py-2 text-sm md:text-base rounded-lg transition-colors w-fit"
                  >
                    Saiba mais
                  </Link>
                )}
              </div>
            </div>
          </SwiperSlide>
        )})}
      </Swiper>
    </div>
  );
}
