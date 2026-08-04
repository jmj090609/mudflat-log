import { AppData, UserProfile } from "@/src/types";
const key = (userId: string) => `mudflat-log:data:${userId}`;
export const guestId = "guest-local";
export const emptyData = (profile: UserProfile): AppData => ({ profile, observations: [], atlas: [] });
export const loadData = (profile: UserProfile): AppData => {
  if (typeof window === "undefined") return emptyData(profile);
  const raw = localStorage.getItem(key(profile.id));
  return raw ? JSON.parse(raw) as AppData : emptyData(profile);
};
export const saveData = (data: AppData) => localStorage.setItem(key(data.profile.id), JSON.stringify(data));
export const deleteData = (userId: string) => localStorage.removeItem(key(userId));
export const authKey = "mudflat-log:session";
