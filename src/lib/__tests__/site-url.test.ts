import { afterEach, describe, expect, it, vi } from "vitest";
import { getCanonicalUrl, getSiteOrigin, isIndexableDeployment } from "@/lib/site-url";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("site URL helpers", () => {
  it("returns no origin when no public URL is configured", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
    vi.stubEnv("VERCEL_PROJECT_PRODUCTION_URL", "");

    expect(getSiteOrigin()).toBeUndefined();
  });

  it("normalizes a configured URL to its origin", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", " https://iglesia.example/path?source=preview#top ");

    expect(getSiteOrigin()?.toString()).toBe("https://iglesia.example/");
  });

  it("uses the Vercel production host when the public URL is blank", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "   ");
    vi.stubEnv("VERCEL_PROJECT_PRODUCTION_URL", "iglesia.example");

    expect(getSiteOrigin()?.toString()).toBe("https://iglesia.example/");
  });

  it.each(["ftp://iglesia.example", "/relative/path", "not a URL"])(
    "rejects unsupported or malformed origins: %s",
    (configuredUrl) => {
      vi.stubEnv("NEXT_PUBLIC_SITE_URL", configuredUrl);
      vi.stubEnv("VERCEL_PROJECT_PRODUCTION_URL", "");

      expect(getSiteOrigin()).toBeUndefined();
    },
  );

  it("builds canonical URLs for paths with or without a leading slash", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://iglesia.example/base");

    expect(getCanonicalUrl("/sermones")).toBe("https://iglesia.example/sermones");
    expect(getCanonicalUrl("contacto")).toBe("https://iglesia.example/contacto");
  });

  it("allows indexing only for production deployments on a public origin", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://iglesia.example");
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("VERCEL_ENV", "production");

    expect(isIndexableDeployment()).toBe(true);
  });

  it.each(["localhost", "127.0.0.1"])("keeps local host %s out of search indexes", (host) => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", `http://${host}:3000`);
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("VERCEL_ENV", "production");

    expect(isIndexableDeployment()).toBe(false);
  });

  it("keeps preview deployments out of search indexes", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://iglesia.example");
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("VERCEL_ENV", "preview");

    expect(isIndexableDeployment()).toBe(false);
  });
});
