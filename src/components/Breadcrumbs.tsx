import Link from "next/link";
import { ArrowRight } from "@/components/Icons";

export interface Crumb {
  label: string;
  href?: string;
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <ol>
        {items.map((c, i) => (
          <li key={i}>
            {c.href && i < items.length - 1 ? (
              <Link href={c.href}>{c.label}</Link>
            ) : (
              <span aria-current="page">{c.label}</span>
            )}
            {i < items.length - 1 && <ArrowRight width={12} height={12} className="breadcrumbs__sep" />}
          </li>
        ))}
      </ol>
    </nav>
  );
}
