"use client";

import { useMemo, useState, useTransition } from "react";
import {
  AlertCircleIcon,
  CheckCircle2Icon,
  FileTextIcon,
  HelpCircleIcon,
  LayoutTemplateIcon,
  LoaderIcon,
  MessageSquareQuoteIcon,
  SaveIcon,
  SearchIcon,
  SparklesIcon,
} from "lucide-react";
import type {
  ContentPage,
  ContentSection,
  FaqItem,
  PromoItem,
  SiteSeo,
  TestimonialItem,
} from "@/lib/cms-defaults";
import ContentGeneratorPanel from "./ContentGeneratorPanel";
import {
  deleteFaqAction,
  seedCmsAction,
  updateFaqAction,
  updatePageAction,
  updatePromoAction,
  updateSectionAction,
  updateSeoAction,
  updateTestimonialAction,
} from "./actions";

const inputClass =
  "mt-1.5 w-full border border-border bg-background px-4 py-2.5 text-sm font-normal text-foreground focus:border-white focus:outline-none focus:ring-2 focus:ring-brand-red/15";

type TabId =
  | "ai-drafts"
  | "seo"
  | "home"
  | "pages"
  | "legal"
  | "faq"
  | "promo"
  | "testimonials";

const TABS: { id: TabId; label: string; icon: typeof SearchIcon }[] = [
  { id: "ai-drafts", label: "AI Taslak", icon: SparklesIcon },
  { id: "seo", label: "SEO", icon: SearchIcon },
  { id: "home", label: "Ana Sayfa", icon: LayoutTemplateIcon },
  { id: "pages", label: "Sayfalar", icon: FileTextIcon },
  { id: "legal", label: "Yasal", icon: FileTextIcon },
  { id: "faq", label: "SSS", icon: HelpCircleIcon },
  { id: "promo", label: "Promo", icon: SparklesIcon },
  { id: "testimonials", label: "Yorumlar", icon: MessageSquareQuoteIcon },
];

type Props = {
  aiAvailable: boolean;
  products: { slug: string; name: string }[];
  initialSeo: SiteSeo;
  seoSource: "convex" | "fallback";
  pages: ContentPage[];
  sectionsByPage: Record<string, ContentSection[]>;
  faqs: FaqItem[];
  marquee: PromoItem[];
  trust: PromoItem[];
  testimonials: TestimonialItem[];
};

