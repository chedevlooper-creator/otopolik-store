"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import {
  AlertCircleIcon,
  CheckCircle2Icon,
  LoaderIcon,
  SendIcon,
  SparklesIcon,
} from "lucide-react";

import { api } from "../../../../convex/_generated/api";
import type {
  Doc,
  Id,
} from "../../../../convex/_generated/dataModel";
import { useAdminConvexKey } from "@/hooks/useAdminConvexKey";
import { isConvexConfiguredClient } from "@/lib/convex-client";
import type { ContentGenerationKind } from "@/lib/ai/content-prompt";
import { publishContentGenerationAction } from "./actions";

const inputClass =
  "mt-1.5 w-full border border-border bg-background px-4 py-2.5 text-sm font-normal text-foreground focus:border-white focus:outline-none focus:ring-2 focus:ring-brand-red/15";

const KIND_OPTIONS: {
  value: ContentGenerationKind;
  label: string;
}[] = [
  { value: "product_description", label: "Ürün açıklaması" },
  { value: "product_seo", label: "Ürün SEO başlığı ve meta" },
  { value: "faq", label: "Sık sorulan soru" },
];

const STATUS_LABELS: Record<Doc<"contentGenerations">["status"], string> = {
  pending: "Bekliyor",
  ready: "İncelemeye hazır",
  approved: "Yayımlandı",
  rejected: "Reddedildi",
  failed: "Başarısız",
};

type ProductOption = {
  slug: string;
  name: string;
};

type PanelMessage = {
  type: "success" | "error";
  text: string;
};

