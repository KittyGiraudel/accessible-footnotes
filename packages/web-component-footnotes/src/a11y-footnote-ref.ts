import type { FootnoteRegistration } from './footnotes-registry.js'
import { footnotesRegistry } from './footnotes-registry.js'

export class A11yFootnoteRef extends HTMLElement {
  static get observedAttributes() {
    return ['note']
  }

  private registration?: FootnoteRegistration
  private anchor?: HTMLAnchorElement

  connectedCallback(): void {
    this.render()
  }

  disconnectedCallback(): void {
    footnotesRegistry.unregisterRef(this)
  }

  attributeChangedCallback(name: string): void {
    if (name === 'note') this.render()
  }

  private get note(): string {
    const value = this.getAttribute('note') ?? ''
    return value.trim()
  }

  private ensureRegistration(): FootnoteRegistration | undefined {
    if (!this.note) return undefined
    this.registration = footnotesRegistry.registerRef(this, this.note)
    return this.registration
  }

  private render(): void {
    const registration = this.ensureRegistration()
    if (!registration) {
      this.innerHTML = this.textContent ?? ''
      return
    }

    const { noteId, refId } = registration
    const label = this.textContent?.trim()
    const anchor = this.anchor ?? (document.createElement('a') as HTMLAnchorElement)

    anchor.href = `#${noteId}`
    anchor.id = refId
    anchor.setAttribute('role', 'doc-noteref')
    anchor.setAttribute('data-a11y-footnotes', 'ref')
    anchor.setAttribute('aria-describedby', this.getLabelId())
    anchor.textContent = label

    this.anchor = anchor
    this.innerHTML = ''
    this.appendChild(anchor)
  }

  private getLabelId(): string {
    // @TODO: shall we cache this?
    const list = document.querySelector('a11y-footnotes')

    if (list instanceof HTMLElement && list.id && list.id.trim().length > 0) {
      return list.id.trim()
    }

    return 'footnotes-label'
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'a11y-footnote-ref': A11yFootnoteRef
  }
}
