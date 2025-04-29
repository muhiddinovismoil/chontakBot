export function keyboardBuilder(data: any) {
  return data.map((item: any) => [
    {
      text: item.key,
      callback_data: `delete_${item.id}`,
    },
  ]);
}
