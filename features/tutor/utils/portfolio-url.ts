const GOOGLE_DRIVE_HOSTS = new Set(["drive.google.com", "docs.google.com"]);

function extractGoogleDriveFileId(url: URL): string | null {
  if (!GOOGLE_DRIVE_HOSTS.has(url.hostname)) return null;

  const filePathMatch = url.pathname.match(/^\/file\/d\/([^/]+)/);
  return filePathMatch?.[1] ?? url.searchParams.get("id");
}

export function normalizePortfolioImageUrl(rawUrl: string): string {
  const url = new URL(rawUrl.trim());

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("Unsupported protocol");
  }

  const googleDriveFileId = extractGoogleDriveFileId(url);
  if (!googleDriveFileId) return url.toString();

  const normalizedUrl = new URL("https://drive.google.com/thumbnail");
  normalizedUrl.searchParams.set("id", googleDriveFileId);
  normalizedUrl.searchParams.set("sz", "w1600");

  return normalizedUrl.toString();
}
