import type { SidebarsConfig } from '@docusaurus/plugin-content-docs'

const sidebars: SidebarsConfig = {
  docs: [
    {
      type: 'category',
      label: 'General',
      items: [
        'general/introduction',
        'general/guidelines',
        'general/terminology',
        'general/choosing-an-implementation',
      ],
    },
    {
      type: 'category',
      label: 'React component',
      items: ['react/overview', 'react/usage', 'react/api', 'react/styling', 'react/advanced'],
    },
    {
      type: 'category',
      label: 'Eleventy plugin',
      items: [
        'eleventy/overview',
        'eleventy/api',
        'eleventy/usage',
        'eleventy/styling',
        'eleventy/limitations',
      ],
    },
    {
      type: 'category',
      label: 'Web component',
      items: ['web-component/overview', 'web-component/usage', 'web-component/frameworks'],
    },
  ],
}

export default sidebars
