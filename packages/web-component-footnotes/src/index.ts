import { A11yFootnoteRef } from "./a11y-footnote-ref.js";
import { A11yFootnotes } from "./a11y-footnotes.js";

export { footnotesRegistry } from "./footnotes-registry.js";
export { A11yFootnoteRef, A11yFootnotes };

export function defineAccessibleFootnotes(): void {
  if (!customElements.get("a11y-footnote-ref")) {
    customElements.define("a11y-footnote-ref", A11yFootnoteRef);
  }
  if (!customElements.get("a11y-footnotes")) {
    customElements.define("a11y-footnotes", A11yFootnotes);
  }
}

