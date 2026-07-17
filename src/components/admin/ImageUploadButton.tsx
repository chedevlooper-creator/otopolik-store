"use client";

import { useRef, useState } from "react";
import { useMutation } from "convex/react";
import { LoaderIcon, UploadIcon } from "lucide-react";
import { api } from "../../../convex/_generated/api";
import { useAdminConvexKey } from "@/hooks/useAdminConvexKey";
import { isConvexConfiguredClient } from "@/lib/convex-client";

const MAX_BYTES = 4 * 1024 * 1024;
const ACCEPT = "image/jpeg,image/png,image/webp,image/gif";

type Props = {
  onUploaded: (url: string) => void;
  label?: string;
};

export default function ImageUploadButton({
  onUploaded,
  label = "Dosya yükle",
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const getUrl = useMutation(api.files.getUrl);
  const adminKeyState = useAdminConvexKey();
  const convexReady = isConvexConfiguredClient();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setError(null);
    if (!convexReady) {
      setError("Convex bağlı değil; dosya yüklenemez.");
      return;
    }
    if (adminKeyState.status !== "ready") {
      setError(
        adminKeyState.status === "error"
          ? adminKeyState.message
          : "Admin yetkisi yükleniyor…"
      );
      return;
    }
    if (!ACCEPT.split(",").includes(file.type)) {
      setError("Sadece JPG, PNG, WebP veya GIF yükleyin.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("Dosya en fazla 4 MB olabilir.");
      return;
    }

    setUploading(true);
    try {
      const uploadUrl = await generateUploadUrl({
        adminKey: adminKeyState.adminKey,
      });
      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      if (!result.ok) {
        throw new Error("Yükleme başarısız");
      }
      const { storageId } = (await result.json()) as { storageId: string };
      const url = await getUrl({
        adminKey: adminKeyState.adminKey,
        storageId: storageId as never,
      });
      if (!url) {
        throw new Error("Dosya URL'si alınamadı");
      }
      onUploaded(url);
    } catch (err) {
      console.error("Image upload error:", err);
      setError(
        err instanceof Error ? err.message : "Yükleme sırasında hata oluştu."
      );
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="mt-2">
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void handleFile(file);
        }}
      />
      <button
        type="button"
        disabled={uploading || !convexReady}
        onClick={() => inputRef.current?.click()}
        className="inline-flex items-center gap-1.5 border border-border bg-background px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-foreground transition-colors hover:border-white hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        {uploading ? (
          <LoaderIcon className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
        ) : (
          <UploadIcon className="h-3.5 w-3.5" aria-hidden="true" />
        )}
        {uploading ? "Yükleniyor…" : label}
      </button>
      {error ? (
        <p className="mt-1 text-xs font-semibold text-brand-red">{error}</p>
      ) : (
        <p className="mt-1 text-[11px] text-muted">
          JPG/PNG/WebP · max 4 MB · veya aşağıya URL yapıştırın
        </p>
      )}
    </div>
  );
}
