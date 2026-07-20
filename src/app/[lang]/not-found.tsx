import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section notfound">
      <div className="container container--narrow notfound__inner">
        <span className="eyebrow">404</span>
        <h1>Сторінку не знайдено / Page not found</h1>
        <p className="lead">
          Можливо, маршрут змінився. Поверніться на головну або перегляньте тури.
          <br />
          The route may have changed. Head back home or browse the tours.
        </p>
        <div className="notfound__actions">
          <Link href="/" className="btn btn--primary">Головна / Home</Link>
          <Link href="/tours" className="btn btn--ghost">Тури / Tours</Link>
        </div>
      </div>
    </section>
  );
}
