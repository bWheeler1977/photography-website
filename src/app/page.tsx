import { Hero } from "@/components/home/Hero";
import { FeaturedGallery } from "@/components/home/FeaturedGallery";
import { getFeaturedPhotos } from "@/lib/photos";

export default function HomePage() {
  const photos = getFeaturedPhotos();

  return (
    <>
      <Hero />
      <FeaturedGallery photos={photos} />
    </>
  );
}
