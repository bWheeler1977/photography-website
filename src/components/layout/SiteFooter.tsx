import Link from "next/link";

type SiteFooterProps = {
  instagramUrl: string;
};

export function SiteFooter({ instagramUrl }: SiteFooterProps) {
  return (
    <footer className="border-t border-border/60">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-10 text-sm text-muted md:flex-row md:items-center md:justify-between">
        <p>&copy; {new Date().getFullYear()} Brian Wheeler Photography. All rights reserved.</p>
        <div className="flex gap-6">
          <Link href="/gallery" className="transition hover:text-foreground">
            Gallery
          </Link>
          <Link href="/shop" className="transition hover:text-foreground">
            Print Shop
          </Link>
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="transition hover:text-foreground"
          >
            Instagram
          </a>
        </div>
      </div>
    </footer>
  );
}
