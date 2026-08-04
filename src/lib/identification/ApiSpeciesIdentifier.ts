import { SpeciesIdentifier } from "./SpeciesIdentifier";
import { IdentificationResult } from "@/src/types";
export class ApiSpeciesIdentifier implements SpeciesIdentifier {
  async identify(_photos: string[]): Promise<IdentificationResult> { throw new Error("실제 AI API 연결 전입니다. MockSpeciesIdentifier를 사용해 주세요."); }
}
