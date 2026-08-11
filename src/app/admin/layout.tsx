import type { Metadata } from "next";
import type { ReactNode } from "react";

/**
 * Root layout for the admin route.
 *
 * The website's own layout lives under `[lang]/` and carries the site fonts,
 * analytics, preloader and shared chrome — none of which belong in a content
 * tool. This keeps /admin a separate, minimal document.
 */
export const metadata: Metadata = {
  title: "Панель контенту — ShoSho Trip",
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="uk">
      <body>{children}</body>
    </html>
  );
}
