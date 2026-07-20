import { Fragment, type ReactNode } from "react";

/**
 * Render a string with two kinds of line-break markers:
 *   "\n" → `.soft-br`   (default break; CSS may collapse it to a natural wrap)
 *   "||" → `.mobile-br` (break shown on mobile only; hidden on wider screens)
 * Author copy keeps a trailing space before each marker so text rejoins cleanly
 * when a break is collapsed.
 */
export function withBreaks(text: string): ReactNode {
  if (!text.includes("\n") && !text.includes("||")) return text;
  const tokens = text.split(/(\n|\|\|)/);
  return tokens.map((tok, i) => {
    if (tok === "\n") return <br key={i} className="soft-br" />;
    if (tok === "||") return <br key={i} className="mobile-br" />;
    return <Fragment key={i}>{tok}</Fragment>;
  });
}
