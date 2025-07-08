export default function (source: string) {
  const rawEmojis = JSON.parse(source);
  const grouped: Record<string, { char: string; name: string }[]> = {
    TrueAchievements: [],
  };

  for (const { char, name, group } of rawEmojis) {
    (grouped[group] ??= []).push({ char, name });
  }

  return Object.entries(grouped).map(([group, emojis]) => ({
    group,
    emojis,
  }));
}