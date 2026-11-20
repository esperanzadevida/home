/**
 * Public origin used for canonical URLs and structured metadata.
 *
 * On Vercel, prefer the stable production domain even when building a preview.
 * Local builds intentionally have no canonical origin unless configured.
 */
export function getSiteOrigin(): URL | undefined {
  const configuredOrigin = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const vercelProductionHost = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  const candidate = configuredOrigin || (vercelProductionHost ? `https://${vercelProductionHost}` : undefined);

  if (!candidate) return undefined;

  try {
    const url = new URL(candidate);
    if (url.protocol !== "http:" && url.protocol !== "https:") return undefined;
    return new URL(url.origin);
  } catch {
    return undefined;
  }
}

export function getCanonicalUrl(pathname: string): string | undefined {
  const origin = getSiteOrigin();
  if (!origin) return undefined;

  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return new URL(path, origin).toString();
}

export function isIndexableDeployment(): boolean {
  const origin = getSiteOrigin();
  if (!origin || process.env.NODE_ENV !== "production") return false;
  if (origin.hostname === "localhost" || origin.hostname === "127.0.0.1") return false;
  if (process.env.VERCEL_ENV && process.env.VERCEL_ENV !== "production") return false;
  return true;
}
