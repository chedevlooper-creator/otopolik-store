/**
 * Returns a base64 encoded SVG data URL representing a dark luxury shimmer animation placeholder.
 */
export function shimmer(w: number, h: number): string {
  const svg = `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#0f1012" offset="20%" />
      <stop stop-color="#1e2024" offset="50%" />
      <stop stop-color="#0f1012" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#0f1012" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1.5s" repeatCount="indefinite" />
</svg>`;

  // Convert to base64 encoding safe for Next.js image placeholder use
  const toBase64 = (str: string) =>
    typeof window === "undefined"
      ? Buffer.from(str).toString("base64")
      : window.btoa(str);

  return `data:image/svg+xml;base64,${toBase64(svg)}`;
}
