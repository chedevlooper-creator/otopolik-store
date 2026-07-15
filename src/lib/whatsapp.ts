/** WhatsApp deep-link helper (server + client safe). */
export function buildWhatsAppLink(whatsappNumber: string, message: string) {
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}