export default function ContentManager({
  aiAvailable,
  products,
  initialSeo,
  seoSource,
  pages,
  sectionsByPage,
  faqs: initialFaqs,
  marquee: initialMarquee,
  trust: initialTrust,
  testimonials: initialTestimonials,
}: Props) {
  const [tab, setTab] = useState<TabId>("seo");
  const [seo, setSeo] = useState(initialSeo);
  const [pageMap, setPageMap] = useState(() =>
    Object.fromEntries(pages.map((p) => [p.slug, p]))
  );
  const [sectionMap, setSectionMap] = useState(sectionsByPage);
  const [faqs, setFaqs] = useState(initialFaqs);
  const [marquee, setMarquee] = useState(initialMarquee);
  const [trust, setTrust] = useState(initialTrust);
  const [testimonials, setTestimonials] = useState(initialTestimonials);
  const [selectedPage, setSelectedPage] = useState("home");
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const marketingPages = useMemo(
    () => pages.filter((p) => p.pageType !== "legal"),
    [pages]
  );
  const legalPages = useMemo(
    () => pages.filter((p) => p.pageType === "legal"),
    [pages]
  );

  const tabPages =
    tab === "home"
      ? pages.filter((p) => p.slug === "home")
      : tab === "legal"
        ? legalPages
        : marketingPages.filter((p) => p.slug !== "home");

  const activePageSlug =
    tabPages.some((p) => p.slug === selectedPage)
      ? selectedPage
      : (tabPages[0]?.slug ?? "home");

  function run(action: () => Promise<{ ok: boolean; message?: string }>) {
    setMessage(null);
    startTransition(async () => {
      const result = await action();
      if (result.ok) {
        setMessage({ type: "success", text: "Kaydedildi." });
      } else {
        setMessage({
          type: "error",
          text: result.message ?? "Kayıt başarısız.",
        });
      }
    });
  }

  return (
    <div className="space-y-6">
      {seoSource !== "convex" ? (
        <div className="flex items-start gap-3 border border-amber-500/40 bg-amber-500/5 px-4 py-3 text-xs text-amber-200">
          <AlertCircleIcon className="h-4 w-4 shrink-0" aria-hidden="true" />
          <p>
            Convex bağlı değil veya CMS seed edilmemiş. Aşağıdaki &quot;Varsayılanları
            yükle&quot; ile production/dev verisini doldurun.
          </p>
        </div>
      ) : null}

      {message ? (
        <p
          role={message.type === "error" ? "alert" : "status"}
          className={`inline-flex items-center gap-1.5 text-xs font-semibold ${
            message.type === "success" ? "text-green-400" : "text-brand-red"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2Icon className="h-4 w-4" aria-hidden="true" />
          ) : (
            <AlertCircleIcon className="h-4 w-4" aria-hidden="true" />
          )}
          {message.text}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-2">
        {TABS.filter((t) => t.id !== "ai-drafts" || aiAvailable).map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`inline-flex items-center gap-2 px-3 py-2 text-xs font-bold uppercase tracking-wider ${
              tab === t.id
                ? "bg-brand-red text-white"
                : "border border-border bg-surface text-muted hover:text-white"
            }`}
          >
            <t.icon className="h-3.5 w-3.5" aria-hidden="true" />
            {t.label}
          </button>
        ))}
        <button
          type="button"
          disabled={isPending}
          onClick={() =>
            run(async () => {
              const r = await seedCmsAction();
              return r;
            })
          }
          className="ml-auto inline-flex items-center gap-2 border border-border bg-surface px-3 py-2 text-xs font-bold uppercase tracking-wider text-muted hover:text-white disabled:opacity-60"
        >
          Varsayılanları yükle
        </button>
      </div>

      {tab === "ai-drafts" ? (
        <ContentGeneratorPanel
          aiAvailable={aiAvailable}
          products={products}
        />
      ) : null}

      {tab === "seo" ? (
        <form
          className="space-y-5 border border-border bg-surface p-6"
          onSubmit={(e) => {
            e.preventDefault();
            run(() => updateSeoAction(seo));
          }}
        >
          <fieldset>
            <legend className="font-heading text-base font-bold text-white">
              Site SEO
            </legend>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {(
                [
                  ["siteName", "Site adı"],
                  ["tagline", "Slogan"],
                  ["siteUrl", "Site URL"],
                  ["titleTemplate", "Başlık şablonu"],
                  ["defaultOgImage", "OG görsel yolu"],
                  ["locale", "Locale"],
                  ["ogImageAlt", "OG alt metni"],
                ] as const
              ).map(([key, label]) => (
                <label key={key} htmlFor={`seo-${key}`} className="block text-sm font-semibold">
                  {label}
                  <input
                    id={`seo-${key}`}
                    name={key}
                    required
                    value={seo[key]}
                    onChange={(e) =>
                      setSeo((s) => ({ ...s, [key]: e.target.value }))
                    }
                    className={inputClass}
                  />
                </label>
              ))}
              <label htmlFor="seo-defaultDescription" className="block text-sm font-semibold sm:col-span-2">
                Varsayılan açıklama
                <textarea
                  id="seo-defaultDescription"
                  name="defaultDescription"
                  required
                  rows={3}
                  value={seo.defaultDescription}
                  onChange={(e) =>
                    setSeo((s) => ({
                      ...s,
                      defaultDescription: e.target.value,
                    }))
                  }
                  className={inputClass}
                />
              </label>
            </div>
          </fieldset>
          <SaveButton pending={isPending} />
        </form>
      ) : null}

      {(tab === "home" || tab === "pages" || tab === "legal") && (
        <PageEditor
          pageOptions={tabPages}
          selectedPage={activePageSlug}
          onSelectPage={setSelectedPage}
          page={pageMap[activePageSlug]}
          sections={sectionMap[activePageSlug] ?? []}
          onPageChange={(p) =>
            setPageMap((m) => ({ ...m, [p.slug]: p }))
          }
          onSectionChange={(section) =>
            setSectionMap((m) => ({
              ...m,
              [section.pageSlug]: (m[section.pageSlug] ?? []).map((s) =>
                s.sectionKey === section.sectionKey ? section : s
              ),
            }))
          }
          onSavePage={(p) => run(() => updatePageAction(p))}
          onSaveSection={(s) => run(() => updateSectionAction(s))}
          pending={isPending}
          preferSections={tab === "home" || tab === "legal"}
        />
      )}

      {tab === "faq" ? (
        <ListEditor
          title="Sık sorulan sorular"
          items={faqs}
          pending={isPending}
          renderFields={(item, idx) => (
            <div className="grid gap-3">
              <label className="block text-sm font-semibold">
                Soru
                <input
                  value={item.question}
                  onChange={(e) =>
                    setFaqs((list) =>
                      list.map((f, i) =>
                        i === idx ? { ...f, question: e.target.value } : f
                      )
                    )
                  }
                  className={inputClass}
                />
              </label>
              <label className="block text-sm font-semibold">
                Cevap (token: {"{estimatedDispatch}"}, {"{freeShippingThreshold}"})
                <textarea
                  rows={3}
                  value={item.answer}
                  onChange={(e) =>
                    setFaqs((list) =>
                      list.map((f, i) =>
                        i === idx ? { ...f, answer: e.target.value } : f
                      )
                    )
                  }
                  className={inputClass}
                />
              </label>
            </div>
          )}
          onSave={(idx) => run(() => updateFaqAction(faqs[idx]!))}
          onDelete={(idx) => {
            const id = faqs[idx]?.id;
            if (!id) {
              setFaqs((list) => list.filter((_, i) => i !== idx));
              return;
            }
            run(async () => {
              const r = await deleteFaqAction(id);
              if (r.ok) setFaqs((list) => list.filter((_, i) => i !== idx));
              return r;
            });
          }}
          onAdd={() =>
            setFaqs((list) => [
              ...list,
              {
                sortOrder: list.length + 1,
                question: "Yeni soru",
                answer: "Cevap",
                isPublished: true,
              },
            ])
          }
        />
      ) : null}

      {tab === "promo" ? (
        <div className="space-y-6">
          <PromoGroup
            title="Marquee satırları"
            items={marquee}
            setItems={setMarquee}
            pending={isPending}
            onSave={(idx) => run(() => updatePromoAction(marquee[idx]!))}
          />
          <PromoGroup
            title="Trust strip"
            items={trust}
            setItems={setTrust}
            pending={isPending}
            withDetail
            onSave={(idx) => run(() => updatePromoAction(trust[idx]!))}
          />
        </div>
      ) : null}

      {tab === "testimonials" ? (
        <ListEditor
          title="Müşteri yorumları"
          items={testimonials}
          pending={isPending}
          renderFields={(item, idx) => (
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block text-sm font-semibold">
                İsim
                <input
                  value={item.name}
                  onChange={(e) =>
                    setTestimonials((list) =>
                      list.map((t, i) =>
                        i === idx ? { ...t, name: e.target.value } : t
                      )
                    )
                  }
                  className={inputClass}
                />
              </label>
              <label className="block text-sm font-semibold">
                Konum / araç
                <input
                  value={item.location}
                  onChange={(e) =>
                    setTestimonials((list) =>
                      list.map((t, i) =>
                        i === idx ? { ...t, location: e.target.value } : t
                      )
                    )
                  }
                  className={inputClass}
                />
              </label>
              <label className="block text-sm font-semibold">
                Puan (1–5)
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={item.rating}
                  onChange={(e) =>
                    setTestimonials((list) =>
                      list.map((t, i) =>
                        i === idx
                          ? { ...t, rating: Number(e.target.value) }
                          : t
                      )
                    )
                  }
                  className={inputClass}
                />
              </label>
              <label className="block text-sm font-semibold sm:col-span-2">
                Yorum
                <textarea
                  rows={3}
                  value={item.text}
                  onChange={(e) =>
                    setTestimonials((list) =>
                      list.map((t, i) =>
                        i === idx ? { ...t, text: e.target.value } : t
                      )
                    )
                  }
                  className={inputClass}
                />
              </label>
            </div>
          )}
          onSave={(idx) =>
            run(() => updateTestimonialAction(testimonials[idx]!))
          }
          onAdd={() =>
            setTestimonials((list) => [
              ...list,
              {
                sortOrder: list.length + 1,
                name: "Yeni müşteri",
                location: "Şehir · Araç",
                rating: 5,
                text: "Yorum metni",
                isPublished: true,
              },
            ])
          }
        />
      ) : null}
    </div>
  );
}

function SaveButton({ pending }: { pending: boolean }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center gap-2 bg-brand-red px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-brand-red-dark disabled:opacity-60"
    >
      {pending ? (
        <LoaderIcon className="h-4 w-4 animate-spin" aria-hidden="true" />
      ) : (
        <SaveIcon className="h-4 w-4" aria-hidden="true" />
      )}
      Kaydet
    </button>
  );
}

function PageEditor({
  pageOptions,
  selectedPage,
  onSelectPage,
  page,
  sections,
  onPageChange,
  onSectionChange,
  onSavePage,
  onSaveSection,
  pending,
  preferSections,
}: {
  pageOptions: ContentPage[];
  selectedPage: string;
  onSelectPage: (slug: string) => void;
  page?: ContentPage;
  sections: ContentSection[];
  onPageChange: (p: ContentPage) => void;
  onSectionChange: (s: ContentSection) => void;
  onSavePage: (p: ContentPage) => void;
  onSaveSection: (s: ContentSection) => void;
  pending: boolean;
  preferSections: boolean;
}) {
  if (!page) {
    return (
      <p className="text-sm text-muted">Bu sekmede düzenlenecek sayfa yok.</p>
    );
  }

  return (
    <div className="space-y-6">
      <label className="block text-sm font-semibold">
        Sayfa seç
        <select
          value={selectedPage}
          onChange={(e) => onSelectPage(e.target.value)}
          className={inputClass}
        >
          {pageOptions.map((p) => (
            <option key={p.slug} value={p.slug}>
              {p.title} ({p.slug})
            </option>
          ))}
        </select>
      </label>

      <form
        className="space-y-4 border border-border bg-surface p-6"
        onSubmit={(e) => {
          e.preventDefault();
          onSavePage(page);
        }}
      >
        <fieldset>
          <legend className="font-heading text-base font-bold text-white">
            Sayfa bilgileri
          </legend>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-semibold sm:col-span-2">
              Başlık
              <input
                value={page.title}
                onChange={(e) =>
                  onPageChange({ ...page, title: e.target.value })
                }
                className={inputClass}
              />
            </label>
            <label className="block text-sm font-semibold">
              Meta title
              <input
                value={page.metaTitle}
                onChange={(e) =>
                  onPageChange({ ...page, metaTitle: e.target.value })
                }
                className={inputClass}
              />
            </label>
            <label className="block text-sm font-semibold">
              Yayın
              <select
                value={page.isPublished ? "1" : "0"}
                onChange={(e) =>
                  onPageChange({
                    ...page,
                    isPublished: e.target.value === "1",
                  })
                }
                className={inputClass}
              >
                <option value="1">Yayında</option>
                <option value="0">Taslak</option>
              </select>
            </label>
            <label className="block text-sm font-semibold sm:col-span-2">
              Meta / kısa açıklama
              <textarea
                rows={3}
                value={page.metaDescription}
                onChange={(e) =>
                  onPageChange({
                    ...page,
                    metaDescription: e.target.value,
                    description: e.target.value,
                  })
                }
                className={inputClass}
              />
            </label>
          </div>
        </fieldset>
        <SaveButton pending={pending} />
      </form>

      {preferSections
        ? sections.map((section) => (
            <form
              key={section.sectionKey}
              className="space-y-3 border border-border bg-surface p-5"
              onSubmit={(e) => {
                e.preventDefault();
                onSaveSection(section);
              }}
            >
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-white">
                {section.sectionKey}
              </h3>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block text-sm font-semibold">
                  Eyebrow
                  <input
                    value={section.eyebrow ?? ""}
                    onChange={(e) =>
                      onSectionChange({
                        ...section,
                        eyebrow: e.target.value || undefined,
                      })
                    }
                    className={inputClass}
                  />
                </label>
                <label className="block text-sm font-semibold">
                  Başlık
                  <input
                    value={section.title ?? ""}
                    onChange={(e) =>
                      onSectionChange({
                        ...section,
                        title: e.target.value || undefined,
                      })
                    }
                    className={inputClass}
                  />
                </label>
                <label className="block text-sm font-semibold sm:col-span-2">
                  Alt başlık
                  <input
                    value={section.subtitle ?? ""}
                    onChange={(e) =>
                      onSectionChange({
                        ...section,
                        subtitle: e.target.value || undefined,
                      })
                    }
                    className={inputClass}
                  />
                </label>
                <label className="block text-sm font-semibold sm:col-span-2">
                  Gövde
                  <textarea
                    rows={3}
                    value={section.body}
                    onChange={(e) =>
                      onSectionChange({ ...section, body: e.target.value })
                    }
                    className={inputClass}
                  />
                </label>
                <label className="block text-sm font-semibold sm:col-span-2">
                  Görsel URL
                  <input
                    value={section.imageUrl ?? ""}
                    onChange={(e) =>
                      onSectionChange({
                        ...section,
                        imageUrl: e.target.value || undefined,
                      })
                    }
                    placeholder="/media/..."
                    className={inputClass}
                  />
                </label>
                {section.imageUrl ? (
                  <div className="sm:col-span-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={section.imageUrl}
                      alt={section.imageAlt ?? "Önizleme"}
                      className="h-28 w-full max-w-xs border border-border object-cover"
                    />
                  </div>
                ) : null}
                <label className="block text-sm font-semibold sm:col-span-2">
                  Görsel alt metni
                  <input
                    value={section.imageAlt ?? ""}
                    onChange={(e) =>
                      onSectionChange({
                        ...section,
                        imageAlt: e.target.value || undefined,
                      })
                    }
                    className={inputClass}
                  />
                </label>
                <label className="block text-sm font-semibold">
                  CTA metni
                  <input
                    value={section.ctaLabel ?? ""}
                    onChange={(e) =>
                      onSectionChange({
                        ...section,
                        ctaLabel: e.target.value || undefined,
                      })
                    }
                    className={inputClass}
                  />
                </label>
                <label className="block text-sm font-semibold">
                  CTA link
                  <input
                    value={section.ctaHref ?? ""}
                    onChange={(e) =>
                      onSectionChange({
                        ...section,
                        ctaHref: e.target.value || undefined,
                      })
                    }
                    className={inputClass}
                  />
                </label>
              </div>
              <SaveButton pending={pending} />
            </form>
          ))
        : null}
    </div>
  );
}

function ListEditor<T>({
  title,
  items,
  pending,
  renderFields,
  onSave,
  onDelete,
  onAdd,
}: {
  title: string;
  items: T[];
  pending: boolean;
  renderFields: (item: T, idx: number) => React.ReactNode;
  onSave: (idx: number) => void;
  onDelete?: (idx: number) => void;
  onAdd: () => void;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-base font-bold text-white">{title}</h2>
        <button
          type="button"
          onClick={onAdd}
          className="border border-border bg-surface px-3 py-2 text-xs font-bold uppercase text-muted hover:text-white"
        >
          Yeni ekle
        </button>
      </div>
      {items.map((item, idx) => (
        <div key={idx} className="space-y-3 border border-border bg-surface p-5">
          {renderFields(item, idx)}
          <div className="flex gap-2">
            <button
              type="button"
              disabled={pending}
              onClick={() => onSave(idx)}
              className="inline-flex items-center gap-2 bg-brand-red px-4 py-2 text-xs font-bold uppercase text-white disabled:opacity-60"
            >
              {pending ? (
                <LoaderIcon className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <SaveIcon className="h-3.5 w-3.5" />
              )}
              Kaydet
            </button>
            {onDelete ? (
              <button
                type="button"
                onClick={() => onDelete(idx)}
                className="px-4 py-2 text-xs font-bold uppercase text-brand-red"
              >
                Sil
              </button>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}

function PromoGroup({
  title,
  items,
  setItems,
  pending,
  onSave,
  withDetail,
}: {
  title: string;
  items: PromoItem[];
  setItems: React.Dispatch<React.SetStateAction<PromoItem[]>>;
  pending: boolean;
  onSave: (idx: number) => void;
  withDetail?: boolean;
}) {
  return (
    <ListEditor
      title={title}
      items={items}
      pending={pending}
      onAdd={() =>
        setItems((list) => [
          ...list,
          {
            kind: list[0]?.kind ?? "marquee",
            sortOrder: list.length + 1,
            label: "Yeni satır",
            detail: withDetail ? "Detay" : undefined,
            isPublished: true,
          },
        ])
      }
      onSave={onSave}
      renderFields={(item, idx) => (
        <div className="grid gap-3">
          <label className="block text-sm font-semibold">
            Metin
            <input
              value={item.label}
              onChange={(e) =>
                setItems((list) =>
                  list.map((p, i) =>
                    i === idx ? { ...p, label: e.target.value } : p
                  )
                )
              }
              className={inputClass}
            />
          </label>
          {withDetail ? (
            <label className="block text-sm font-semibold">
              Detay
              <input
                value={item.detail ?? ""}
                onChange={(e) =>
                  setItems((list) =>
                    list.map((p, i) =>
                      i === idx ? { ...p, detail: e.target.value } : p
                    )
                  )
                }
                className={inputClass}
              />
            </label>
          ) : null}
        </div>
      )}
    />
  );
}
