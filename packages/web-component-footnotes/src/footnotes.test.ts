import { beforeEach, describe, expect, it } from 'vitest'
import { A11yFootnoteRef } from './a11y-footnote-ref.js'
import { A11yFootnotes } from './a11y-footnotes.js'
import { footnotesRegistry } from './footnotes-registry.js'

customElements.define('a11y-footnote-ref', A11yFootnoteRef)
customElements.define('a11y-footnotes', A11yFootnotes)

describe('The web component', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
    footnotesRegistry.clear()
  })

  it('registers references and renders footnotes in order', () => {
    document.body.innerHTML = `
      <article>
        <p>
          <a11y-footnote-ref note="First note">First</a11y-footnote-ref>
          <a11y-footnote-ref note="Second note">Second</a11y-footnote-ref>
        </p>
        <a11y-footnotes></a11y-footnotes>
      </article>
    `

    const notes = footnotesRegistry.getNotes()
    expect(notes).toHaveLength(2)
    expect(notes[0]?.note).toBe('First note')
    expect(notes[1]?.note).toBe('Second note')

    const list = document.querySelector('a11y-footnotes')
    expect(list).not.toBeNull()

    const footer = list!.querySelector('footer')
    expect(footer).not.toBeNull()

    const items = footer!.querySelectorAll('li')
    expect(items.length).toBe(2)
    expect(items[0]?.id).toBe('footnote-1')
    expect(items[1]?.id).toBe('footnote-2')
  })

  it('links references and notes with matching ids and roles', () => {
    document.body.innerHTML = `
      <article>
        <p>
          <a11y-footnote-ref note="A note">Label</a11y-footnote-ref>
        </p>
        <a11y-footnotes></a11y-footnotes>
      </article>
    `

    const refAnchor = document.querySelector('a[role="doc-noteref"]')
    expect(refAnchor).not.toBeNull()

    const href = refAnchor!.getAttribute('href')
    expect(href).toBe('#footnote-1')

    const noteItem = document.getElementById('footnote-1')
    expect(noteItem).not.toBeNull()

    const backlink = noteItem!.querySelector('a[role="doc-backlink"]')
    expect(backlink).not.toBeNull()
    expect(backlink!.getAttribute('href')).toBe(`#${refAnchor!.id}`)
  })

  it('is a noop when footnote ref has no note', () => {
    document.body.innerHTML = `
      <article>
        <p>
          <a11y-footnote-ref>Label without note</a11y-footnote-ref>
        </p>
        <a11y-footnotes id="footnotes-label"></a11y-footnotes>
      </article>
    `

    const notes = footnotesRegistry.getNotes()
    expect(notes).toHaveLength(0)

    // No generated reference anchor
    const refAnchor = document.querySelector('a[role="doc-noteref"]')
    expect(refAnchor).toBeNull()

    // Fallback content remains as-is
    const refElement = document.querySelector('a11y-footnote-ref')
    expect(refElement?.textContent?.trim()).toBe('Label without note')
  })

  it('does not render a footer when there are no footnote refs', () => {
    document.body.innerHTML = `
      <article>
        <p>Some content without any footnote reference.</p>
        <a11y-footnotes></a11y-footnotes>
      </article>
    `

    const list = document.querySelector('a11y-footnotes')
    expect(list).not.toBeNull()

    const footer = list!.querySelector('footer')
    expect(footer).toBeNull()
  })

  it('handles HTML content inside the footnote ref', () => {
    document.body.innerHTML = `
      <article>
        <p>
          <a11y-footnote-ref note="HTML note"><strong>Bold</strong> and <em>emphasis</em></a11y-footnote-ref>
        </p>
        <a11y-footnotes></a11y-footnotes>
      </article>
    `

    const refAnchor = document.querySelector('a[role="doc-noteref"]')
    expect(refAnchor).not.toBeNull()

    // Inner HTML is flattened to text content, which is acceptable here
    expect(refAnchor!.textContent).toBe('Bold and emphasis')

    const notes = footnotesRegistry.getNotes()
    expect(notes).toHaveLength(1)
    expect(notes[0]?.note).toBe('HTML note')
  })
})
