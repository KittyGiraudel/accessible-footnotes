export interface FootnoteRegistration {
  index: number
  note: string
  noteId: string
  refId: string
  element: HTMLElement
}

type Listener = () => void

class FootnotesRegistry {
  private notes: FootnoteRegistration[] = []
  private listeners: Set<Listener> = new Set()

  registerRef(element: HTMLElement, note: string): FootnoteRegistration {
    const existing = this.notes.find(entry => entry.element === element)
    if (existing) {
      existing.note = note
      this.notify()
      return existing
    }

    const index = this.notes.length + 1
    const noteId = `footnote-${index}`
    const refId = `footnote-ref-${index}`

    const registration: FootnoteRegistration = {
      index,
      note,
      noteId,
      refId,
      element,
    }

    this.notes.push(registration)
    this.notify()
    return registration
  }

  unregisterRef(element: HTMLElement): void {
    const beforeLength = this.notes.length
    this.notes = this.notes.filter(entry => entry.element !== element)
    if (this.notes.length !== beforeLength) {
      this.reindex()
      this.notify()
    }
  }

  getNotes(): FootnoteRegistration[] {
    return [...this.notes]
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }

  clear(): void {
    if (this.notes.length === 0) return
    this.notes = []
    this.notify()
  }

  private notify(): void {
    for (const listener of this.listeners) {
      listener()
    }
  }

  private reindex(): void {
    this.notes = this.notes.map((entry, i) => {
      const index = i + 1
      return {
        ...entry,
        index,
        noteId: `footnote-${index}`,
        refId: `footnote-ref-${index}`,
      }
    })
  }
}

export const footnotesRegistry = new FootnotesRegistry()
