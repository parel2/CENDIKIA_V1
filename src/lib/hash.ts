export async function hashPassword(password: string): Promise<string> {
  const enc = new TextEncoder().encode('les-arsani:' + password);
  const buf = await crypto.subtle.digest('SHA-256', enc);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export function slugifyName(nama: string): string {
  return nama.trim().toLowerCase().replace(/\s+/g, '-');
}
