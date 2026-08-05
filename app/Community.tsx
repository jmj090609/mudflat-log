"use client";

import { FormEvent, useEffect, useState } from "react";
import { CommunityComment, CommunityPost, CommunityProfile, CommunitySession, createCommunityAccount, createCommunityComment, createCommunityPost, getCommunityProfile, listCommunityComments, listCommunityPosts, saveCommunityProfile, signInCommunity } from "@/src/lib/firebase/community";
import { UserProfile } from "@/src/types";

const sessionKey = "mudflat-log:community-session";
const avatars = ["🦀", "🐟", "🐚", "🦆", "🦐"];
const readSession = (): CommunitySession | null => { try { return JSON.parse(localStorage.getItem(sessionKey) ?? "null"); } catch { return null; } };

export default function Community({ localProfile }: { localProfile: UserProfile }) {
  const [session, setSession] = useState<CommunitySession | null>(null);
  const [profile, setProfile] = useState<CommunityProfile | null>(null);
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [selected, setSelected] = useState<CommunityPost | null>(null);
  const [comments, setComments] = useState<CommunityComment[]>([]);
  const [email, setEmail] = useState(localProfile.email ?? "");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState(localProfile.nickname);
  const [avatar, setAvatar] = useState("🦀");
  const [intro, setIntro] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const refreshPosts = async (active = session) => { if (!active) return; setPosts(await listCommunityPosts(active)); };
  useEffect(() => { const existing = readSession(); if (existing) setSession(existing); }, []);
  useEffect(() => { if (!session) return; refreshPosts(); getCommunityProfile(session, session.uid).then(saved => { if (saved) { setProfile(saved); setNickname(saved.nickname); setAvatar(saved.avatar); setIntro(saved.intro); } }).catch(() => setError("커뮤니티 정보를 불러오지 못했습니다.")); }, [session]);
  useEffect(() => { if (!selected || !session) return; listCommunityComments(session, selected.id).then(setComments).catch(() => setError("댓글을 불러오지 못했습니다.")); }, [selected, session]);

  const connect = async (create: boolean) => {
    setError(""); if (!email || password.length < 6) { setError("이메일과 6자 이상 비밀번호를 입력해 주세요."); return; }
    setBusy(true);
    try { const next = create ? await createCommunityAccount(email, password) : await signInCommunity(email, password); localStorage.setItem(sessionKey, JSON.stringify(next)); setSession(next); } catch (err) { setError(err instanceof Error ? err.message.replace("EMAIL_EXISTS", "이미 등록된 이메일입니다. 로그인해 주세요.").replace("INVALID_LOGIN_CREDENTIALS", "이메일 또는 비밀번호가 맞지 않습니다.") : "연결하지 못했습니다."); } finally { setBusy(false); }
  };
  const saveProfile = async () => { if (!session || !nickname.trim()) return; setBusy(true); try { const next = { uid: session.uid, email: session.email, nickname: nickname.trim(), avatar, intro: intro.trim() }; await saveCommunityProfile(session, next); setProfile(next); } catch { setError("프로필을 저장하지 못했습니다."); } finally { setBusy(false); } };
  const publish = async (event: FormEvent) => { event.preventDefault(); if (!session || !profile || !title.trim() || !body.trim()) return; setBusy(true); try { await createCommunityPost(session, { authorId: session.uid, authorName: profile.nickname, authorAvatar: profile.avatar, title: title.trim(), body: body.trim(), createdAt: new Date().toISOString() }); setTitle(""); setBody(""); await refreshPosts(); } catch { setError("게시글을 등록하지 못했습니다."); } finally { setBusy(false); } };
  const addComment = async (event: FormEvent) => { event.preventDefault(); if (!session || !profile || !selected || !comment.trim()) return; setBusy(true); try { await createCommunityComment(session, selected.id, { authorId: session.uid, authorName: profile.nickname, authorAvatar: profile.avatar, body: comment.trim(), createdAt: new Date().toISOString() }); setComment(""); setComments(await listCommunityComments(session, selected.id)); } catch { setError("댓글을 등록하지 못했습니다."); } finally { setBusy(false); } };

  if (!session) return <section className="screen community"><p className="eyebrow">FREE COMMUNITY</p><h1>갯벌 생물<br />함께 알아보기</h1><p className="muted">커뮤니티는 Firebase 계정으로 안전하게 운영됩니다. 기존 도감 계정과 같은 이메일을 사용해도 됩니다.</p><label>이메일<input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="example@email.com" /></label><label>커뮤니티 비밀번호<input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="6자 이상" /></label>{error && <p className="error">{error}</p>}<button className="primary" disabled={busy} onClick={() => connect(false)}>커뮤니티 로그인</button><button className="secondary" disabled={busy} onClick={() => connect(true)}>커뮤니티 계정 만들기</button><p className="muted">사진 첨부는 Firebase 무료 정책상 현재 지원하지 않습니다. 미확인 생물의 특징과 관찰 내용을 글로 올려 주세요.</p></section>;

  return <section className="screen community"><p className="eyebrow">FREE COMMUNITY</p><h1>갯벌 생물<br />함께 알아보기</h1>{error && <p className="error">{error}</p>}<section className="card community-profile"><div className="profile-head"><span>{avatar}</span><div><b>{profile?.nickname || nickname || "프로필 설정 필요"}</b><small>{profile?.intro || "나의 갯벌 탐방 정보를 소개해 보세요."}</small></div></div><label>닉네임<input value={nickname} onChange={e => setNickname(e.target.value)} /></label><label>소개<input value={intro} onChange={e => setIntro(e.target.value)} placeholder="예: 부산 갯벌을 관찰하고 있어요" /></label><div className="avatar-picker">{avatars.map(item => <button type="button" className={avatar === item ? "active" : ""} onClick={() => setAvatar(item)} key={item}>{item}</button>)}</div><button className="secondary" disabled={busy} onClick={saveProfile}>프로필 저장</button></section>{profile && <form className="card community-form" onSubmit={publish}><h2>미확인 생물 질문 올리기</h2><label>제목<input value={title} onChange={e => setTitle(e.target.value)} placeholder="예: 이 조류의 이름을 알고 싶어요" /></label><label>관찰 내용<textarea value={body} onChange={e => setBody(e.target.value)} placeholder="보인 특징, 관찰한 넓은 지역, 시간 등을 적어 주세요." /></label><button className="primary" disabled={busy}>게시하기</button></form>}<div className="section-heading"><h2>커뮤니티 글</h2><button onClick={() => refreshPosts()}>새로고침</button></div>{posts.length ? <div className="cards">{posts.map(post => <button className="community-post" onClick={() => setSelected(post)} key={post.id}><span className="post-author">{post.authorAvatar} {post.authorName}</span><b>{post.title}</b><small>{post.body}</small></button>)}</div> : <div className="empty"><p>아직 게시글이 없습니다. 첫 질문을 올려 보세요.</p></div>}{selected && <div className="community-modal" role="dialog" aria-modal="true" onClick={() => setSelected(null)}><article className="card" onClick={event => event.stopPropagation()}><button className="back" onClick={() => setSelected(null)}>← 목록으로</button><p className="post-author">{selected.authorAvatar} {selected.authorName}</p><h2>{selected.title}</h2><p>{selected.body}</p><h2>댓글</h2>{comments.map(item => <div className="community-comment" key={item.id}><b>{item.authorAvatar} {item.authorName}</b><p>{item.body}</p></div>)}<form onSubmit={addComment}><label>댓글<input value={comment} onChange={e => setComment(e.target.value)} placeholder="서로 존중하는 말로 의견을 남겨 주세요." /></label><button className="primary" disabled={busy}>댓글 등록</button></form></article></div>}</section>;
}
