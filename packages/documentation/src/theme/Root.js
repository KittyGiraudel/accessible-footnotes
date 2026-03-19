import { FootnotesProvider } from 'react-a11y-footnotes'

export default function Root({ children }) {
  return <FootnotesProvider>{children}</FootnotesProvider>
}
