const config = {
  apiKey: "AIzaSyDTYWsJFaAzTGpOIhrM8YTiJpzLmu4Ix8g",
  projectId: "mudflat-log",
};

const authBase = "https://identitytoolkit.googleapis.com/v1";
const firestoreBase = `https://firestore.googleapis.com/v1/projects/${config.projectId}/databases/(default)/documents`;

export type CommunitySession = { uid: string; idToken: string; email: string };
export type CommunityProfile = { uid: string; nickname: string; avatar: string; intro: string; email: string };
export type CommunityPost = { id: string; authorId: string; authorName: string; authorAvatar: string; title: string; body: string; createdAt: string };
export type CommunityComment = { id: string; authorId: string; authorName: string; authorAvatar: string; body: string; createdAt: string };

const fieldValue = (value: string) => ({ stringValue: value });
const fields = (data: Record<string, string>) => Object.fromEntries(Object.entries(data).map(([key, value]) => [key, fieldValue(value)]));
const value = (item: { stringValue?: string; integerValue?: string } | undefined) => item?.stringValue ?? item?.integerValue ?? "";

async function request(url: string, init?: RequestInit) {
  const response = await fetch(url, init);
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload?.error?.message || "Firebase 요청에 실패했습니다.");
  return payload;
}

async function authenticate(endpoint: "signUp" | "signInWithPassword", email: string, password: string): Promise<CommunitySession> {
  const payload = await request(`${authBase}/accounts:${endpoint}?key=${config.apiKey}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password, returnSecureToken: true }) });
  return { uid: payload.localId, idToken: payload.idToken, email: payload.email };
}

export const createCommunityAccount = (email: string, password: string) => authenticate("signUp", email, password);
export const signInCommunity = (email: string, password: string) => authenticate("signInWithPassword", email, password);

const headers = (session: CommunitySession) => ({ "Content-Type": "application/json", Authorization: `Bearer ${session.idToken}` });
const documentPath = (path: string) => `${firestoreBase}/${path}`;

export async function saveCommunityProfile(session: CommunitySession, profile: CommunityProfile) {
  await request(documentPath(`users/${session.uid}`), { method: "PATCH", headers: headers(session), body: JSON.stringify({ fields: fields(profile) }) });
}

export async function getCommunityProfile(session: CommunitySession, uid: string): Promise<CommunityProfile | null> {
  try { const doc = await request(documentPath(`users/${uid}`), { headers: headers(session) }); const f = doc.fields ?? {}; return { uid, nickname: value(f.nickname), avatar: value(f.avatar), intro: value(f.intro), email: value(f.email) }; } catch { return null; }
}

const parsePost = (doc: { name: string; fields?: Record<string, { stringValue?: string }> }): CommunityPost => {
  const f = doc.fields ?? {}, id = doc.name.split("/").pop() ?? "";
  return { id, authorId: value(f.authorId), authorName: value(f.authorName), authorAvatar: value(f.authorAvatar), title: value(f.title), body: value(f.body), createdAt: value(f.createdAt) };
};
const parseComment = (doc: { name: string; fields?: Record<string, { stringValue?: string }> }): CommunityComment => {
  const f = doc.fields ?? {}, id = doc.name.split("/").pop() ?? "";
  return { id, authorId: value(f.authorId), authorName: value(f.authorName), authorAvatar: value(f.authorAvatar), body: value(f.body), createdAt: value(f.createdAt) };
};

export async function listCommunityPosts(session: CommunitySession) {
  const payload = await request(`${documentPath("communityPosts")}?pageSize=50&orderBy=createdAt%20desc`, { headers: headers(session) });
  return (payload.documents ?? []).map(parsePost) as CommunityPost[];
}
export async function createCommunityPost(session: CommunitySession, post: Omit<CommunityPost, "id">) {
  await request(documentPath("communityPosts"), { method: "POST", headers: headers(session), body: JSON.stringify({ fields: fields(post) }) });
}
export async function listCommunityComments(session: CommunitySession, postId: string) {
  const payload = await request(`${documentPath(`communityPosts/${postId}/comments`)}?pageSize=50&orderBy=createdAt%20asc`, { headers: headers(session) });
  return (payload.documents ?? []).map(parseComment) as CommunityComment[];
}
export async function createCommunityComment(session: CommunitySession, postId: string, comment: Omit<CommunityComment, "id">) {
  await request(documentPath(`communityPosts/${postId}/comments`), { method: "POST", headers: headers(session), body: JSON.stringify({ fields: fields(comment) }) });
}
