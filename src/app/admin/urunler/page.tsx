"use client";

import { useState } from "react";
import Link from "next/link";
import {
  PlusIcon,
  PencilIcon,
  Trash2Icon,
  TagIcon,
  PackageIcon,
  ExternalLinkIcon,
  AlertCircleIcon,
  XIcon,
  CheckIcon,
  LoaderIcon,
} from "lucide-react";
import { formatPrice } from "@/lib/format";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { isConvexConfiguredClient } from "@/lib/convex-client";
import { useAdminConvexKey } from "@/hooks/useAdminConvexKey";
import type { Doc, Id } from "../../../../convex/_generated/dataModel";
import ImageUploadButton from "@/components/admin/ImageUploadButton";

const CATEGORIES = [
  { key: "eva-3d", label: "3D EVA Paspas" },
  { key: "eva-havuzlu", label: "Havuzlu EVA" },
  { key: "hali-paspas", label: "Halı Paspas" },
  { key: "bagaj", label: "Bagaj Paspası" },
  { key: "bagaj-havuzu", label: "Bagaj Havuzu" },
  { key: "bagaj-cantasi", label: "Bagaj Çantası" },
  { key: "direksiyon-kilifi", label: "Direksiyon Kılıfı" },
  { key: "minder-seti", label: "Minder Seti" },
  { key: "ekran-koruyucu", label: "Ekran Koruyucu" },
];

type ProductColorForm = {
  name: string;
  hex: string;
  image: string;
};

const DEFAULT_PRODUCT_COLORS: ProductColorForm[] = [
  {
    name: "Siyah",
    hex: "#1a1a1a",
    image: "/media/scraped/evaotopaspas/paspas-seti/01-siyah-urun.png",
  },
  {
    name: "Gri",
    hex: "#8a8a8a",
    image: "/media/scraped/evaotopaspas/paspas-seti/03-gallery-1.jpg",
  },
  {
    name: "Bej",
    hex: "#c9b79c",
    image: "/media/scraped/evaotopaspas/paspas-seti/04-gallery-2.jpg",
  },
];

type FormState = {
  slug: string;
  name: string;
  brand: string;
  model: string;
  category: string;
  price: number;
  oldPrice: number | null;
  image: string;
  galleryText: string;
  colors: ProductColorForm[];
  description: string;
  featuresText: string;
  badge: string;
  inStock: boolean;
  isActive: boolean;
};

const EMPTY_FORM: FormState = {
  slug: "",
  name: "",
  brand: "OTO POLİK",
  model: "Tüm Modeller",
  category: "eva-3d",
  price: 0,
  oldPrice: null,
  image: "",
  galleryText: "",
  colors: DEFAULT_PRODUCT_COLORS.map((c) => ({ ...c })),
  description: "",
  featuresText: "",
  badge: "",
  inStock: true,
  isActive: true,
};

type EditingState =
  | { mode: "create" }
  | { mode: "edit"; productId: Id<"products">; initial: FormState }
  | { mode: "delete"; productId: Id<"products">; name: string }
  | null;

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[ğ]/g, "g")
    .replace(/[ü]/g, "u")
    .replace(/[ş]/g, "s")
    .replace(/[ı]/g, "i")
    .replace(/[ö]/g, "o")
    .replace(/[ç]/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}

