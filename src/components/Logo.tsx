/**
 * ShoSho Trip logo. The artwork is a single-colour SVG (black on transparent);
 * it is recoloured with a CSS mask + `background-color: currentColor`, so the
 * mark inherits the surrounding text colour — white over the hero, dark once
 * the header goes solid, light on the dark footer.
 *   variant="wordmark" → "SHO SHO TRIP" lockup (header)
 *   variant="full"     → "SHO SHO" emblem (footer)
 */
export function Logo({
  light = false,
  variant = "wordmark",
}: {
  light?: boolean;
  variant?: "wordmark" | "full";
}) {
  const src = variant === "full" ? "/logo-full.svg" : "/logo-wordmark.svg";
  return (
    <span
      className={`logo logo--${variant}${light ? " logo--light" : ""}`}
      style={{ ["--logo-src" as string]: `url(${src})` }}
      role="img"
      aria-label="ShoSho Trip"
    />
  );
}
