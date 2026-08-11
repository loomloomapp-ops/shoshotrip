import Image from "next/image";
import type { Locale } from "@/lib/i18n";
import { getDict } from "@/content/dictionaries";
import { withBreaks } from "@/lib/text";
import { Reveal } from "@/components/Reveal";
import { siteConfig } from "@/content/config";
import { Instagram } from "@/components/Icons";
import { FounderStory } from "@/components/FounderStory";
import { team, memberStory } from "@/content/team";
import { loc } from "@/content/tours";

export function Founders({ locale }: { locale: Locale }) {
  const dict = getDict(locale);
  const t = dict.founders;

  /* People come from data/team.json (admin-editable). A member without a
     personal Instagram falls back to the brand account. */
  const people = team.map((m) => ({
    id: m.id,
    name: loc(m.name, locale),
    role: loc(m.role, locale),
    bio: loc(m.bio, locale),
    story: memberStory(m, locale),
    photo: m.photo,
    focus: m.focus,
    instagram: m.instagram || siteConfig.instagram,
  }));

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
              key={p.id}
              as="article"
              className="founder-card"
              scale
              delay={0.3 + i * 0.15}
            >
              <div className="founder-card__media">
                {/* `fill` rather than fixed dimensions: the two photos have
                    different aspect ratios and the frame crops them anyway. */}
                <Image
                  src={p.photo}
                  alt={p.name}
                  fill
                  className="founder-card__img"
                  style={{ objectPosition: p.focus }}
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
                  <FounderStory
                    paragraphs={p.story}
                    moreLabel={t.more}
                    lessLabel={t.less}
                  />
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
