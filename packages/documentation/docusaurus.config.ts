import type * as Preset from '@docusaurus/preset-classic'
import type { Config } from '@docusaurus/types'

const config: Config = {
  title: 'Accessible Footnotes',
  tagline: 'Shared docs for all accessible footnotes implementations',
  url: 'https://accessible-footnotes.netlify.app/',
  baseUrl: '/',
  favicon: 'img/favicon.ico',
  organizationName: 'KittyGiraudel',
  projectName: 'accessible-footnotes',
  onBrokenLinks: 'throw',
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },
  themeConfig: {
    navbar: {
      title: 'Accessible Footnotes',
      items: [
        {
          href: 'https://github.com/KittyGiraudel/accessible-footnotes',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
  },
  presets: [
    [
      'classic',
      {
        docs: {
          routeBasePath: '/',
          sidebarPath: require.resolve('./sidebars.ts'),
        },
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      } satisfies Preset.Options,
    ],
  ],
}

export default config
