import Image from "next/image";
import { cn } from "@/lib/utils";

interface SiteImageProps {
  src: string | null | undefined;
  alt: string;
  className?: string;
  /** Fill the parent element — the parent must be `relative` and sized. */
  fill?: boolean;
  /** Responsive srcset sizes. Required for `fill` images. */
  sizes?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  quality?: number;
}

/**
 * Shared image component for the public site.
 *
 * Renders through `next/image` so every uploaded image (UploadThing /
 * `utfs.io` / `*.ufs.sh` or local `/photos/...`) is served as an
 * automatically resized, compressed, and cached thumbnail instead of
 * the full-size original.
 */
export function SiteImage({
  src,
  alt,
  className,
  fill = false,
  sizes,
  width,
  height,
  priority = false,
  quality = 75,
}: SiteImageProps) {
  if (!src) return null;

  return (
    <Image
      src={src}
      alt={alt}
      className={cn(fill && "object-cover", className)}
      fill={fill}
      sizes={sizes}
      width={!fill ? width : undefined}
      height={!fill ? height : undefined}
      priority={priority}
      quality={quality}
    />
  );
}
