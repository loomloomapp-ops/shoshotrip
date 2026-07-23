/**
 * Central brand + contact configuration.
 * OWNER: replace values here (and in .env.local) before production.
 */
export const siteConfig = {
  brand: "ShoSho Trip",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://shoshotrip.com",

  phoneDisplay: "+380 67 147 00 07",
  phoneHref: "tel:+380671470007",

  emailDisplay: "hi@shoshotrip.com",
  emailHref: "mailto:hi@shoshotrip.com",

  whatsapp: "https://wa.me/380671470007",
  telegram: "https://t.me/shoshotrip",
  telegramDisplay: "@shoshotrip",

  // Only the username is confirmed; owner must set the exact profile URL.
  instagramDisplay: "ShoSho.trip",
  instagram:
    process.env.NEXT_PUBLIC_INSTAGRAM_URL || "https://instagram.com/shosho.trip",

  // Prepayment share required to confirm a booking.
  prepaymentPercent: 30,

  // Legal entity placeholders — DO NOT invent. Owner replaces before launch.
  legal: {
    name: "[LEGAL_NAME]",
    taxId: "[TAX_ID]",
    address: "[REGISTERED_ADDRESS]",
    email: "[EMAIL]",
  },
} as const;

export type SocialLink = { key: string; href: string; label: string };

export const socialLinks: SocialLink[] = [
  { key: "instagram", href: siteConfig.instagram, label: "Instagram" },
  { key: "telegram", href: siteConfig.telegram, label: "Telegram" },
  { key: "whatsapp", href: siteConfig.whatsapp, label: "WhatsApp" },
];
