"use client";

import { useId } from "react";
import Image from "@/components/shared/SiteImage";
import { withBasePath } from "@/lib/site-url";

type StoreProductPreviewProps = {
  productId: string;
  image: string;
  alt: string;
  baseColorHex: string;
  colorHex: string;
  engravingText?: string;
  engravingColor?: string;
};

const PRODUCT_MASKS: Record<string, string> = {
  "hoodie-esperanza-viva":
    "M 378 104 C 411 92 449 100 468 120 C 497 110 526 110 555 120 C 584 100 627 93 653 109 C 675 124 679 166 686 207 C 704 224 731 235 757 257 C 794 292 814 354 828 429 C 840 500 838 602 826 653 C 820 681 805 704 781 720 L 723 768 C 708 789 692 822 667 843 C 642 862 608 852 580 838 L 548 824 L 469 824 L 434 842 C 407 856 377 865 354 847 C 331 829 321 795 302 774 L 241 722 C 216 705 200 683 194 654 C 182 596 181 501 193 431 C 207 351 225 293 259 260 C 287 232 324 215 342 198 C 350 163 356 119 378 104 Z M 287 771 L 352 786 L 397 842 L 354 865 C 330 864 315 848 302 827 Z M 646 797 L 714 768 L 758 815 L 713 860 C 685 868 661 850 642 839 Z",
  "camiseta-luz-ambato":
    "M 72 463 C 78 424 108 396 148 376 L 278 324 C 306 312 333 301 357 291 L 393 221 C 406 195 433 184 462 193 L 569 205 C 594 208 612 223 626 246 L 641 271 L 810 294 C 840 297 862 315 884 339 L 927 391 C 944 411 944 435 936 454 L 930 480 C 926 498 913 511 894 525 L 861 549 C 838 567 821 588 808 612 L 784 646 C 768 666 750 688 734 708 L 715 729 C 704 739 690 750 677 751 C 663 752 647 748 631 744 L 238 641 C 216 637 195 626 176 612 L 96 547 C 77 536 67 519 69 500 Z",
  "biblia-estudio-rvr1960":
    "M 79 322 C 84 302 105 294 132 286 L 652 207 C 677 202 696 211 713 230 L 940 474 C 955 490 950 507 930 518 L 360 750 C 337 760 319 747 304 729 L 89 392 C 77 375 73 344 79 322 Z",
  "cuaderno-sermon-a5":
    "M 106 570 L 452 185 C 463 173 479 173 495 180 L 889 314 C 907 320 911 332 898 346 L 582 692 C 572 703 558 704 543 697 L 119 590 C 103 586 96 579 106 570 Z",
  "termo-gracia-diaria":
    "M 431 149 C 430 135 441 124 455 124 L 569 124 C 585 124 595 136 594 151 L 604 202 C 623 217 633 238 634 265 L 637 774 C 638 799 628 813 608 820 L 420 820 C 400 813 390 799 391 774 L 395 265 C 396 237 406 217 424 202 Z",
  "gorra-ficoa-2014":
    "M 157 616 C 153 564 165 510 194 468 C 226 423 275 388 329 370 C 383 350 440 345 494 354 C 554 362 610 390 657 429 C 703 468 738 518 766 567 C 786 574 813 583 843 599 L 897 628 C 914 638 928 655 930 671 C 931 685 922 696 908 700 L 883 698 C 846 690 807 680 772 670 C 720 655 670 645 620 638 C 548 627 475 622 401 624 C 319 626 248 636 184 655 C 169 649 161 635 157 616 Z",
};

function parseHex(hex: string) {
  const normalized = hex.replace("#", "");
  const values = normalized.length === 3
    ? normalized.split("").map((value) => Number.parseInt(value + value, 16))
    : [0, 2, 4].map((index) => Number.parseInt(normalized.slice(index, index + 2), 16));
  return values.map((value) => Math.max(0, Math.min(255, value || 0)));
}

