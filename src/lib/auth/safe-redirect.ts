/**
 * Only allow same-origin relative paths (e.g. `/admin`, `/publications/…`)
 * as post-auth redirect targets. Blocks `//evil.com`, `javascript:` and
 * friends.
 */
export function safeRedirect(value: string | undefined): string | undefined {
  if (!value) return undefined;
  if (!value.startsWith("/")) return undefined;
  if (value.startsWith("//")) return undefined;
  if (/[\\\n\r]/.test(value)) return undefined;
  return value;
}
