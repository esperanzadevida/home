import Link from "next/link";
import type { LucideIcon } from "lucide-react";

type MobileNavigationItemProps = {
  href: string;
  label: string;
  icon: LucideIcon;
  active: boolean;
  variant: "tab" | "menu";
  onClick?: () => void;
};

export function MobileNavigationItem({
  href,
  label,
  icon: Icon,
  active,
  variant,
  onClick,
}: MobileNavigationItemProps) {
  if (variant === "tab") {
    return (
      <Link
        href={href}
        aria-current={active ? "page" : undefined}
        onClick={onClick}
        className={`mobile-navigation-link${active ? " is-active" : ""}`}
      >
        <Icon aria-hidden="true" className="h-5 w-5 shrink-0" />
        <span>{label}</span>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      onClick={onClick}
      className={`mobile-navigation-menu-link${active ? " is-active" : ""}`}
    >
      <Icon aria-hidden="true" className="h-5 w-5 shrink-0" />
      <span>{label}</span>
      {active && <span aria-hidden="true" className="mobile-navigation-current-dot" />}
    </Link>
  );
}
