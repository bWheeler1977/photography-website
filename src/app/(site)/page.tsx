import { Hero } from "@/components/home/Hero";
import { FeaturedGallery } from "@/components/home/FeaturedGallery";
import { getFeaturedPhotos } from "@/lib/photos";
import { getSiteSettings } from "@/lib/content";

export default async function HomePage() {
  const [photos, siteSettings] = await Promise.all([
    getFeaturedPhotos(),
    getSiteSettings(),
  ]);

  return (
    <>
      <Hero settings={siteSettings} />
      <FeaturedGallery photos={photos} />
    </>
  );
}
