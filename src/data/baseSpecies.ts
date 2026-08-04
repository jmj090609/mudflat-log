import { Species } from "@/src/types";

const makeSpecies = (index: number): Species => ({
  // 실제 종 목록 확정 후 교체
  id: `base-${String(index).padStart(2, "0")}`,
  koreanName: `기본 생물 ${String(index).padStart(2, "0")}`,
  scientificName: "Species placeholder",
  group: index % 3 === 0 ? "게류" : index % 3 === 1 ? "패류" : "저서생물",
  shortDescription: "실제 탐방 종이 확정되면 바꿀 수 있는 임시 기본 생물입니다.",
  habitat: index % 2 ? "펄과 모래가 섞인 갯벌" : "바위와 물웅덩이 주변",
  preferredSubstrate: index % 2 ? "펄갯벌" : "모래갯벌",
  bestObservationTime: "썰물 전후, 조용히 기다릴 때",
  bestSeason: "봄~가을",
  appearanceTraits: "몸의 형태, 무늬, 움직임과 주변 환경을 함께 관찰해 주세요.",
  ecologicalRole: "갯벌 먹이그물과 유기물 순환에 관여할 가능성이 있습니다.",
  observationTips: "멀리서 사진으로 관찰하고, 전체 모습과 특징 부위를 함께 기록해 주세요.",
  caution: "생물을 만지거나 이동시키지 말고, 원래 서식 환경을 훼손하지 않은 상태에서 사진으로만 관찰해 주세요.",
  discoveryDifficulty: index % 3 === 0 ? "도전" : index % 3 === 1 ? "보통" : "쉬움",
  silhouetteImage: "◌",
  isSensitiveSpecies: index === 15,
  broadObservationAreas: ["부산 연안의 넓은 갯벌 구역", "갯골 또는 물웅덩이 주변"],
  featureQuestions: [
    { id: "shape", question: "사진에서 몸의 윤곽이 뚜렷하게 보이나요?", yesHint: "전체 모습이 보이면 비교에 도움이 됩니다." },
    { id: "habitat", question: "진흙 또는 모래 위에서 관찰했나요?", yesHint: "서식 환경은 후보 비교에 도움이 됩니다." },
  ],
});

// 실제 종 목록이 확정되면 이 파일의 데이터만 교체하면 전체 도감에 반영됩니다.
export const baseSpecies: Species[] = Array.from({ length: 10 }, (_, index) => makeSpecies(index + 1));
