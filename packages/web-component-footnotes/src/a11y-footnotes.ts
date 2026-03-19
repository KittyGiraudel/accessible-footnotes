import type { FootnoteRegistration } from './footnotes-registry.js'
import { footnotesRegistry } from './footnotes-registry.js'

const DEFAULT_LABEL_TEXT = 'Footnotes'

type Unsubscribe = () => void

export class A11yFootnotes extends HTMLElement {
  private unsubscribe: Unsubscribe | undefined

  connectedCallback(): void {
    this.unsubscribe = footnotesRegistry.subscribe(() => this.render())
    this.render()
  }

  disconnectedCallback(): void {
    if (this.unsubscribe) {
      this.unsubscribe()
      this.unsubscribe = undefined
    }
  }

  private get labelText(): string {
    const attr = this.getAttribute('label')

    if (attr && attr.trim().length > 0) {
      return attr.trim()
    }

    return DEFAULT_LABEL_TEXT
  }

  private getBacklinkLabel(index: number): string {
    const template = this.getAttribute('backlink-label') ?? 'Back to reference {{index}}'
    return template.replace('{{index}}', String(index))
  }

  private get labelId(): string {
    if (this.id && this.id.trim().length > 0) {
      return this.id.trim()
    }

    return 'footnotes-label'
  }

  private render(): void {
    const notes = footnotesRegistry.getNotes()

    if (notes.length === 0) {
      this.innerHTML = ''
      return
    }

    const footer = document.createElement('footer')
    footer.setAttribute('role', 'doc-endnotes')
    footer.setAttribute('data-a11y-footnotes', 'footer')

    const heading = document.createElement('h2')
    heading.id = this.labelId
    heading.textContent = this.labelText
    heading.setAttribute('data-a11y-footnotes', 'title')

    const list = document.createElement('ol')
    list.setAttribute('data-a11y-footnotes', 'list')

    for (const note of notes) {
      list.appendChild(this.renderNoteItem(note))
    }

    footer.appendChild(heading)
    footer.appendChild(list)

    this.innerHTML = ''
    this.appendChild(footer)
  }

  private renderNoteItem(note: FootnoteRegistration): HTMLElement {
    const item = document.createElement('li')
    item.id = note.noteId
    item.setAttribute('data-a11y-footnotes', 'item')

    const textNode = document.createTextNode(note.note)

    const backlink = document.createElement('a')
    backlink.href = `#${note.refId}`
    backlink.setAttribute('role', 'doc-backlink')
    backlink.setAttribute('aria-label', this.getBacklinkLabel(note.index))
    backlink.setAttribute('data-a11y-footnotes', 'back-link')
    backlink.textContent = '↩'

    item.appendChild(textNode)
    item.appendChild(document.createTextNode(' '))
    item.appendChild(backlink)

    return item
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'a11y-footnotes': A11yFootnotes
  }
}
