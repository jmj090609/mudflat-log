export async function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result)); reader.onerror = reject; reader.readAsDataURL(file); });
}
export function imageWarnings(files: File[]): string[] { if (!files.length) return ["사진을 한 장 이상 등록해 주세요."]; return files.flatMap(file => { const issues: string[] = []; if (!file.type.startsWith("image/")) issues.push("올바른 이미지 파일을 선택해 주세요."); if (file.size < 15_000) issues.push("생물이 더 크게 보이도록 다시 촬영해 주세요."); return issues; }); }
