"use client";

import { useEffect, useRef, useState } from "react";
import { Skeleton } from "@/components/skeletons";

type LoadingImageProps = {
  src: string;
  alt: string;
  className: string;
  containerClassName?: string;
  loading?: "eager" | "lazy";
};

export default function LoadingImage({
  src,
  alt,
  className,
  containerClassName = "size-full",
  loading = "lazy",
}: LoadingImageProps) {
  const imageRef = useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (imageRef.current?.complete) setLoaded(true);
  }, [src]);

  return (
    <div className={`relative overflow-hidden ${containerClassName}`} aria-busy={!loaded}>
      {!loaded && <Skeleton className="absolute inset-0 z-0 rounded-none" />}
      <img
        ref={imageRef}
        src={src}
        alt={alt}
        loading={loading}
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
        className={`${className} relative z-10 transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
      />
    </div>
  );
}
