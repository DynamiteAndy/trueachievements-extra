export default function (source: string) {
  let emojis = JSON.parse(source);

  emojis = emojis.reduce(
    (accumulator: Map<string, Array<unknown>>, emoji: { char: string; name: string; group: string }) => {
      let category = accumulator.get(emoji.group);
      if (!category) {
        category = [];
        accumulator.set(emoji.group, category);
      }

      category.push({ char: emoji.char, name: emoji.name });

      return accumulator;
    },
    new Map([['TrueAchievements', []]])
  );

  const keys = Array.from(emojis.keys());
  const values = Array.from(emojis.values());

  return [...keys, ...values];
}