export default function AdminUrunler() {
  const convexReady = isConvexConfiguredClient();
  const adminKeyState = useAdminConvexKey();
  const adminKey =
    adminKeyState.status === "ready" ? adminKeyState.adminKey : null;
  const products = useQuery(
    api.products.listAll,
    convexReady && adminKey ? { adminKey } : "skip"
  ) as Doc<"products">[] | undefined;
  const createProduct = useMutation(api.products.create);
  const updateProduct = useMutation(api.products.update);
  const deleteProduct = useMutation(api.products.remove);

  const [editing, setEditing] = useState<EditingState>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  function openCreate() {
    setForm(EMPTY_FORM);
    setMessage(null);
    setEditing({ mode: "create" });
  }

  function openEdit(product: Doc<"products">) {
    setForm({
      slug: product.slug,
      name: product.name,
      brand: product.brand,
      model: product.model,
      category: product.category,
      price: Number(product.price),
      oldPrice: product.oldPrice != null ? Number(product.oldPrice) : null,
      image: product.image ?? "",
      galleryText: (product.gallery ?? []).join("\n"),
      colors:
        product.colors?.length > 0
          ? product.colors.map((c) => ({
              name: c.name,
              hex: c.hex,
              image: c.image ?? "",
            }))
          : DEFAULT_PRODUCT_COLORS.map((c) => ({ ...c })),
      description: product.description ?? "",
      featuresText: (product.features ?? []).join("\n"),
      badge: product.badge ?? "",
      inStock: Boolean(product.inStock),
      isActive: Boolean(product.isActive),
    });
    setMessage(null);
    setEditing({ mode: "edit", productId: product._id, initial: form });
  }

  function openDelete(product: Doc<"products">) {
    setMessage(null);
    setEditing({ mode: "delete", productId: product._id, name: product.name });
  }

  function close() {
    setEditing(null);
    setMessage(null);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editing) return;

    if (form.price < 0) {
      setMessage({ type: "error", text: "Fiyat negatif olamaz." });
      return;
    }
    if (!form.name.trim() || !form.slug.trim()) {
      setMessage({ type: "error", text: "İsim ve slug zorunludur." });
      return;
    }

    setSaving(true);
    try {
      if (!adminKey) {
        setMessage({
          type: "error",
          text:
            adminKeyState.status === "error"
              ? adminKeyState.message
              : "Admin yetkisi yükleniyor. Birkaç saniye sonra tekrar deneyin.",
        });
        return;
      }
      const gallery = form.galleryText
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);
      const features = form.featuresText
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);
      const colors = form.colors
        .map((c) => ({
          name: c.name.trim(),
          hex: c.hex.trim(),
          image: c.image.trim() || undefined,
        }))
        .filter((c) => c.name && c.hex);
      if (editing.mode === "create") {
        await createProduct({
          adminKey,
          slug: form.slug,
          name: form.name,
          brand: form.brand,
          model: form.model,
          category: form.category,
          price: form.price,
          oldPrice: form.oldPrice ?? undefined,
          image: form.image,
          gallery: gallery.length ? gallery : undefined,
          colors: colors.length ? colors : undefined,
          description: form.description || undefined,
          features: features.length ? features : undefined,
          badge: form.badge || undefined,
          inStock: form.inStock,
          isActive: form.isActive,
        });
        setMessage({ type: "success", text: "Ürün oluşturuldu." });
      } else if (editing.mode === "edit") {
        await updateProduct({
          adminKey,
          id: editing.productId,
          name: form.name,
          brand: form.brand,
          model: form.model,
          category: form.category,
          price: form.price,
          oldPrice: form.oldPrice ?? undefined,
          image: form.image,
          gallery: gallery.length ? gallery : undefined,
          colors: colors.length ? colors : undefined,
          description: form.description || undefined,
          features: features.length ? features : undefined,
          badge: form.badge || undefined,
          inStock: form.inStock,
          isActive: form.isActive,
        });
        setMessage({ type: "success", text: "Ürün güncellendi." });
      }
      setEditing(null);
    } catch (err) {
      console.error("Product save error:", err);
      setMessage({
        type: "error",
        text:
          err instanceof Error
            ? `Kayıt hatası: ${err.message}`
            : "Kayıt sırasında bir hata oluştu.",
      });
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    if (!editing || editing.mode !== "delete") return;
    if (!adminKey) {
      setMessage({
        type: "error",
        text:
          adminKeyState.status === "error"
            ? adminKeyState.message
            : "Admin yetkisi yükleniyor. Birkaç saniye sonra tekrar deneyin.",
      });
      return;
    }
    setSaving(true);
    try {
      await deleteProduct({ adminKey, id: editing.productId });
      setMessage({ type: "success", text: "Ürün silindi." });
      setEditing(null);
    } catch (err) {
      console.error("Product delete error:", err);
      setMessage({ type: "error", text: "Silme sırasında bir hata oluştu." });
    } finally {
      setSaving(false);
    }
  }

  function autoSlugFromName() {
    setForm((f) => ({ ...f, slug: slugify(f.name) }));
  }

  return (
    <div className="space-y-8">
      {/* Başlık + yeni ürün */}
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-heading text-2xl font-extrabold text-white sm:text-3xl">
            Ürünler
          </h1>
          <p className="mt-1 text-sm text-muted">
            Katalog ürünlerini yönetin. Pasif ürünler sitede gözükmez.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          disabled={!convexReady || !adminKey}
          className="inline-flex items-center gap-2 bg-brand-red px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-brand-red-dark disabled:cursor-not-allowed disabled:opacity-60"
        >
          <PlusIcon className="h-4 w-4" aria-hidden="true" />
          Yeni Ürün
        </button>
      </div>

      {/* Convex bağlı değilse uyarı */}
      {!convexReady ? (
        <div className="flex items-start gap-3 border border-amber-500/40 bg-amber-500/5 px-4 py-3 text-xs text-amber-200">
          <AlertCircleIcon className="h-4 w-4 shrink-0" aria-hidden="true" />
          <p>
            Convex bağlı değil. Ürün kataloğu şu an{" "}
            <code className="text-amber-100">src/lib/products.ts</code> içindeki
            yerleşik listeden geliyor. npx convex dev çalıştırın ve Convex projesi
            oluşturun, böylece değişiklikler kalıcı olsun.
          </p>
        </div>
      ) : adminKeyState.status === "error" ? (
        <div className="flex items-start gap-3 border border-brand-red/40 bg-brand-red/5 px-4 py-3 text-xs text-brand-red">
          <AlertCircleIcon className="h-4 w-4 shrink-0" aria-hidden="true" />
          <p>{adminKeyState.message}</p>
        </div>
      ) : null}

      {/* Son işlem mesajı */}
      {message ? (
        <div
          role="status"
          className={`flex items-center gap-2 border px-4 py-2.5 text-sm font-semibold ${
            message.type === "success"
              ? "border-green-500/30 bg-green-500/5 text-green-300"
              : "border-brand-red/30 bg-brand-red/5 text-brand-red"
          }`}
        >
          {message.type === "success" ? (
            <CheckIcon className="h-4 w-4" aria-hidden="true" />
          ) : (
            <AlertCircleIcon className="h-4 w-4" aria-hidden="true" />
          )}
          {message.text}
        </div>
      ) : null}

      {/* Ürün listesi */}
      <div className="border border-border bg-surface">
        <div className="border-b border-border px-5 py-3 text-xs font-bold uppercase tracking-wider text-muted">
          {convexReady
            ? `${products?.length ?? 0} ürün`
            : "Yerleşik katalog (salt okunur)"}
        </div>
        <div className="divide-y divide-border">
          {convexReady ? (
            products === undefined ? (
              <div className="px-5 py-10 text-center text-sm text-muted">
                Yükleniyor…
              </div>
            ) : products.length === 0 ? (
              <div className="px-5 py-10 text-center text-sm text-muted">
                Henüz ürün yok. &quot;Yeni Ürün&quot; ile başlayın.
              </div>
            ) : (
              products.map((p) => (
                <div
                  key={p._id}
                  className="flex flex-col items-start gap-4 px-5 py-4 sm:flex-row sm:items-center"
                >
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center bg-background text-muted">
                    {p.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={p.image}
                        alt={p.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <PackageIcon className="h-7 w-7" aria-hidden="true" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-heading text-sm font-bold text-white">
                        {p.name}
                      </h3>
                      {p.badge ? (
                        <span className="inline-flex items-center gap-1 bg-brand-red/10 px-2 py-0.5 text-[10px] font-bold uppercase text-brand-red">
                          <TagIcon className="h-3 w-3" aria-hidden="true" />
                          {p.badge}
                        </span>
                      ) : null}
                      {!p.isActive ? (
                        <span className="inline-flex items-center gap-1 bg-surface px-2 py-0.5 text-[10px] font-bold uppercase text-muted">
                          Pasif
                        </span>
                      ) : null}
                      {!p.inStock ? (
                        <span className="inline-flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold uppercase text-amber-400">
                          Stokta yok
                        </span>
                      ) : null}
                    </div>
                    <div className="mt-1 text-xs text-muted">
                      <span className="font-mono">{p.slug}</span>
                      <span className="mx-2">·</span>
                      {CATEGORIES.find((c) => c.key === p.category)?.label ??
                        p.category}
                    </div>
                    <div className="mt-1.5 flex items-baseline gap-2 text-sm">
                      <span className="font-bold text-white">
                        {formatPrice(Number(p.price))}
                      </span>
                      {p.oldPrice != null && Number(p.oldPrice) > 0 ? (
                        <span className="text-xs text-muted line-through">
                          {formatPrice(Number(p.oldPrice))}
                        </span>
                      ) : null}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <Link
                      href={`/urunler/${p.slug}`}
                      className="inline-flex h-9 items-center gap-1 border border-border bg-background px-3 text-xs font-semibold text-foreground transition-colors hover:border-sand hover:text-white"
                    >
                      <ExternalLinkIcon className="h-3.5 w-3.5" aria-hidden="true" />
                      Önizle
                    </Link>
                    <button
                      type="button"
                      onClick={() => openEdit(p)}
                      className="inline-flex h-9 w-9 items-center justify-center border border-border bg-background text-foreground transition-colors hover:border-sand hover:text-white"
                      aria-label="Düzenle"
                    >
                      <PencilIcon className="h-4 w-4" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => openDelete(p)}
                      className="inline-flex h-9 w-9 items-center justify-center border border-border bg-background text-foreground transition-colors hover:border-brand-red hover:text-brand-red"
                      aria-label="Sil"
                    >
                      <Trash2Icon className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              ))
            )
          ) : (
            // Convex bağlı değilse yerleşik ürünleri göster
            <BuiltInProducts />
          )}
        </div>
      </div>

      {/* Modal */}
      {editing && editing.mode !== "delete" ? (
        <ProductFormModal
          form={form}
          setForm={setForm}
          onSubmit={handleSubmit}
          onClose={close}
          isEdit={editing.mode === "edit"}
          saving={saving}
          error={message?.type === "error" ? message.text : null}
          autoSlugFromName={autoSlugFromName}
        />
      ) : null}

      {/* Silme onayı */}
      {editing && editing.mode === "delete" ? (
        <DeleteConfirmModal
          name={editing.name}
          onConfirm={confirmDelete}
          onClose={close}
          saving={saving}
        />
      ) : null}
    </div>
  );
}

