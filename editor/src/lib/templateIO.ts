import { cardPromoSchema, type CardPromoProps } from "@composition/schema";

export function saveTemplate(props: CardPromoProps, name: string) {
  const json = JSON.stringify(props, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${name}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export async function loadTemplate(file: File): Promise<CardPromoProps> {
  const text = await file.text();
  const parsed = JSON.parse(text);
  const result = cardPromoSchema.safeParse(parsed);
  if (!result.success) {
    throw new Error(`Invalid template: ${result.error.message}`);
  }
  return result.data;
}
