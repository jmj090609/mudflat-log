export type Category = "BASE" | "PERSONAL" | "UNIDENTIFIED";
export type IdentificationStatus = "AI_CANDIDATE" | "USER_CONFIRMED" | "REVIEWING" | "CONFIRMED" | "UNIDENTIFIED";
export type ConfidenceLevel = "가능성 높음" | "가능성 보통" | "추가 확인 필요";
export type ResultType = "BASE_SPECIES" | "EXTERNAL_SPECIES" | "UNIDENTIFIED";

export interface FeatureQuestion { id: string; question: string; yesHint: string }
export interface Species {
  id: string; koreanName: string; scientificName: string; group: string; shortDescription: string;
  habitat: string; preferredSubstrate: string; bestObservationTime: string; bestSeason: string;
  appearanceTraits: string; ecologicalRole: string; observationTips: string; caution: string;
  discoveryDifficulty: "쉬움" | "보통" | "도전"; silhouetteImage: string; isSensitiveSpecies: boolean;
  isRareSpecies: boolean; broadObservationAreas: string[]; featureQuestions: FeatureQuestion[];
}
export interface Observation {
  id: string; userId: string; speciesId?: string; temporaryName?: string; category: Category;
  photos: string[]; observedAt: string; approximateLocation: string; habitatType: string; notes: string;
  identificationStatus: IdentificationStatus; identificationSource: string; createdAt: string; updatedAt: string;
  detectedGroup?: string; reason?: string;
}
export interface AtlasEntry { userId: string; speciesId: string; discovered: boolean; representativePhoto?: string; firstObservedAt?: string; lastObservedAt?: string; observationCount: number; }
export interface IdentificationCandidate { speciesId?: string; name: string; group: string; confidenceLevel: ConfidenceLevel; traits: string[]; score?: number }
export interface IdentificationResult { resultType: ResultType; candidates: IdentificationCandidate[]; detectedGroup: string; confidenceLevel: ConfidenceLevel; reason: string; needsAdditionalPhoto: boolean; suggestedQuestions: FeatureQuestion[]; }
export interface UserProfile { id: string; nickname: string; email?: string; isGuest: boolean; joinedAt: string; avatar?: string; }
export interface AppData { profile: UserProfile; observations: Observation[]; atlas: AtlasEntry[]; }
