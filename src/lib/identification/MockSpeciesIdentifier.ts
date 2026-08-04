import { baseSpecies } from "@/src/data/baseSpecies";
import { IdentificationResult } from "@/src/types";
import { SpeciesIdentifier } from "./SpeciesIdentifier";

export class MockSpeciesIdentifier implements SpeciesIdentifier {
  async identify(_photos: string[], mode: "base" | "external" | "unidentified" = "base"): Promise<IdentificationResult> {
    if (mode === "unidentified") return { resultType: "UNIDENTIFIED", candidates: [], detectedGroup: "판별 어려움", confidenceLevel: "추가 확인 필요", reason: "사진만으로 정확한 판별이 어렵습니다.", needsAdditionalPhoto: true, suggestedQuestions: [] };
    if (mode === "external") return { resultType: "EXTERNAL_SPECIES", candidates: [{ name: "게류 미확인 종", group: "게류", confidenceLevel: "가능성 보통", traits: ["기본 도감 밖 생물로 추정", "서식 환경을 함께 확인해 주세요."] }], detectedGroup: "게류", confidenceLevel: "가능성 보통", reason: "기본 도감에는 없는 생물로 추정됩니다.", needsAdditionalPhoto: true, suggestedQuestions: [] };
    const candidates = baseSpecies.slice(2, 5).map((species, index) => ({ speciesId: species.id, name: species.koreanName, group: species.group, confidenceLevel: index === 0 ? "가능성 높음" as const : index === 1 ? "가능성 보통" as const : "추가 확인 필요" as const, traits: [species.appearanceTraits, species.habitat], score: 3 - index }));
    return { resultType: "BASE_SPECIES", candidates, detectedGroup: candidates[0].group, confidenceLevel: "가능성 높음", reason: "이 생물로 추정됩니다. 특징을 확인한 뒤 직접 등록해 주세요.", needsAdditionalPhoto: false, suggestedQuestions: baseSpecies[2].featureQuestions };
  }
}
