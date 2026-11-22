import Image from "@/components/shared/SiteImage";

type BrandMarkProps = {
  className?: string;
};

export function BrandMark({ className }: BrandMarkProps) {
  return (
    <Image
      src="/images/brand/esperanza-de-vida-flame.png"
      alt=""
      aria-hidden="true"
      className={className}
      width={1024}
      height={1024}
      sizes="48px"
      priority
    />
  );
}
