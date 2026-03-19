import CodeBlock from '@theme/CodeBlock'

const STYLES = `
/**
 * 1. Initialiazing a \`footnotes\` counter on the content wrapper.
 *    \`body\` can be used if there is only one such wrapper per page
 *    otherwise something more specific should be used.
 * 
 * @note: feel free to come up with a better selector for your case
 */
body {
  counter-reset: footnotes; /* 1 */
}

/**
 * 1. Highlight the targeted footnote
 *
 * @note: feel free to come up with a better selector for your case
 */
li:has([role="doc-backlink"]):target {
  background-color: #ffa; /* 1 */
}

/**
 * 1. Visually make the back links a little smaller
 */
[role="doc-backlink"] {
  font-size: 80%; /* 1 */
}

/**
 * Inline footnotes references
 * 1. Increment the counter at each new reference
 * 2. Reset link styles to make it appear like regular text
 */
[role="doc-noteref"] {
  counter-increment: footnotes; /* 1 */
  text-decoration: none; /* 2 */
  color: inherit; /* 2 */
  cursor: default; /* 2 */
  outline: none; /* 2 */
}

/**
 * Actual numbered references
 * 1. Display the current state of the counter (e.g. \`[1]\`)
 * 2. Align text as superscript
 * 3. Make the number smaller (since it’s superscript)
 * 4. Slightly offset the number from the text
 * 5. Reset link styles on the number to show it's usable
 */
[role="doc-noteref"]::after {
  content: "[" counter(footnotes) "]"; /* 1 */
  vertical-align: super; /* 2 */
  font-size: 50%; /* 3 */
  margin-left: 2px; /* 4 */
  color: blue; /* 5 */
  text-decoration: underline; /* 5 */
  cursor: pointer; /* 5 */
}

/**
 * 1. Reseting the default focused styles on the number
 */
[role="doc-noteref"]:focus::after {
  outline: thin dotted; /* 1 */
  outline-offset: 2px; /* 1 */
}
`

export default function BaseStyles() {
  return (
    <div>
      <CodeBlock language="css" title="Core styles" showLineNumbers>
        {STYLES}
      </CodeBlock>
    </div>
  )
}
