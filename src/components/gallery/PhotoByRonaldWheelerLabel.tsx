export const PHOTO_BY_RONALD_WHEELER_LABEL = "Photo by Ronald Wheeler";

type PhotoByRonaldWheelerLabelProps = {
  className?: string;
};

export function PhotoByRonaldWheelerLabel({
  className = "",
}: PhotoByRonaldWheelerLabelProps) {
  return (
    <span
      className={`inline-block rounded-full border border-white/25 bg-black/55 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-white/90 backdrop-blur-sm ${className}`}
    >
      {PHOTO_BY_RONALD_WHEELER_LABEL}
    </span>
  );
}