function averageChannel(hex: string) {
  return parseHex(hex).reduce((sum, channel) => sum + channel, 0) / 3;
}

function BibleEngraving({ text, color }: { text: string; color: string }) {
  const filterId = `engraving-${useId().replaceAll(":", "")}`;
  const [red, green, blue] = parseHex(color).map((channel) => (channel / 255).toFixed(3));
  const engravingText = text.trim() || "Esperanza de Vida";

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1024 1024"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-0 z-[2] h-full w-full"
    >
      <defs>
        <filter id={filterId} colorInterpolationFilters="sRGB">
          <feColorMatrix
            type="matrix"
            values={`0 0 0 0 ${red} 0 0 0 0 ${green} 0 0 0 0 ${blue} 0 0 0 1 0`}
          />
        </filter>
      </defs>
      <g transform="rotate(-13 512 448)">
        <image
          href={withBasePath("/images/brand/esperanza-de-vida-flame.png")}
          x="465"
          y="353"
          width="94"
          height="94"
          preserveAspectRatio="xMidYMid meet"
          filter={`url(#${filterId})`}
          opacity="0.94"
        />
        <text
          x="512"
          y="481"
          textAnchor="middle"
          fill={color}
          fontFamily="Georgia, 'Times New Roman', serif"
          fontSize="27"
          fontWeight="700"
          letterSpacing="1.1"
          opacity="0.96"
        >
          {engravingText.slice(0, 28)}
        </text>
      </g>
    </svg>
  );
}

export function StoreProductPreview({
  productId,
  image,
  alt,
  baseColorHex,
  colorHex,
  engravingText,
  engravingColor = "#c79a45",
}: StoreProductPreviewProps) {
  const mask = PRODUCT_MASKS[productId];
  const hasBibleEngraving = productId === "biblia-estudio-rvr1960";
  const shouldRecolor = Boolean(mask) && colorHex.toLowerCase() !== baseColorHex.toLowerCase();
  const baseTone = averageChannel(baseColorHex);
  const colorTone = averageChannel(colorHex);
  const brighten = Math.min(0.86, Math.max(0, (colorTone - baseTone) / 255));
  const darken = Math.min(0.86, Math.max(0, 1 - colorTone / Math.max(1, baseTone)));
  const maskScale =
    productId === "camiseta-luz-ambato" ? 0.985 : productId === "gorra-ficoa-2014" ? 0.98 : 1;
  const maskImage = mask
    ? `url("data:image/svg+xml,${encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"><g transform="translate(512 512) scale(${maskScale}) translate(-512 -512)"><path fill="white" fill-rule="evenodd" d="${mask}"/></g></svg>`,
      )}")`
    : undefined;
  const maskStyle = {
    maskImage,
    WebkitMaskImage: maskImage,
    maskRepeat: "no-repeat",
    WebkitMaskRepeat: "no-repeat",
    maskSize: "100% 100%",
    WebkitMaskSize: "100% 100%",
  } as const;

  return (
    <div className="group/product relative isolate h-full w-full overflow-hidden">
      <Image src={image} alt={alt} fill sizes="(max-width: 640px) 94vw, 520px" className="object-cover" />

      {shouldRecolor && mask && (
        <>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-[1]"
            style={{ ...maskStyle, backgroundColor: colorHex, mixBlendMode: "color" }}
          />
          {brighten > 0 && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-[1] bg-white"
              style={{ ...maskStyle, opacity: brighten, mixBlendMode: "screen" }}
            />
          )}
          {darken > 0 && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-[1] bg-black"
              style={{ ...maskStyle, opacity: darken, mixBlendMode: "multiply" }}
            />
          )}
        </>
      )}

      {hasBibleEngraving && (
        <BibleEngraving text={engravingText ?? "Esperanza de Vida"} color={engravingColor} />
      )}
    </div>
  );
}
