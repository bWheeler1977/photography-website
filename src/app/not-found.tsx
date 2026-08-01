import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-6 py-32 text-center">
      <p className="text-sm uppercase tracking-[0.2em] text-muted">404</p>
      <h1 className="mt-3 text-3xl font-semibold">Page not found</h1>
      <p className="mt-4 text-muted">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-full border border-border px-6 py-2.5 text-sm transition hover:border-accent hover:text-accent"
      >
        Back to home
      </Link>
    </div>
  );
}
