import { CommunitySession } from "./community";

const projectId = "mudflat-log";
const base = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/catalogOverrides`;
export type CatalogOverride = { speciesId: string; description: string; updatedAt: string };

const request = async (url: string, init?: RequestInit) => {
  const response = await fetch(url, init);
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload?.error?.message || "도감 설명을 저장하지 못했습니다.");
  return payload;
};
const value = (field: { stringValue?: string } | undefined) => field?.stringValue ?? "";

export async function getCatalogOverride(speciesId: string): Promise<CatalogOverride | null> {
  try { const doc = await request(`${base}/${speciesId}`); const fields = doc.fields ?? {}; return { speciesId, description: value(fields.description), updatedAt: value(fields.updatedAt) }; } catch { return null; }
}
export async function saveCatalogOverride(session: CommunitySession, override: CatalogOverride) {
  await request(`${base}/${override.speciesId}`, { method: "PATCH", headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.idToken}` }, body: JSON.stringify({ fields: { speciesId: { stringValue: override.speciesId }, description: { stringValue: override.description }, updatedAt: { stringValue: override.updatedAt } } }) });
}
