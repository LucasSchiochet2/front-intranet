import { getBanners } from '../api';
import { BannersCarousel } from './banners-carousel';

export async function Banners() {
  const banners = await getBanners();

  return (
    <section className="mb-8 mt-8">
      <BannersCarousel banners={banners} />
    </section>
  );
}
