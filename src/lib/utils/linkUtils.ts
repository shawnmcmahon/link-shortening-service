/**
 * Validates if a string is a valid URL
 */
export function isValidUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === "http:" || urlObj.protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * Generates a random short code (6-8 characters, alphanumeric)
 */
export function generateShortCode(length: number = 7): string {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Validates a custom alias format
 * Rules: alphanumeric with hyphens/underscores, 3-20 characters
 */
export function isValidCustomAlias(alias: string): boolean {
  if (alias.length < 3 || alias.length > 20) {
    return false;
  }
  // Only alphanumeric characters, hyphens, and underscores allowed
  const regex = /^[a-zA-Z0-9_-]+$/;
  return regex.test(alias);
}

/**
 * Normalizes a custom alias (converts to lowercase for consistency)
 */
export function normalizeAlias(alias: string): string {
  return alias.toLowerCase().trim();
}
