"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { AppData, Species } from "@/src/types";
import { getCatalogOverride } from "@/src/lib/firebase/catalog";

type Props = {
  species: Species;
  data: AppData;
  pendingPhotos: string[];
  onBack: () => void;
  onDiscover: () => void;
  onChoosePhotos: (event: ChangeEvent<HTMLInputElement>, note: string) => Promise<void>;
  onAddPhotos: (event: ChangeEvent<HTMLInputElement>, note: string) => Promise<void>;
  onRepresentative: (photo: string) => void;
  onDeletePhoto: (photo: string) => void;
};

export default function SpeciesDetailWithNotes({ species, data, pendingPhotos, onBack, onDiscover, onChoosePhotos, onAddPhotos, onRepresentative, onDeletePhoto }: Props) {
  const [note, setNote] = useState("");
  const [adminDescription, setAdminDescription] = useState("");
  const entry = data.atlas.find(item => item.speciesId === species.id);
  const observations = data.observations.filter(item => item.speciesId === species.id);
  const photos = [...new Set(observations.flatMap(item => item.photos))];
  const notes = [...new Set(observations.map(item => item.notes.trim()).filter(Boolean))];
  const inputId = `observation-photo-${species.id}`;
  useEffect(() => { getCatalogOverride(species.id).then(override => setAdminDescription(override?.description ?? "")); }, [species.id]);
  const addPhoto = async (event: ChangeEvent<HTMLInputElement>) => {
    if (entry) await onAddPhotos(event, note);
    else await onChoosePhotos(event, note);
    setNote("");
  };

  return <section className="screen detail observation-detail">
    <button className="back" onClick={onBack}>← 기본 도감으로</button>
    <div className="detail-image">{entry?.representativePhoto ? <img src={entry.representativePhoto} alt={`${species.koreanName} 대표 사진`} /> : pendingPhotos[0] ? <img src={pendingPhotos[0]} alt={`${species.koreanName} 선택 사진`} /> : <span className="silhouette large">◌</span>}</div>
    <span className="badge">{species.group} · {species.discoveryDifficulty}</span><h1>{species.koreanName}</h1><i>{species.scientificName}</i>
    <details open><summary>특징</summary><p>{adminDescription || species.appearanceTraits}</p><p><b>서식 환경:</b> {species.habitat}</p></details>
    <section className="photo-manager"><div className="section-heading"><h2>사진 관리</h2><span>{photos.length}장</span></div>
      <label className="observation-note-field">이번 관찰 메모<textarea value={note} onChange={event => setNote(event.target.value)} placeholder="사진을 찍은 날의 특징, 크기, 움직임, 날씨 등을 남겨 주세요." /></label>
      <input className="species-photo-input" id={inputId} type="file" accept="image/*" multiple onChange={addPhoto} />
      <label className="secondary photo-upload-button" htmlFor={inputId}>▣ 사진 선택하고 메모와 함께 저장하기</label>
      {!entry && pendingPhotos.length > 0 && <><div className="photo-preview">{pendingPhotos.map((photo, index) => <img key={`${photo.slice(-16)}-${index}`} src={photo} alt={`선택한 사진 ${index + 1}`} />)}</div><button className="primary" onClick={onDiscover}>도감에 추가하기</button></>}
      {photos.length > 0 && <div className="photo-strip">{photos.map((photo, index) => <div className={`photo-item ${entry?.representativePhoto === photo ? "representative" : ""}`} key={`${photo.slice(-16)}-${index}`}><button className="photo-choice" onClick={() => onRepresentative(photo)}><img src={photo} alt={`${species.koreanName} 사진 ${index + 1}`} /><small>{entry?.representativePhoto === photo ? "대표 사진" : "대표로 변경"}</small></button><button className="photo-delete" onClick={() => onDeletePhoto(photo)} aria-label={`사진 ${index + 1} 삭제`}>×</button></div>)}</div>}
    </section>
    {entry && <section className="observation-notes"><div className="section-heading"><h2>저장한 관찰 메모</h2></div>{notes.length ? notes.map((item, index) => <p className="card" key={`${item.slice(0, 20)}-${index}`}>{item}</p>) : <p className="muted">아직 저장한 관찰 메모가 없어요. 사진을 추가할 때 남겨 보세요.</p>}</section>}
  </section>;
}
