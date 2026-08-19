import type { Metadata } from "next";
import { AboutContent } from "@/components/about/AboutContent";
import { getAboutPage } from "@/lib/content";

export const metadata: Metadata = {
  title: "About",
  description: "Learn about the photographer behind Brian Wheeler Photography.",
};

export default async function AboutPage() {
  const about = await getAboutPage();

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <AboutContent about={about} />
    </div>
  );
}
