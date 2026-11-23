export function getAuthRedirectUrl(pathname: string, origin: string) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH?.trim().replace(/\/+$/, "") ?? "";
  const path = pathname.startsWith("/") ? pathname : "/" + pathname;
  const url = new URL(path, origin);
  const normalizedPath = url.pathname.replace(/\/+$/, "") || "/";
  url.pathname = basePath + (normalizedPath === "/" ? "/" : normalizedPath + "/");
  return url.toString();
}
