import PropTypes from 'prop-types'
import React, { type PropsWithChildren } from 'react'

type BaseProps = PropsWithChildren<{ id?: string }>

type Footnote = {
  idRef: string
  idNote: string
  description: React.ReactNode
}

export interface FootnoteRefProps extends BaseProps {
  description: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

type FootnotesContextValue = {
  footnotes: Map<string, Footnote>
  footnotesTitleId: string
  getFootnoteRefId: (props: BaseProps) => string
  getFootnoteId: (props: BaseProps) => string
  register: (footnote: Footnote) => () => void
}

export interface FootnotesProviderProps extends PropsWithChildren {
  footnotesTitleId?: string
}

export interface TitleProps extends React.HTMLAttributes<HTMLElement> {
  id: string
}

export interface BackLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  'data-a11y-footnotes-back-link': true
  'aria-label': string
  role: 'doc-backlink'
}

export interface ListItemProps extends React.LiHTMLAttributes<HTMLLIElement> {
  id: string
  children: React.ReactNode
}

type WrapperComponent = React.ElementType<React.HTMLAttributes<HTMLElement>>
type TitleComponent = React.ElementType<TitleProps>
type ListComponent = React.ElementType<React.HTMLAttributes<HTMLElement>>
type ListItemComponent = React.ElementType<ListItemProps>
type BackLinkComponent = React.ElementType<BackLinkProps>

export interface FootnotesProps {
  Wrapper?: WrapperComponent
  Title?: TitleComponent
  List?: ListComponent
  ListItem?: ListItemComponent
  BackLink?: BackLinkComponent
}

type TreeNode = React.ReactNode

const defaultContextValue: FootnotesContextValue = {
  footnotes: new Map<string, Footnote>(),
  footnotesTitleId: '',
  getFootnoteRefId: () => '',
  getFootnoteId: () => '',
  register: () => () => undefined,
}

const FootnotesContext =
  React.createContext<FootnotesContextValue>(defaultContextValue)

export const FootnoteRef = (props: FootnoteRefProps): React.ReactElement => {
  const { description } = props
  const {
    footnotes,
    footnotesTitleId,
    getFootnoteRefId,
    getFootnoteId,
    register,
  } = React.useContext(FootnotesContext)
  const idRef = React.useMemo(
    () => getFootnoteRefId(props),
    [getFootnoteRefId, props]
  )
  const idNote = React.useMemo(
    () => getFootnoteId(props),
    [getFootnoteId, props]
  )
  const footnote = React.useMemo(
    () => ({ idRef, idNote, description }),
    [idRef, idNote, description]
  )

  // It is not possible to update the React state on the server, still the
  // footnote references need to be registered so the footnotes can be rendered.
  // In that case, we mutate the state directly so the footnotes work with SSR.
  if (!footnotes.has(footnote.idRef)) {
    footnotes.set(footnote.idRef, footnote)
  }

  // Once the application mounts, the footnotes state has been emptied and we
  // can properly register the current footnote in it, and unregister it if it
  // was to unmount.
  React.useEffect(() => {
    const unregister = register(footnote)

    return () => unregister()
  }, [register, footnote])

  return (
    <a
      className={props.className}
      style={props.style}
      id={idRef}
      href={`#${idNote}`}
      role='doc-noteref'
      aria-describedby={footnotesTitleId}
      data-a11y-footnotes-ref>
      {props.children}
    </a>
  )
}

FootnoteRef.propTypes = {
  description: PropTypes.node.isRequired,
  children: PropTypes.node.isRequired,
  id: PropTypes.string,
}

export const Footnotes = ({
  Wrapper = 'footer',
  Title = (props: TitleProps) => <h2 {...props}>Footnotes</h2>,
  List = 'ol',
  ListItem = 'li',
  BackLink = (props: BackLinkProps) => <a {...props}>↩</a>,
}: FootnotesProps): React.ReactElement | null => {
  const { footnotes, footnotesTitleId } = React.useContext(FootnotesContext)

  if (footnotes.size === 0) return null

  const references = Array.from(footnotes.values())

  return (
    <Wrapper data-a11y-footnotes-footer role='doc-endnotes'>
      <Title data-a11y-footnotes-title id={footnotesTitleId} />
      <List data-a11y-footnotes-list>
        {references.map(({ idNote, idRef, description }, index) => (
          <ListItem id={idNote} key={idNote} data-a11y-footnotes-list-item>
            {description}&nbsp;
            <BackLink
              data-a11y-footnotes-back-link
              href={`#${idRef}`}
              aria-label={`Back to reference ${index + 1}`}
              role='doc-backlink'
            />
          </ListItem>
        ))}
      </List>
    </Wrapper>
  )
}

export const FootnotesProvider = ({
  children,
  footnotesTitleId = 'footnotes-label',
}: FootnotesProviderProps): React.ReactElement => {
  const [footnotes, setFootnotes] = React.useState<Map<string, Footnote>>(
    new Map()
  )
  const getBaseId = React.useCallback(
    ({ id, children }: BaseProps) => id || getIdFromTree(children),
    []
  )
  const getFootnoteRefId = React.useCallback(
    (props: BaseProps) => `${getBaseId(props)}-ref`,
    [getBaseId]
  )
  const getFootnoteId = React.useCallback(
    (props: BaseProps) => `${getBaseId(props)}-note`,
    [getBaseId]
  )

  // When JavaScript kicks in and the application mounts, reset the footnotes
  // store which was mutated by every reference.
  React.useEffect(() => setFootnotes(new Map()), [])

  const register = React.useCallback((footnote: Footnote) => {
    setFootnotes(footnotes => {
      const clone = new Map(footnotes)
      if (!clone.has(footnote.idRef)) clone.set(footnote.idRef, footnote)
      return clone
    })

    // Return a function which can be used to unregister the footnote. This
    // makes it convenient to register a footnote reference on mount, and
    // unregister it on unmount.
    return () => {
      setFootnotes(footnotes => {
        const clone = new Map(footnotes)
        clone.delete(footnote.idRef)
        return clone
      })
    }
  }, [])

  return (
    <FootnotesContext.Provider
      value={{
        footnotes,
        footnotesTitleId,
        getFootnoteRefId,
        getFootnoteId,
        register,
      }}>
      {children}
    </FootnotesContext.Provider>
  )
}

function getTextFromTree(tree: TreeNode): string {
  let text = ''

  if (typeof tree === 'string') {
    text += tree
  } else if (typeof tree === 'number') {
    text += String(tree)
  } else if (Array.isArray(tree)) {
    text += tree.map(getTextFromTree).join('')
  } else if (React.isValidElement(tree)) {
    const { children } = tree.props as { children?: React.ReactNode }

    if (children) text += getTextFromTree(children)
  }

  return text
}

export function getIdFromTree(tree: TreeNode): string {
  return (
    getTextFromTree(tree)
      .toLowerCase()
      // Remove any character that is not a letter, a number, an hyphen or an
      // underscore, regardless of casing
      .replace(/[^a-z0-9-_\s]/g, '')
      // Replace all spaces with hyphens
      .replace(/\s+/g, '-')
  )
}
