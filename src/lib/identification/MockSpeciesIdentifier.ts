import { baseSpecies } from "@/src/data/baseSpecies";
import { IdentificationResult } from "@/src/types";
import { SpeciesIdentifier } from "./SpeciesIdentifier";

/**
 * A lightweight, on-device image signature. It is intentionally a visual
 * recommendation helper, not a scientific species-identification model.
 */
async function imageSignature(photo: string): Promise<number> {
  if (typeof Image === "undefined" || typeof document === "undefined") return textSignature(photo);

  try {
    const image = new Image();
    image.src = photo;
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error("이미지를 읽을 수 없습니다."));
    });

    const canvas = document.createElement("canvas");
    canvas.width = 24;
    canvas.height = 24;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) return textSignature(photo);
    context.drawImage(image, 0, 0, canvas.width, canvas.height);

    const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
    let red = 0, green = 0, blue = 0, contrast = 0;
    for (let i = 0; i < pixels.length; i += 4) {
      red += pixels[i];
      green += pixels[i + 1];
      blue += pixels[i + 2];
      contrast += Math.max(pixels[i], pixels[i + 1], pixels[i + 2]) - Math.min(pixels[i], pixels[i + 1], pixels[i + 2]);
    }
    return Math.round(red * 3 + green * 5 + blue * 7 + contrast * 11);
  } catch {
    return textSignature(photo);
  }
}

function textSignature(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += Math.max(1, Math.floor(value.length / 512))) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export class MockSpeciesIdentifier implements SpeciesIdentifier {
  async identify(photos: string[], mode: "base" | "external" | "unidentified" = "base"): Promise<IdentificationResult> {
    if (mode === "unidentified") return { resultType: "UNIDENTIFIED", candidates: [], detectedGroup: "판별 어려움", confidenceLevel: "추가 확인 필요", reason: "사진만으로 정확한 판별이 어렵습니다.", needsAdditionalPhoto: true, suggestedQuestions: [] };
    if (mode === "external") return { resultType: "EXTERNAL_SPECIES", candidates: [{ name: "갯벌 미확인 종", group: "갯벌 생물", confidenceLevel: "가능성 보통", traits: ["기본 도감 밖 생물로 추정", "서식 환경을 함께 확인해 주세요"] }], detectedGroup: "갯벌 생물", confidenceLevel: "가능성 보통", reason: "기본 도감에는 없는 생물로 추정됩니다.", needsAdditionalPhoto: true, suggestedQuestions: [] };

    const signatures = await Promise.all(photos.map(imageSignature));
    const signature = signatures.reduce((sum, value) => (sum + value) >>> 0, 0);
    const primaryIndex = signature % baseSpecies.length;
    const candidateIndexes = [primaryIndex, (primaryIndex + 3) % baseSpecies.length, (primaryIndex + 7) % baseSpecies.length];
    const candidates = candidateIndexes.map((index, rank) => {
      const species = baseSpecies[index];
      return {
        speciesId: species.id,
        name: species.koreanName,
        group: species.group,
        confidenceLevel: rank === 0 ? "가능성 높음" as const : rank === 1 ? "가능성 보통" as const : "추가 확인 필요" as const,
        traits: [species.appearanceTraits, species.habitat],
        score: 3 - rank,
      };
    });
    const primary = baseSpecies[primaryIndex];
    return {
      resultType: "BASE_SPECIES",
      candidates,
      detectedGroup: primary.group,
      confidenceLevel: "가능성 높음",
      reason: "등록한 사진의 색감·명암·형태 분포를 바탕으로 후보를 추천했습니다. 야생 생물의 정확한 종 판별은 특징과 서식 환경을 함께 확인해 주세요.",
      needsAdditionalPhoto: false,
      suggestedQuestions: primary.featureQuestions,
    };
  }
}
