import Image from "next/image";
import type { Locale } from "@/lib/i18n";
import { getDict } from "@/content/dictionaries";
import { withBreaks } from "@/lib/text";
import { Reveal } from "@/components/Reveal";
import { founderPhotos } from "@/content/media";
import { siteConfig } from "@/content/config";
import { Instagram } from "@/components/Icons";

export function Founders({ locale }: { locale: Locale }) {
  const dict = getDict(locale);
  const t = dict.founders;

  // OWNER: replace `instagram` with each founder's personal profile URL.
  // Falls back to the brand profile until personal handles are provided.
  const people = [
    { ...t.viktor, photo: founderPhotos[0], instagram: siteConfig.instagram },
    { ...t.andriy, photo: founderPhotos[1], instagram: siteConfig.instagram },
  ];

  return (
    <section className="section section--tint founders" id="about">
      <div className="container">
        <div className="section-head section-head--center founders-head">
          <Reveal as="span" className="eyebrow">
            {t.eyebrow}
          </Reveal>
          <Reveal as="h2" delay={0.08} className="founders-title">
            {t.title}
          </Reveal>
          <Reveal as="p" delay={0.16} className="lead founders-lead">
            {withBreaks(t.text)}
          </Reveal>
        </div>

        <div className="founders-people">
          {people.map((p, i) => (
            <Reveal
              key={p.name}
              as="article"
              className="founder-card"
              scale
              delay={0.3 + i * 0.15}
            >
              <div className="founder-card__media">
                <Image
                  src={p.photo}
                  alt={p.name}
                  width={848}
                  height={960}
                  className="founder-card__img"
                  sizes="(max-width: 640px) 100vw, (max-width: 991px) 50vw, 560px"
                />
              </div>
              <div className="founder-card__panel">
                <div className="founder-card__info">
                  <div className="founder-card__head">
                    <strong className="founder-card__name">{p.name}</strong>
                    <span className="founder-card__role">{p.role}</span>
                  </div>
                  <p className="founder-card__bio">{p.bio}</p>
                </div>
                <a
                  className="founder-card__ig"
                  href={p.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${p.name} · Instagram`}
                >
                  <Instagram width={22} height={22} aria-hidden />
                </a>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
