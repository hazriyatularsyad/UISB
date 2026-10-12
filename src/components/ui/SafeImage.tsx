"use client"

import Image from "next/image"
import type { ImageProps } from "next/image"

const PLACEHOLDER_IMAGE = "/images/hero-mobile.webp"

interface SafeImageProps extends Omit<ImageProps, "onError" | "placeholder"> {
  src: string
  placeholder?: "blur" | "empty" | `data:image/${string}`
}

export function SafeImage({
  src,
  placeholder = "empty",
  ...props
}: SafeImageProps) {
  return (
    <Image
      src={src}
      onError={(e) => {
        e.currentTarget.src = PLACEHOLDER_IMAGE
      }}
      placeholder={placeholder}
      {...props}
    />
  )
}