function ProductFormModal({
  form,
  setForm,
  onSubmit,
  onClose,
  isEdit,
  saving,
  error,
  autoSlugFromName,
}: {
  form: FormState;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
  isEdit: boolean;
  saving: boolean;
  error: string | null;
  autoSlugFromName: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 px-4 py-6 sm:items-center"
      onClick={onClose}
    >
      <form
        onSubmit={onSubmit}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl border border-border bg-surface shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-3">
          <h2 className="font-heading text-lg font-bold text-white">
            {isEdit ? "Ürünü Düzenle" : "Yeni Ürün"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-muted hover:text-white"
            aria-label="Kapat"
          >
            <XIcon className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        <div className="grid max-h-[70vh] gap-4 overflow-y-auto p-5 sm:grid-cols-2">
          <label className="block text-sm font-semibold text-foreground sm:col-span-2">
            İsim
            <input
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              onBlur={() => !isEdit && autoSlugFromName()}
              className="mt-1.5 w-full border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-sand focus:outline-none"
            />
          </label>
          <label className="block text-sm font-semibold text-foreground">
            Slug
            <input
              required
              value={form.slug}
              onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
              disabled={isEdit}
              className="mt-1.5 w-full border border-border bg-background px-3 py-2 font-mono text-sm text-foreground focus:border-sand focus:outline-none disabled:opacity-50"
            />
          </label>
          <label className="block text-sm font-semibold text-foreground">
            Kategori
            <select
              value={form.category}
              onChange={(e) =>
                setForm((f) => ({ ...f, category: e.target.value }))
              }
              className="mt-1.5 w-full border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-sand focus:outline-none"
            >
              {CATEGORIES.map((c) => (
                <option key={c.key} value={c.key}>
                  {c.label}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm font-semibold text-foreground">
            Marka
            <input
              value={form.brand}
              onChange={(e) => setForm((f) => ({ ...f, brand: e.target.value }))}
              className="mt-1.5 w-full border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-sand focus:outline-none"
            />
          </label>
          <label className="block text-sm font-semibold text-foreground">
            Model
            <input
              value={form.model}
              onChange={(e) => setForm((f) => ({ ...f, model: e.target.value }))}
              className="mt-1.5 w-full border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-sand focus:outline-none"
            />
          </label>
          <label className="block text-sm font-semibold text-foreground">
            Fiyat (₺)
            <input
              required
              type="number"
              min={0}
              step={0.01}
              value={form.price}
              onChange={(e) =>
                setForm((f) => ({ ...f, price: Number(e.target.value) }))
              }
              className="mt-1.5 w-full border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-sand focus:outline-none"
            />
          </label>
          <label className="block text-sm font-semibold text-foreground">
            Eski fiyat (₺, opsiyonel)
            <input
              type="number"
              min={0}
              step={0.01}
              value={form.oldPrice ?? ""}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  oldPrice:
                    e.target.value === "" ? null : Number(e.target.value),
                }))
              }
              className="mt-1.5 w-full border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-sand focus:outline-none"
            />
          </label>
          <label className="block text-sm font-semibold text-foreground sm:col-span-2">
            Görsel URL
            <input
              value={form.image}
              onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
              placeholder="/media/products/..."
              className="mt-1.5 w-full border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-sand focus:outline-none"
            />
            <ImageUploadButton
              onUploaded={(url) => setForm((f) => ({ ...f, image: url }))}
              label="Ana görsel yükle"
            />
            {form.image ? (
              <AdminImagePreview src={form.image} alt={form.name || "Ürün görseli"} />
            ) : null}
          </label>
          <label className="block text-sm font-semibold text-foreground sm:col-span-2">
            Galeri (satır başına bir URL)
            <textarea
              value={form.galleryText}
              onChange={(e) =>
                setForm((f) => ({ ...f, galleryText: e.target.value }))
              }
              rows={3}
              className="mt-1.5 w-full border border-border bg-background px-3 py-2 font-mono text-sm text-foreground focus:border-sand focus:outline-none"
            />
            <ImageUploadButton
              onUploaded={(url) =>
                setForm((f) => ({
                  ...f,
                  galleryText: f.galleryText.trim()
                    ? `${f.galleryText.trim()}\n${url}`
                    : url,
                }))
              }
              label="Galeriye ekle"
            />
            {form.galleryText.trim() ? (
              <div className="mt-2 flex flex-wrap gap-2">
                {form.galleryText
                  .split("\n")
                  .map((line) => line.trim())
                  .filter(Boolean)
                  .map((url) => (
                    <AdminImagePreview
                      key={url}
                      src={url}
                      alt="Galeri"
                      compact
                    />
                  ))}
              </div>
            ) : null}
          </label>
          <fieldset className="space-y-3 border border-border bg-background/40 p-4 sm:col-span-2">
            <legend className="px-1 text-sm font-bold text-foreground">
              Renk görselleri
            </legend>
            <p className="text-xs text-muted">
              Her renk için görsel URL girin. Konfigüratör ve ürün sayfasında
              kullanılır.
            </p>
            {form.colors.map((color, index) => (
              <div
                key={`color-${index}`}
                className="grid gap-3 border border-border/60 p-3 sm:grid-cols-[1fr_7rem_1fr_auto]"
              >
                <label className="block text-xs font-semibold text-foreground">
                  Renk adı
                  <input
                    value={color.name}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        colors: f.colors.map((c, i) =>
                          i === index ? { ...c, name: e.target.value } : c
                        ),
                      }))
                    }
                    className="mt-1 w-full border border-border bg-background px-2 py-1.5 text-sm"
                  />
                </label>
                <label className="block text-xs font-semibold text-foreground">
                  Hex
                  <input
                    value={color.hex}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        colors: f.colors.map((c, i) =>
                          i === index ? { ...c, hex: e.target.value } : c
                        ),
                      }))
                    }
                    className="mt-1 w-full border border-border bg-background px-2 py-1.5 font-mono text-sm"
                  />
                </label>
                <label className="block text-xs font-semibold text-foreground sm:col-span-1">
                  Görsel URL
                  <input
                    value={color.image}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        colors: f.colors.map((c, i) =>
                          i === index ? { ...c, image: e.target.value } : c
                        ),
                      }))
                    }
                    placeholder="/media/..."
                    className="mt-1 w-full border border-border bg-background px-2 py-1.5 font-mono text-sm"
                  />
                  <ImageUploadButton
                    onUploaded={(url) =>
                      setForm((f) => ({
                        ...f,
                        colors: f.colors.map((c, i) =>
                          i === index ? { ...c, image: url } : c
                        ),
                      }))
                    }
                    label="Yükle"
                  />
                </label>
                <div className="flex items-end gap-2">
                  {color.image ? (
                    <AdminImagePreview
                      src={color.image}
                      alt={color.name}
                      compact
                    />
                  ) : (
                    <span
                      className="mb-1 inline-block h-14 w-14 border border-border bg-background"
                      style={{ backgroundColor: color.hex }}
                      aria-hidden="true"
                    />
                  )}
                  <button
                    type="button"
                    onClick={() =>
                      setForm((f) => ({
                        ...f,
                        colors: f.colors.filter((_, i) => i !== index),
                      }))
                    }
                    className="mb-1 inline-flex h-9 w-9 items-center justify-center border border-border text-muted hover:border-brand-red hover:text-brand-red"
                    aria-label={`${color.name || "Renk"} sil`}
                  >
                    <Trash2Icon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                setForm((f) => ({
                  ...f,
                  colors: [
                    ...f.colors,
                    { name: "", hex: "#888888", image: "" },
                  ],
                }))
              }
              className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-sand hover:text-white"
            >
              <PlusIcon className="h-3.5 w-3.5" />
              Renk ekle
            </button>
          </fieldset>
          <label className="block text-sm font-semibold text-foreground sm:col-span-2">
            Açıklama
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              rows={3}
              className="mt-1.5 w-full border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-sand focus:outline-none"
            />
          </label>
          <label className="block text-sm font-semibold text-foreground sm:col-span-2">
            Özellikler (satır başına bir madde)
            <textarea
              value={form.featuresText}
              onChange={(e) =>
                setForm((f) => ({ ...f, featuresText: e.target.value }))
              }
              rows={4}
              className="mt-1.5 w-full border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-sand focus:outline-none"
            />
          </label>
          <label className="block text-sm font-semibold text-foreground sm:col-span-2">
            Rozet (ör: &quot;%35 İndirim&quot;)
            <input
              value={form.badge}
              onChange={(e) => setForm((f) => ({ ...f, badge: e.target.value }))}
              className="mt-1.5 w-full border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-sand focus:outline-none"
            />
          </label>
          <label className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
            <input
              type="checkbox"
              checked={form.inStock}
              onChange={(e) =>
                setForm((f) => ({ ...f, inStock: e.target.checked }))
              }
              className="h-4 w-4 accent-brand-red"
            />
            Stokta var
          </label>
          <label className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) =>
                setForm((f) => ({ ...f, isActive: e.target.checked }))
              }
              className="h-4 w-4 accent-brand-red"
            />
            Sitede aktif
          </label>
          {error ? (
            <p
              role="alert"
              className="sm:col-span-2 border border-brand-red/30 bg-brand-red/5 px-3 py-2 text-xs font-semibold text-brand-red"
            >
              {error}
            </p>
          ) : null}
        </div>
        <div className="flex items-center justify-end gap-2 border-t border-border bg-background px-5 py-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-muted hover:text-white"
          >
            İptal
          </button>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 bg-brand-red px-5 py-2 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-brand-red-dark disabled:opacity-60"
          >
            {saving ? (
              <>
                <LoaderIcon
                  className="h-3.5 w-3.5 animate-spin"
                  aria-hidden="true"
                />
                Kaydediliyor
              </>
            ) : isEdit ? (
              "Güncelle"
            ) : (
              "Oluştur"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

function DeleteConfirmModal({
  name,
  onConfirm,
  onClose,
  saving,
}: {
  name: string;
  onConfirm: () => void;
  onClose: () => void;
  saving: boolean;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 px-4 py-6 sm:items-center"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md border border-border bg-surface p-6 shadow-2xl"
      >
        <h2 className="font-heading text-lg font-bold text-white">
          Ürünü sil
        </h2>
        <p className="mt-2 text-sm text-muted">
          <strong className="text-white">{name}</strong> adlı ürünü silmek
          istediğinize emin misiniz? Bu işlem geri alınamaz.
        </p>
        <div className="mt-5 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-muted hover:text-white"
          >
            Vazgeç
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={saving}
            className="inline-flex items-center gap-2 bg-brand-red px-5 py-2 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-brand-red-dark disabled:opacity-60"
          >
            {saving ? (
              <>
                <LoaderIcon
                  className="h-3.5 w-3.5 animate-spin"
                  aria-hidden="true"
                />
                Siliniyor
              </>
            ) : (
              <>
                <Trash2Icon className="h-3.5 w-3.5" aria-hidden="true" />
                Evet, sil
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function BuiltInProducts() {
  // Convex bağlı değilken yerleşik products.ts listesini salt okunur göster
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { products } = require("@/lib/products") as {
    products: Array<{
      slug: string;
      name: string;
      brand: string;
      model: string;
      category: string;
      price: number;
      oldPrice?: number;
      image: string;
      badge?: string;
    }>;
  };

  return (
    <div>
      {products.map((p) => (
        <div
          key={p.slug}
          className="flex flex-col items-start gap-4 px-5 py-4 sm:flex-row sm:items-center"
        >
          <div className="flex h-16 w-16 shrink-0 items-center justify-center bg-background text-muted">
            {p.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={p.image}
                alt={p.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <PackageIcon className="h-7 w-7" aria-hidden="true" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-heading text-sm font-bold text-white">
                {p.name}
              </h3>
              {p.badge ? (
                <span className="inline-flex items-center gap-1 bg-brand-red/10 px-2 py-0.5 text-[10px] font-bold uppercase text-brand-red">
                  <TagIcon className="h-3 w-3" aria-hidden="true" />
                  {p.badge}
                </span>
              ) : null}
            </div>
            <div className="mt-1 text-xs text-muted">
              <span className="font-mono">{p.slug}</span>
              <span className="mx-2">·</span>
              {CATEGORIES.find((c) => c.key === p.category)?.label ?? p.category}
            </div>
            <div className="mt-1.5 flex items-baseline gap-2 text-sm">
              <span className="font-bold text-white">
                {formatPrice(p.price)}
              </span>
              {p.oldPrice ? (
                <span className="text-xs text-muted line-through">
                  {formatPrice(p.oldPrice)}
                </span>
              ) : null}
            </div>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <Link
              href={`/urunler/${p.slug}`}
              className="inline-flex h-9 items-center gap-1 border border-border bg-background px-3 text-xs font-semibold text-foreground transition-colors hover:border-sand hover:text-white"
            >
              <ExternalLinkIcon className="h-3.5 w-3.5" aria-hidden="true" />
              Önizle
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}

function AdminImagePreview({
  src,
  alt,
  compact = false,
}: {
  src: string;
  alt: string;
  compact?: boolean;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={
        compact
          ? "h-14 w-14 shrink-0 border border-border object-cover"
          : "mt-2 h-32 w-full max-w-xs border border-border object-cover"
      }
      onError={(e) => {
        e.currentTarget.classList.add("opacity-40");
      }}
    />
  );
}
