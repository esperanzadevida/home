import { createBrowserClient } from "@supabase/ssr";

let browserClient: ReturnType<typeof createBrowserClient> | null = null;

function readSupabaseEnvironment() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  if (!url || !key || url.includes("tu-proyecto") || key.includes("tu-")) {
    return null;
  }

  try {
    const parsed = new URL(url);
    const isLocalDevelopment = parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1";

    if (parsed.protocol !== "https:" && !isLocalDevelopment) return null;
  } catch {
    return null;
  }

  return { url, key };
}

export function isSupabaseBrowserConfigured() {
  return readSupabaseEnvironment() !== null;
}

export function getSupabaseBrowserClient() {
  const environment = readSupabaseEnvironment();
  if (!environment) return null;

  if (!browserClient) {
    browserClient = createBrowserClient(environment.url, environment.key, {
      isSingleton: true,
    });
  }

  return browserClient;
}
