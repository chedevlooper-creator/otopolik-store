"use client";

import { buildWhatsAppOrderLink } from "@/lib/site-config";

export default function WhatsappFloat() {
  const href = buildWhatsAppOrderLink("Merhaba, oto paspası hakkında bilgi almak istiyorum.");

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp ile iletişime geç"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-2xl text-white shadow-lg shadow-black/20 transition-transform hover:scale-105"
    >
      💬
    </a>
  );
}
