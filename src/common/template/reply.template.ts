export function createTemplate(data: { key: string; content: string }) {
  return `Kalit so'z: <b>${data.key}</b>\n\nTekst : <b>${data.content}</b>`;
}
export function KeyWordTemplate(text: string) {
  return `Kalit so'z: ${text}`;
}
