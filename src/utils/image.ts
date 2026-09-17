const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5005";

export function formatImageUrl(imgUrl?: string): string {
  if (!imgUrl || typeof imgUrl !== "string") return "";
  let trimmed = imgUrl.trim();
  if (!trimmed) return "";

  // Data URLs (base64) and blob URLs don't need transformation
  if (trimmed.startsWith("data:") || trimmed.startsWith("blob:")) {
    return trimmed;
  }

  // 1. Google Drive file view links to direct image source
  const gdriveFileMatch = trimmed.match(/drive\.google\.com\/file\/d\/([^\/&#?]+)/);
  const gdriveIdMatch = trimmed.match(/drive\.google\.com\/(?:open|uc)\?.*id=([^\/&#?]+)/);
  const gdriveId = gdriveFileMatch ? gdriveFileMatch[1] : gdriveIdMatch ? gdriveIdMatch[1] : null;

  if (gdriveId) {
    return `https://lh3.googleusercontent.com/d/${gdriveId}`;
  }

  // 2. Dropbox share link conversion
  if (trimmed.includes("dropbox.com")) {
    if (trimmed.includes("dl=0")) {
      trimmed = trimmed.replace("dl=0", "raw=1");
    } else if (!trimmed.includes("raw=1")) {
      trimmed += (trimmed.includes("?") ? "&" : "?") + "raw=1";
    }
  }

  // 3. Convert backslashes to forward slashes
  trimmed = trimmed.replace(/\\/g, "/");

  // 4. Fix port 5000 -> 5005 conflict on macOS AirTunes
  trimmed = trimmed.replace("localhost:5000", "localhost:5005");

  // 5. Proxy /api/media/ URLs via same-origin Next.js rewrite
  if (trimmed.includes("/api/media/")) {
    const mediaIdx = trimmed.indexOf("/api/media/");
    return trimmed.substring(mediaIdx);
  }

  // 6. Handle relative URLs by prepending API_BASE_URL
  if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
    if (!trimmed.startsWith("/")) {
      trimmed = `/${trimmed}`;
    }
    trimmed = `${API_BASE_URL}${trimmed}`;
  }

  try {
    return encodeURI(decodeURI(trimmed));
  } catch {
    return trimmed;
  }
}
