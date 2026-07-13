import { getSiteSettings } from "@/lib/site-settings";
import SettingsForm from "./SettingsForm";

export const dynamic = "force-dynamic";

export default async function AdminAyarlar() {
  const { settings, source } = await getSiteSettings();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-extrabold text-white sm:text-3xl">
          Site Ayarları
        </h1>
        <p className="mt-1 text-sm text-muted">
          İletişim bilgileri, kargo ücretleri ve işletme detaylarını güncelleyin.
        </p>
      </div>

      <SettingsForm initial={settings} dataSource={source} />

      {/* Uyarı kartı */}
      <div className="border border-amber-500/30 bg-amber-500/10 p-5">
        <h3 className="font-heading text-sm font-bold text-amber-400">
          Yayına almadan önce mutlaka güncelleyin
        </h3>
        <ul className="mt-2 space-y-1 text-xs text-amber-400">
          <li>• Gerçek telefon ve WhatsApp numaranızı girin — siparişler buradan iletilecek.</li>
          <li>• Kargo eşiği ve ücretini güncel piyasa koşullarına göre belirleyin.</li>
          <li>• İşletme adresinizi doğru ve eksiksiz yazın.</li>
          <li>• Gizlilik ve mesafeli satış sözleşmesi metinlerini hukuki danışmanınıza onaylatın.</li>
        </ul>
      </div>
    </div>
  );
}
