import type { Metadata } from "next";
import { AdminApp } from "./AdminApp";
import "./admin.css";

/**
 * Content panel, served as part of the static export at /admin/.
 *
 * It is deliberately kept out of the site's `[lang]` tree: it is not a page of
 * the website, it has no translations, and it must never be crawled.
 */
export const metadata: Metadata = {
  title: "Панель контенту — ShoSho Trip",
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminPage() {
  return <AdminApp />;
}
