"use client";

import { useState, type FormEvent } from "react";

type MatchCandidate = {
  brand: string;
  model: string;
  displayModel: string;
  bodyType: string;
  priceTier: number;
  source: "deterministic" | "llm";
  year?: string;
};

type MatchResponse =
  | { status: "matched"; candidate: MatchCandidate }
  | { status: "needs_disambiguation"; candidates: MatchCandidate[] }
  | { status: "no_match"; message?: string }
  | { error: string };

type Props = {
  onResolved: (candidate: MatchCandidate) => void;
};

const ERROR_MESSAGES: Record<string, string> = {
  ai_unavailable:
    "Metinle araç bulma şu anda kapalı. Aşağıdaki alanlardan seçime devam edebilirsiniz.",
  cok_fazla_istek:
    "Çok sık deneme yaptınız. Kısa bir süre sonra yeniden deneyin.",
  arac_metni_gerekli: "Marka ve model içeren bir araç tarifi yazın.",
  arac_metni_cok_uzun: "Araç tarifini biraz kısaltıp yeniden deneyin.",
};

export default function VehicleMatchInput({ onResolved }: Props) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [candidates, setCandidates] = useState<MatchCandidate[]>([]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedQuery = query.trim();
    if (!trimmedQuery || loading) return;

    setLoading(true);
    setMessage(null);
    setCandidates([]);

    try {
      const response = await fetch("/api/ai/vehicle-match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: trimmedQuery }),
      });
      const payload = (await response.json()) as MatchResponse;

      if (!response.ok || "error" in payload) {
        const errorCode = "error" in payload ? payload.error : "";
        setMessage(
          ERROR_MESSAGES[errorCode] ??
            "Araç eşleştirilemedi. Manuel seçim alanlarını kullanabilirsiniz."
        );
        return;
      }

      if (payload.status === "matched") {
        onResolved(payload.candidate);
        setMessage(
          `${payload.candidate.brand} ${payload.candidate.displayModel} alanlara aktarıldı.`
        );
        return;
      }

      if (payload.status === "needs_disambiguation") {
        setCandidates(payload.candidates);
        setMessage("Birden fazla araç bulundu. Doğru seçeneği belirleyin.");
        return;
      }

      setMessage(
        payload.message ??
          "Eşleşme bulunamadı. Aşağıdaki alanlardan manuel seçim yapabilirsiniz."
      );
    } catch {
      setMessage(
        "Bağlantı kurulamadı. Aşağıdaki manuel araç seçimi çalışmaya devam ediyor."
      );
    } finally {
      setLoading(false);
    }
  }

  function handleCandidate(candidate: MatchCandidate) {
    onResolved(candidate);
    setCandidates([]);
    setMessage(
      `${candidate.brand} ${candidate.displayModel} alanlara aktarıldı.`
    );
  }

  return (
    <div className="surface-glass mt-5 rounded-2xl border border-white/10 p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="spec-label text-[10px] uppercase tracking-[0.2em] text-white/45">
            Hızlı eşleştirme
          </p>
          <h3 className="mt-1 font-heading text-lg font-bold text-white">
            Araç metniyle bul
          </h3>
          <p className="mt-1 text-xs leading-5 text-white/50">
            Günlük yazın; eşleşen katalog aracını alanlara aktaralım.
          </p>
        </div>
        <span className="rounded-full border border-[rgba(237,27,36,0.35)] bg-[rgba(237,27,36,0.1)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-red-200">
          Akıllı bul
        </span>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-4 flex flex-col gap-2 sm:flex-row"
      >
        <label className="sr-only" htmlFor="vehicle-match-query">
          Araç tarifi
        </label>
        <input
          id="vehicle-match-query"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          maxLength={200}
          placeholder="Örn. 2019 Passat variant veya 19 model Egea"
          className="input-rich min-h-12 flex-1 rounded-xl border border-white/10 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none"
        />
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="btn-red-rich btn-press min-h-12 rounded-xl px-5 text-sm font-bold"
        >
          {loading ? "Eşleştiriliyor…" : "Eşleştir"}
        </button>
      </form>

      {message ? (
        <p
          aria-live="polite"
          className="mt-3 text-xs leading-5 text-white/65"
        >
          {message}
        </p>
      ) : null}

      {candidates.length > 0 ? (
        <div className="mt-3 grid gap-2" aria-label="Araç seçenekleri">
          {candidates.map((candidate) => (
            <button
              key={`${candidate.brand}-${candidate.model}`}
              type="button"
              onClick={() => handleCandidate(candidate)}
              className="btn-ghost-rich btn-press flex min-h-12 items-center justify-between rounded-xl px-4 py-3 text-left"
            >
              <span>
                <span className="block text-sm font-bold text-white">
                  {candidate.brand} {candidate.displayModel}
                </span>
                <span className="mt-0.5 block text-[11px] text-white/45">
                  {candidate.bodyType}
                  {candidate.year ? ` · ${candidate.year}` : ""}
                </span>
              </span>
              <span className="text-xs font-bold text-red-200">Seç</span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
