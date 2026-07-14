import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0b0c0e",
          color: "#e31937",
          fontSize: 72,
          fontWeight: 800,
          letterSpacing: -2,
          borderRadius: 36,
        }}
      >
        OP
      </div>
    ),
    { ...size }
  );
}
