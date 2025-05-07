export function createTemplate(data: { key: string; content: string }) {
  return `Kalit so'z: <b>${data.key}</b>\n\nTekst : <b>${data.content}</b>`;
}
export function KeyWordTemplate(text: string) {
  return `Kalit so'z: <b>${text}</b>`;
}
export function replyDeletingDataTemplate(text: string, content: string) {
  return `Kalit so'z: ${text}\n\nTekst: ${content}`;
}
export function afterDeletionTemplate() {
  return `O'chirish muvaffaqiyatli amalga oshdi!\n\nMa'lumot qo'shish uchun : /add\n\nMa'lumot o'chirish uchun : /delete\n\n Yordam olish uchun : /help`;
}
