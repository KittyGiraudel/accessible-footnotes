// Import the original mapper
import BaseStyles from '@site/src/components/BaseStyles'
import MDXComponents from '@theme-original/MDXComponents'
import { FootnoteRef } from 'react-a11y-footnotes'

export default {
  // Re-use the default mapping
  ...MDXComponents,
  FootnoteRef,
  BaseStyles,
}
