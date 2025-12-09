/**
 * タグ名をスラッグ形式に変換
 * 例: "Next.js" -> "nextjs", "Type Script" -> "typescript"
 */
export function slugifyTagName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
}
