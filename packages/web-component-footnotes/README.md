## Accessible footnotes Web Components

This package provides a framework-agnostic implementation of your accessible footnotes pattern as Web Components.

- `<a11y-footnote-ref>` marks inline text as a footnote reference and carries the note body.
- `<a11y-footnotes>` automatically renders a list of all registered notes in reading order, with proper semantics and backlinks.

### Usage

Include the script (bundled build) and define the components:

```html
<script type="module">
  import { defineAccessibleFootnotes } from "./dist/index.js";

  defineAccessibleFootnotes();
</script>
```

Then author your content:

```html
<article>
  <p>
    Something about
    <a11y-footnote-ref
      note="CSS counters are, in essence, variables maintained by CSS whose values may be incremented by CSS rules."
    >
      CSS counters
    </a11y-footnote-ref>
    that deserves a footnote.
  </p>

  <a11y-footnotes></a11y-footnotes>
</article>
```

The reference is rendered as an anchor with:

- `role="doc-noteref"`
- `href` pointing to its note in the list
- `aria-describedby="footnotes-label"` so assistive tech recognizes it as a footnote reference
- `data-a11y-footnotes="ref"` as a hook for your own logic or styles

```html
<a
  href="#footenote-1"
  role="doc-noteref"
  aria-describedby="footnotes-label"
  data-a11y-footnotes="ref"
>
  content of the link here
</a>
```

The list is rendered as:

- `<footer role="doc-endnotes" data-a11y-footnotes="footer">`
- `<h2 id="footnotes-label" data-a11y-footnotes="title">Footnotes</h2>`
- `<ol data-a11y-footnotes="list">` with `<li id="footnote-N" data-a11y-footnotes="item">` items containing the note text and a backlink:
  - `<a href="#footnote-ref-N" role="doc-backlink" aria-label="Back to reference N" data-a11y-footnotes="back-link">↩</a>`

```html
<footer role="doc-endnotes" data-a11y-footnotes="footer">
  <h2 id="footnotes-label" data-a11y-footnotes="title">Footnotes</h2>
  <ol data-a11y-footnotes="list">
    <li id="footnote-1" data-a11y-footnotes="item">
      Actual footnote here
      <a
        href="#footnote-ref-1"
        role="doc-backlink"
        aria-label="Back to reference 1"
        data-a11y-footnotes="back-link"
        >↩</a
      >
    </li>
  </ol>
</footer>
```

### Styling and counters

The library does not enforce styling, but the demo page includes a minimal CSS setup following the original “Accessible Footnotes with CSS” article:

- An `article` with `counter-reset: footnotes`.
- References (`a[role="doc-noteref"]`) increment the `footnotes` counter.
- Superscript markers are generated with `::after { content: "[" counter(footnotes) "]"; }`.
- `footer :target` is highlighted so the active note is visually obvious.

You can copy or adapt these styles to fit your design system.

### Accessibility

This implementation mirrors the semantics described in your articles and React/Eleventy libraries:

- DPUB roles: `doc-noteref`, `doc-endnotes`, `doc-backlink`.
- Descriptive heading for the footnotes section linked via `aria-describedby`.
- Backlinks from each note to its originating reference for easy keyboard and screen reader navigation.