export default function ContentGeneratorPanel({
  aiAvailable,
  products,
}: {
  aiAvailable: boolean;
  products: ProductOption[];
}) {
  const convexReady = isConvexConfiguredClient();
  const adminKeyState = useAdminConvexKey();
  const adminKey =
    adminKeyState.status === "ready" ? adminKeyState.adminKey : null;
  const generations = useQuery(
    api.contentGenerations.listRecent,
    convexReady && adminKey ? { adminKey, limit: 50 } : "skip"
  ) as Doc<"contentGenerations">[] | undefined;
  const upsertDraft = useMutation(api.contentGenerations.upsertDraft);

  const [kind, setKind] =
    useState<ContentGenerationKind>("product_description");
  const [targetSlug, setTargetSlug] = useState(products[0]?.slug ?? "");
  const [prompt, setPrompt] = useState("");
  const [draft, setDraft] = useState("");
  const [selectedId, setSelectedId] =
    useState<Id<"contentGenerations"> | null>(null);
  const [selectedStatus, setSelectedStatus] =
    useState<Doc<"contentGenerations">["status"] | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [message, setMessage] = useState<PanelMessage | null>(null);

  function selectGeneration(generation: Doc<"contentGenerations">) {
    setSelectedId(generation._id);
    setSelectedStatus(generation.status);
    setKind(generation.kind);
    setTargetSlug(generation.targetSlug);
    setPrompt(generation.prompt);
    setDraft(generation.draft ?? "");
    setMessage(null);
  }

  async function generateDraft() {
    if (!aiAvailable || !targetSlug || isGenerating) return;
    setMessage(null);
    setIsGenerating(true);
    try {
      const response = await fetch("/api/admin/ai/content", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind, targetSlug, prompt }),
      });
      const body = (await response.json().catch(() => null)) as {
        error?: string;
        generationId?: Id<"contentGenerations">;
        draft?: string;
        status?: "ready";
      } | null;
      if (!response.ok || !body?.generationId || !body.draft) {
        setMessage({
          type: "error",
          text:
            body?.error ??
            (response.status === 401
              ? "Oturumunuz sona erdi. Yeniden giriş yapın."
              : response.status === 429
                ? "İstek sınırına ulaşıldı. Kısa süre sonra tekrar deneyin."
                : response.status === 503
                  ? "AI veya taslak servisi şu anda kapalı."
                  : "Taslak üretilemedi."),
        });
        return;
      }
      setSelectedId(body.generationId);
      setSelectedStatus("ready");
      setDraft(body.draft);
      setMessage({
        type: "success",
        text: "Taslak üretildi. Yayımlamadan önce metni inceleyin.",
      });
    } catch {
      setMessage({
        type: "error",
        text: "AI servisine bağlanırken ağ hatası oluştu.",
      });
    } finally {
      setIsGenerating(false);
    }
  }

  async function publishDraft() {
    if (
      !adminKey ||
      !selectedId ||
      selectedStatus !== "ready" ||
      !draft.trim() ||
      isPublishing
    ) {
      return;
    }
    setMessage(null);
    setIsPublishing(true);
    try {
      await upsertDraft({
        adminKey,
        id: selectedId,
        kind,
        targetSlug,
        prompt,
        draft: draft.trim(),
        status: "ready",
      });
      const result = await publishContentGenerationAction({
        generationId: selectedId,
      });
      if (!result.ok) {
        setMessage({ type: "error", text: result.message });
        return;
      }
      setSelectedStatus("approved");
      setMessage({
        type: "success",
        text: "İncelenen taslak canlı içeriğe yayımlandı.",
      });
    } catch {
      setMessage({
        type: "error",
        text: "Taslak kaydedilemedi veya yayımlanamadı.",
      });
    } finally {
      setIsPublishing(false);
    }
  }

  if (!aiAvailable) {
    return (
      <div className="border border-border bg-surface p-6">
        <p className="text-sm font-semibold text-white">
          AI içerik üreticisi kullanılamıyor.
        </p>
        <p className="mt-2 text-sm text-muted">
          AI anahtarı, özellik anahtarı veya Convex bağlantısı kapalı. Diğer
          sekmelerdeki manuel içerik araçlarını kullanmaya devam edebilirsiniz.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
      <section className="space-y-5 border border-border bg-surface p-6">
        <div>
          <h2 className="font-heading text-lg font-bold text-white">
            AI içerik taslağı
          </h2>
          <p className="mt-1 text-sm text-muted">
            Oluşturma yalnızca taslak kaydeder. Canlı içerik, ayrı Yayımla
            işlemi onaylanana kadar değişmez.
          </p>
        </div>

        {adminKeyState.status === "error" ? (
          <p role="alert" className="text-sm text-brand-red">
            {adminKeyState.message}
          </p>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-semibold">
            İçerik türü
            <select
              value={kind}
              onChange={(event) =>
                setKind(event.target.value as ContentGenerationKind)
              }
              className={inputClass}
            >
              {KIND_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm font-semibold">
            Kaynak ürün
            <select
              value={targetSlug}
              onChange={(event) => setTargetSlug(event.target.value)}
              className={inputClass}
            >
              {products.map((product) => (
                <option key={product.slug} value={product.slug}>
                  {product.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="block text-sm font-semibold">
          Ek yönlendirme (isteğe bağlı)
          <textarea
            rows={3}
            maxLength={1_000}
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            className={inputClass}
            placeholder="Örn. Temizleme kolaylığını öne çıkar."
          />
        </label>

        <button
          type="button"
          disabled={
            !targetSlug ||
            !adminKey ||
            isGenerating ||
            products.length === 0
          }
          onClick={() => void generateDraft()}
          className="inline-flex items-center gap-2 bg-brand-red px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-brand-red-dark disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isGenerating ? (
            <LoaderIcon className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <SparklesIcon className="h-4 w-4" aria-hidden="true" />
          )}
          AI ile taslak oluştur
        </button>

        <label className="block text-sm font-semibold">
          İncelenecek taslak
          <textarea
            rows={14}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            className={inputClass}
            placeholder="Üretilen veya listeden seçilen taslak burada görünür."
          />
        </label>

        {message ? (
          <p
            role={message.type === "error" ? "alert" : "status"}
            className={`flex items-center gap-2 text-sm ${
              message.type === "error" ? "text-brand-red" : "text-green-400"
            }`}
          >
            {message.type === "error" ? (
              <AlertCircleIcon className="h-4 w-4" aria-hidden="true" />
            ) : (
              <CheckCircle2Icon className="h-4 w-4" aria-hidden="true" />
            )}
            {message.text}
          </p>
        ) : null}

        <button
          type="button"
          disabled={
            !selectedId ||
            selectedStatus !== "ready" ||
            !draft.trim() ||
            !adminKey ||
            isPublishing
          }
          onClick={() => void publishDraft()}
          className="inline-flex items-center gap-2 border border-border bg-background px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:border-white/40 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPublishing ? (
            <LoaderIcon className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <SendIcon className="h-4 w-4" aria-hidden="true" />
          )}
          İncelenen taslağı yayımla
        </button>
      </section>

      <aside className="border border-border bg-surface p-5">
        <h2 className="font-heading text-base font-bold text-white">
          Son taslaklar
        </h2>
        <p className="mt-1 text-xs text-muted">
          Bir taslağı incelemek için seçin.
        </p>
        <div className="mt-4 space-y-2">
          {!convexReady ? (
            <p className="text-sm text-muted">Convex bağlantısı kapalı.</p>
          ) : generations === undefined ? (
            <p className="inline-flex items-center gap-2 text-sm text-muted">
              <LoaderIcon className="h-4 w-4 animate-spin" aria-hidden="true" />
              Taslaklar yükleniyor
            </p>
          ) : generations.length === 0 ? (
            <p className="text-sm text-muted">
              Henüz taslak yok. İlk taslağı oluşturun.
            </p>
          ) : (
            generations.map((generation) => (
              <button
                key={generation._id}
                type="button"
                onClick={() => selectGeneration(generation)}
                className={`w-full border p-3 text-left ${
                  selectedId === generation._id
                    ? "border-brand-red bg-brand-red/5"
                    : "border-border bg-background hover:border-white/30"
                }`}
              >
                <span className="block truncate text-sm font-semibold text-white">
                  {generation.targetSlug}
                </span>
                <span className="mt-1 flex items-center justify-between gap-2 text-[11px] text-muted">
                  <span>
                    {KIND_OPTIONS.find(
                      (option) => option.value === generation.kind
                    )?.label ?? generation.kind}
                  </span>
                  <span>{STATUS_LABELS[generation.status]}</span>
                </span>
              </button>
            ))
          )}
        </div>
      </aside>
    </div>
  );
}
