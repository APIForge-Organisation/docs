import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'APIForge',
  description: 'API observability & intelligence — local-first, privacy-first',
  base: '/docs/',

  head: [
    ['link', { rel: 'icon', href: '/docs/favicon.ico' }],
    ['meta', { name: 'theme-color', content: '#0066FF' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'APIForge Docs' }],
    ['meta', { property: 'og:description', content: 'API observability SDK — local-first, privacy-first. Up and running in 5 minutes.' }],
  ],

  themeConfig: {
    logo: { light: '/logo-light.svg', dark: '/logo-dark.svg', alt: 'APIForge' },

    nav: [
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'Features', link: '/features/insights' },
      { text: 'API Reference', link: '/guide/configuration' },
      {
        text: 'v0.1.0',
        items: [
          { text: 'Changelog', link: 'https://github.com/APIForge-Organisation/sdk-nodejs/blob/main/CHANGELOG.md' },
          { text: 'npm', link: 'https://www.npmjs.com/package/apiforgejs' },
        ],
      },
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Getting Started',
          items: [
            { text: 'What is APIForge?', link: '/guide/what-is-apiforge' },
            { text: 'Quick Start', link: '/guide/getting-started' },
            { text: 'Configuration', link: '/guide/configuration' },
          ],
        },
        {
          text: 'Dashboard',
          items: [
            { text: 'Local Dashboard', link: '/guide/dashboard' },
          ],
        },
      ],
      '/features/': [
        {
          text: 'Features',
          items: [
            { text: 'Automatic Insights', link: '/features/insights' },
            { text: 'Health Score', link: '/features/health-score' },
            { text: 'Release Tracking', link: '/features/release-tracking' },
          ],
        },
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/APIForge-Organisation' },
      { icon: 'npm', link: 'https://www.npmjs.com/package/apiforgejs' },
    ],

    editLink: {
      pattern: 'https://github.com/APIForge-Organisation/docs/edit/main/docs/:path',
      text: 'Edit this page on GitHub',
    },

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2026 APIForge',
    },

    search: {
      provider: 'local',
    },
  },
})
