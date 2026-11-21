export type AdminBlogStatus = "Publicado" | "Borrador" | "Archivado";

export type AdminBlogDraft = {
  title: string;
  excerpt: string;
  author: string;
  category: string;
  tags: string;
  content: string;
  status: AdminBlogStatus;
  date: string;
  cover: string;
};

export type AdminBlogOverride = Partial<AdminBlogDraft> & {
  custom?: boolean;
  deleted?: boolean;
};

export const NEW_ADMIN_BLOG_DRAFT_ID = "__new_blog_draft__";
export const ADMIN_BLOG_STORAGE_EVENT = "domenica:admin-blog-storage-change";

const STORAGE_KEY = "domenica.admin.blog.v1";
const STORAGE_VERSION = 1;
const VALID_STATUSES = new Set<AdminBlogStatus>(["Publicado", "Borrador", "Archivado"]);
const DRAFT_FIELDS = ["title", "excerpt", "author", "category", "tags", "content", "status", "date", "cover"] as const;

type ReadResult = { ok: true; entries: Record<string, AdminBlogOverride> } | { ok: false; entries: Record<string, AdminBlogOverride> };
type StoredWorkspace = { version: number; entries: Record<string, AdminBlogOverride> };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseOverride(value: unknown): AdminBlogOverride | null {
  if (!isRecord(value)) return null;
  const result: AdminBlogOverride = {};

  for (const field of DRAFT_FIELDS) {
    const candidate = value[field];
    if (field === "status") {
      if (typeof candidate === "string" && VALID_STATUSES.has(candidate as AdminBlogStatus)) {
        result.status = candidate as AdminBlogStatus;
      }
    } else if (typeof candidate === "string") {
      result[field] = candidate;
    }
  }

  if (typeof value.custom === "boolean") result.custom = value.custom;
  if (typeof value.deleted === "boolean") result.deleted = value.deleted;
  return result;
}

function readWorkspace(): ReadResult {
  if (typeof window === "undefined") return { ok: false, entries: {} };

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ok: true, entries: {} };

    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed) || parsed.version !== STORAGE_VERSION || !isRecord(parsed.entries)) {
      return { ok: false, entries: {} };
    }

    const entries: Record<string, AdminBlogOverride> = {};
    for (const [id, value] of Object.entries(parsed.entries)) {
      const entry = parseOverride(value);
      if (entry) entries[id] = entry;
    }
    return { ok: true, entries };
  } catch {
    return { ok: false, entries: {} };
  }
}

function writeWorkspace(entries: Record<string, AdminBlogOverride>) {
  if (typeof window === "undefined") return false;
  const payload: StoredWorkspace = { version: STORAGE_VERSION, entries };

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    window.dispatchEvent(new CustomEvent(ADMIN_BLOG_STORAGE_EVENT));
    return true;
  } catch {
    return false;
  }
}

export function readAdminBlogWorkspace(): ReadResult {
  return readWorkspace();
}

export function readAdminBlogDraft(id: string) {
  const result = readWorkspace();
  const entry = result.entries[id];
  return {
    ok: result.ok,
    draft: entry && !entry.deleted ? entry : null,
  };
}

export function saveAdminBlogDraft(id: string, draft: AdminBlogDraft, custom = false) {
  const result = readWorkspace();
  if (!result.ok) return false;

  return writeWorkspace({
    ...result.entries,
    [id]: { ...draft, custom, deleted: false },
  });
}

export function updateAdminBlogStatus(id: string, status: AdminBlogStatus) {
  const result = readWorkspace();
  if (!result.ok) return false;
  const existing = result.entries[id] ?? {};

  return writeWorkspace({
    ...result.entries,
    [id]: { ...existing, status, deleted: false },
  });
}

export function removeAdminBlogEntry(id: string) {
  const result = readWorkspace();
  if (!result.ok) return false;
  const existing = result.entries[id] ?? {};

  return writeWorkspace({
    ...result.entries,
    [id]: { ...existing, deleted: true },
  });
}

export function clearAdminBlogEntry(id: string) {
  const result = readWorkspace();
  if (!result.ok) return false;
  const entries = { ...result.entries };
  delete entries[id];
  return writeWorkspace(entries);
}
