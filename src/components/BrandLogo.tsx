import Image from "next/image";

const LOGO_FULL = "/logo-salfate.jpeg";
const LOGO_MARK = "/logo-mark.png";

type BrandLogoVariant = "mark" | "full" | "header";

type BrandLogoProps = {
  variant?: BrandLogoVariant;
  className?: string;
  priority?: boolean;
};

const config: Record<
  "mark" | "full",
  {
    src: string;
    width: number;
    height: number;
    sizes: string;
    className: string;
  }
> = {
  mark: {
    src: LOGO_MARK,
    width: 256,
    height: 142,
    sizes: "(max-width: 640px) 120px, 140px",
    className: "h-10 w-auto sm:h-11",
  },
  full: {
    src: LOGO_FULL,
    width: 1147,
    height: 1092,
    sizes: "(max-width: 640px) 180px, 220px",
    className: "h-[4.5rem] w-auto sm:h-20",
  },
} as const;

function resolveVariant(variant: BrandLogoVariant): "mark" | "full" {
  return variant === "full" ? "full" : "mark";
}

export function BrandLogo({
  variant = "mark",
  className = "",
  priority = false,
}: BrandLogoProps) {
  const resolved = resolveVariant(variant);
  const { src, width, height, sizes, className: sizeClass } = config[resolved];

  return (
    <Image
      src={src}
      alt="Salfate Abogados"
      width={width}
      height={height}
      sizes={sizes}
      priority={priority}
      className={`${sizeClass} ${className}`.trim()}
    />
  );
}

export { LOGO_FULL, LOGO_MARK };
