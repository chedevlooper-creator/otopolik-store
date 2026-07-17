"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useChat } from "@ai-sdk/react";
import {
  DefaultChatTransport,
  lastAssistantMessageIsCompleteWithToolCalls,
} from "ai";
import { BotIcon, SendIcon, SquareIcon, RotateCcwIcon } from "lucide-react";

import { useCart } from "@/context/cart-context";
import type { ConfiguratorChatMessage } from "@/lib/ai/configurator-tools";
import { siteConfig } from "@/lib/site-config";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { useConfiguratorAssistant } from "./ConfiguratorAssistantProvider";

function getTurkishStreamError(error: Error): string {
  if (/429|rate.?limit|cok_fazla_istek/i.test(error.message)) {
    return "Çok fazla istek gönderildi. Kısa bir süre sonra yeniden deneyin.";
  }
  if (/503|ai_unavailable/i.test(error.message)) {
    return "AI Asistan şu anda kullanılamıyor. Manuel tasarıma devam edebilirsiniz.";
  }
  return "Bağlantı kesildi. Son yanıt tamamlanmadı; güvenle yeniden deneyebilirsiniz.";
}

export default function ConfiguratorChat() {
  const { addItem } = useCart();
  const {
    applyVehicle,
    applyFloor,
    applyEdge,
    applyExtras,
    buildCartItem,
    vehicleComplete,
  } = useConfiguratorAssistant();
  const [input, setInput] = useState("");
  const [streamError, setStreamError] = useState<string | null>(null);
  const [whatsAppDraft, setWhatsAppDraft] = useState<string | null>(null);
  const [sessionId] = useState(() =>
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `chat-${Date.now()}`
  );
  const transport = useMemo(
    () =>
      new DefaultChatTransport<ConfiguratorChatMessage>({
        api: "/api/ai/chat",
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
  } = useChat<ConfiguratorChatMessage>({
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

      switch (toolCall.toolName) {
        case "set_vehicle": {
          applyVehicle(toolCall.input);
          addToolOutput({
            tool: "set_vehicle",
            toolCallId: toolCall.toolCallId,
            output: { applied: true },
          });
          break;
        }
        case "set_floor_color": {
          const applied = applyFloor(toolCall.input.color);
          addToolOutput({
            tool: "set_floor_color",
            toolCallId: toolCall.toolCallId,
            output: { applied },
          });
          break;
        }
        case "set_edge_color": {
          const applied = applyEdge(toolCall.input.color);
          addToolOutput({
            tool: "set_edge_color",
            toolCallId: toolCall.toolCallId,
            output: { applied },
          });
          break;
        }
        case "set_extras": {
          applyExtras(toolCall.input);
          addToolOutput({
            tool: "set_extras",
            toolCallId: toolCall.toolCallId,
            output: { applied: true },
          });
          break;
        }
        case "add_to_cart": {
          const item = buildCartItem();
          if (!vehicleComplete || !item) {
            addToolOutput({
              tool: "add_to_cart",
              toolCallId: toolCall.toolCallId,
              state: "output-error",
              errorText: "Araç bilgileri tamamlanmadan sepete eklenemez.",
            });
            break;
          }
          addItem(item);
          addToolOutput({
            tool: "add_to_cart",
            toolCallId: toolCall.toolCallId,
            output: { added: true, price: item.price },
          });
          break;
        }
        case "prepare_whatsapp_handoff": {
          setWhatsAppDraft(toolCall.input.message);
          addToolOutput({
            tool: "prepare_whatsapp_handoff",
            toolCallId: toolCall.toolCallId,
            output: { prepared: true },
          });
          break;
        }
      }
    },
  });

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
      aria-labelledby="configurator-chat-title"
      className="surface-glass mac-glass mb-8 overflow-hidden rounded-2xl border border-white/10 bg-black p-4 sm:p-6"
    >
      <div className="flex items-start gap-3 border-b border-white/10 pb-4">
        <span className="icon-badge-rich flex size-10 shrink-0 items-center justify-center">
          <BotIcon className="size-5" aria-hidden="true" />
        </span>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2
              id="configurator-chat-title"
              className="font-heading text-xl font-bold text-white"
            >
              AI Asistan
            </h2>
            <span className="spec-label rounded-full border border-[var(--brand-red)]/40 px-2 py-0.5 text-[10px] text-white/80">
              YAPAY ZEKÂ
            </span>
          </div>
          <p className="mt-1 text-xs leading-5 text-white/55">
            İnsan satış temsilcisi değildir. Gerçek tasarım adımlarınızı birlikte
            doldurur; son onay her zaman sizdedir.
          </p>
        </div>
      </div>

      <div
        className="mt-4 max-h-[28rem] min-h-44 space-y-3 overflow-y-auto pr-1"
        aria-live="polite"
      >
        {messages.length === 0 ? (
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-6 text-white/65">
            “2021 BMW 3 Serisi için siyah taban, kırmızı kenar istiyorum” diye
            başlayabilirsiniz.
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
              className={`max-w-[92%] rounded-2xl border px-4 py-3 text-sm leading-6 ${
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
            AI Asistan düşünüyor…
          </p>
        ) : null}
      </div>

      {visibleError ? (
        <div
          role="alert"
          className="mt-4 flex flex-col gap-3 rounded-xl border border-[var(--brand-red)]/35 bg-[var(--brand-red)]/10 p-3 text-sm text-white/80 sm:flex-row sm:items-center sm:justify-between"
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
        <a
          href={buildWhatsAppLink(siteConfig.whatsappNumber, whatsAppDraft)}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-red-rich btn-press mt-4 inline-flex w-full items-center justify-center px-4 py-3 text-sm font-bold"
        >
          WhatsApp taslağını aç
        </a>
      ) : null}

      <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
        <label htmlFor="configurator-chat-input" className="sr-only">
          AI Asistan mesajı
        </label>
        <input
          id="configurator-chat-input"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          maxLength={2000}
          disabled={isStreaming}
          placeholder="Aracınızı veya istediğiniz tasarımı yazın…"
          className="input-rich min-w-0 flex-1 rounded-xl border border-white/10 bg-black/70 px-4 py-3 text-sm text-white placeholder:text-white/35"
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
    </section>
  );
}
