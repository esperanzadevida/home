export function getAuthRedirectUrl(pathname: string, origin: string) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH?.trim().replace(/\/+$/, "") ?? "";
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${origin}${basePath}${path}`;
}
