// A cookie the site set, by name
export const getCookie = (name: string): string | null =>
  document.cookie
    .split('; ')
    .find((cookie) => cookie.startsWith(`${name}=`))
    ?.slice(name.length + 1) ?? null;

// The signed-in gamer's id, or null signed out: GamerID is the cookie the site's own scripts check for a signed-in
// gamer
export const signedInGamerId = (): string | null => getCookie('GamerID');
