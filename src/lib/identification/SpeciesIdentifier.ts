import { IdentificationResult } from "@/src/types";
export interface SpeciesIdentifier { identify(photos: string[], mode?: "base" | "external" | "unidentified"): Promise<IdentificationResult>; }
