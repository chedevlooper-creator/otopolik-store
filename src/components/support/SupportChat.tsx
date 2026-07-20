"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useChat } from "@ai-sdk/react";
import {
  DefaultChatTransport,
  lastAssistantMessageIsCompleteWithToolCalls,
} from "ai";
import {
  BotIcon,
  MessageCircleIcon,
  RotateCcwIcon,
  SendIcon,
  ShieldCheckIcon,
  SquareIcon,
} from "lucide-react";

import {
  buildWhatsAppLink,
  useStoreSettings,
} from "@/context/settings-context";
import type { SupportChatMessage } from "@/lib/ai/support-tools";

function getTurkishStreamError(error: Error): string {
  if (/429|rate.?limit|cok_fazla_istek/i.test(error.message)) {
    return "Çok fazla istek gönderildi. Kısa bir süre sonra yeniden deneyin.";
  }
  if (/503|ai_unavailable/i.test(error.message)) {
    return "AI Asistan şu anda kullanılamıyor. SSS ve WhatsApp desteğinden devam edebilirsiniz.";
  }
  return "Bağlantı kesildi. Eksik yanıt kaldırıldı; güvenle yeniden deneyebilirsiniz.";
}

export default function SupportChat() {
  const settings = useStoreSettings();
  const [input, setInput] = useState("");
  const [streamError, setStreamError] = useState<string | null>(null);
  const [handoffDraft, setHandoffDraft] = useState<string | null>(null);
  const [sessionId] = useState(() =>
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `support-${Date.now()}`
  );
  const transport = useMemo(
    () =>
      new DefaultChatTransport<SupportChatMessage>({
        api: "/api/ai/support",
        headers: { "x-ai-session": sessionId },
      }),
    [sessionId]
  );

  const {
    messages,
    sendMessage,
    addToolOutput,
    status,
    error,
    stop,
    setMessages,
    clearError,
  } = useChat<SupportChatMessage>({
    transport,
    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
    onError: (chatError) => {
      setStreamError(getTurkishStreamError(chatError));
    },
    onFinish: ({ isAbort, isDisconnect, isError }) => {
      if (!isAbort && !isDisconnect && !isError) return;
      setMessages((current) => {
        const last = current.at(-1);
        return last?.role === "assistant" ? current.slice(0, -1) : current;
      });
      setStreamError(
        isAbort
          ? "Yanıt durduruldu. İsterseniz yeniden deneyebilirsiniz."
          : "Bağlantı kesildi. Eksik yanıt kaldırıldı; yeniden deneyebilirsiniz."
      );
    },
    onToolCall: async ({ toolCall }) => {
      if (toolCall.dynamic) return;
      if (toolCall.toolName !== "prepare_whatsapp_handoff") return;

      setHandoffDraft(toolCall.input.message);
      addToolOutput({
        tool: "prepare_whatsapp_handoff",
        toolCallId: toolCall.toolCallId,
        output: {
          prepared: true,
          message: toolCall.input.message,
        },
      });
    },
  });

  const orderDraft = messages
    .flatMap((message) => message.parts)
    .filter(
      (part) =>
        part.type === "tool-draft_order_summary" &&
        part.state === "output-available"
    )
    .at(-1)?.output.draft;
  const whatsAppDraft = orderDraft ?? handoffDraft;
  const isStreaming = status === "submitted" || status === "streaming";
  const visibleError = streamError ?? (error ? getTurkishStreamError(error) : null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const message = input.trim();
    if (!message || isStreaming) return;
    setInput("");
    setStreamError(null);
    clearError();
    await sendMessage({ text: message });
  }

  async function handleStop() {
    await stop();
    setMessages((current) => {
      const last = current.at(-1);
      return last?.role === "assistant" ? current.slice(0, -1) : current;
    });
    setStreamError(
      "Yanıt durduruldu. Eksik yanıt kaldırıldı; yeniden deneyebilirsiniz."
    );
  }

  async function handleRetry() {
    setStreamError(null);
    clearError();
    await sendMessage();
  }

  return (
    <section
      aria-labelledby="support-chat-title"
      className="surface-glass mac-glass overflow-hidden rounded-2xl border border-border bg-surface"
    >
      <header className="flex flex-col gap-4 border-b border-border p-5 sm:flex-row sm:items-start sm:justify-between sm:p-7">
        <div className="flex items-start gap-3">
          <span className="icon-badge-rich flex size-11 shrink-0 items-center justify-center">
            <BotIcon className="size-5" aria-hidden="true" />
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2
                id="support-chat-title"
                className="font-heading text-xl font-bold text-white"
              >
                AI Asistan
              </h2>
              <span className="spec-label rounded-full border border-[var(--brand-red)]/40 px-2 py-1 text-[10px] text-white/75">
                YAPAY ZEKÂ
              </span>
            </div>
            <p className="mt-1 max-w-xl text-xs leading-5 text-white/55">
              İnsan temsilci değildir. Kargo, ölçü, bakım ve sipariş taslağı
              konusunda canlı mağaza bilgileriyle yardımcı olur.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-white/45">
          <ShieldCheckIcon className="size-4 text-white/65" aria-hidden="true" />
          Oturumla sınırlı sohbet
        </div>
      </header>

      <div
        className="max-h-[32rem] min-h-72 space-y-3 overflow-y-auto p-4 sm:p-7"
        aria-live="polite"
      >
        {messages.length === 0 ? (
          <div className="chat-msg-in bg-eva rounded-xl border border-white/10 bg-white/[0.025] p-5">
            <p className="font-heading text-lg font-semibold text-white">
              Nereden başlayalım?
            </p>
            <p className="mt-2 max-w-lg text-sm leading-6 text-white/60">
              “Kargom ne zaman çıkar?”, “Paspas ölçüsü aracıma uyar mı?” veya
              “Sipariş özetimi hazırla” diye sorabilirsiniz.
            </p>
          </div>
        ) : null}

        {messages.map((message) => {
          const text = message.parts
            .filter((part) => part.type === "text")
            .map((part) => part.text)
            .join("");
          if (!text) return null;
          return (
            <div
              key={message.id}
              className={`chat-msg-in max-w-[94%] rounded-2xl border px-4 py-3 text-sm leading-6 sm:max-w-[82%] ${
                message.role === "user"
                  ? "ml-auto border-[var(--brand-red)]/35 bg-[var(--brand-red)]/15 text-white"
                  : "border-white/10 bg-white/[0.04] text-white/80"
              }`}
            >
              {text}
            </div>
          );
        })}

        {isStreaming ? (
          <p className="spec-label motion-reduce:animate-none animate-pulse text-xs text-white/45">
            AI Asistan yanıtı hazırlıyor…
          </p>
        ) : null}
      </div>

      {visibleError ? (
        <div
          role="alert"
          className="chat-msg-in mx-4 mb-4 flex flex-col gap-3 rounded-xl border border-[var(--brand-red)]/35 bg-[var(--brand-red)]/10 p-3 text-sm text-white/80 sm:mx-7 sm:flex-row sm:items-center sm:justify-between"
        >
          <span>{visibleError}</span>
          <button
            type="button"
            onClick={() => void handleRetry()}
            className="btn-ghost-rich btn-press inline-flex items-center justify-center gap-2 px-3 py-2 text-xs"
          >
            <RotateCcwIcon className="size-3.5" aria-hidden="true" />
            Yeniden dene
          </button>
        </div>
      ) : null}

      {whatsAppDraft ? (
        <div className="mx-4 mb-4 rounded-xl border border-white/10 bg-white/[0.035] p-4 sm:mx-7">
          <p className="spec-label text-[10px] text-white/50">
            İNCELE · KULLANICI GÖNDERİR
          </p>
          <p className="mt-2 whitespace-pre-line text-xs leading-5 text-white/65">
            {whatsAppDraft}
          </p>
          <a
            href={buildWhatsAppLink(settings.whatsappNumber, whatsAppDraft)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-red-rich btn-press mt-4 inline-flex w-full items-center justify-center gap-2 px-4 py-3 text-sm font-bold sm:w-auto"
          >
            <MessageCircleIcon className="size-4" aria-hidden="true" />
            WhatsApp taslağını aç
          </a>
        </div>
      ) : null}

      <footer className="border-t border-white/10 p-4 sm:p-7">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <label htmlFor="support-chat-input" className="sr-only">
            AI Asistan mesajı
          </label>
          <input
            id="support-chat-input"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            maxLength={2000}
            disabled={isStreaming}
            placeholder="Kargo, ölçü, bakım veya sipariş sorunuzu yazın…"
            className="input-rich min-w-0 flex-1 rounded-xl border border-border bg-black/40 px-4 py-3 text-sm text-white placeholder:text-white/35"
          />
          {isStreaming ? (
            <button
              type="button"
              onClick={() => void handleStop()}
              aria-label="Yanıtı durdur"
              className="btn-ghost-rich btn-press flex size-12 items-center justify-center"
            >
              <SquareIcon className="size-4" aria-hidden="true" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={!input.trim()}
              aria-label="Mesajı gönder"
              className="btn-red-rich btn-press flex size-12 items-center justify-center"
            >
              <SendIcon className="size-4" aria-hidden="true" />
            </button>
          )}
        </form>
        <p className="mt-3 text-[11px] leading-5 text-white/40">
          Sohbet bu oturumla sınırlıdır; uzun süreli saklanmaz ve eğitim için
          kullanılmaz. Hassas kişisel bilgi paylaşmayın.
        </p>
      </footer>
    </section>
  );
}
