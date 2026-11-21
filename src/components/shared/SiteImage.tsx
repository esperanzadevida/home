import Image, { type ImageProps } from "next/image";
import { withBasePath } from "@/lib/site-url";

function resolveImageSource(src: ImageProps["src"]): ImageProps["src"] {
  if (typeof src !== "string" || !src.startsWith("/") || src.startsWith("//")) {
    return src;
  }

  return withBasePath(src);
}

export default function SiteImage(props: ImageProps) {
  return <Image {...props} alt={props.alt} src={resolveImageSource(props.src)} />;
}
