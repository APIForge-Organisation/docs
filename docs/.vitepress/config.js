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
      { text: 'API Reference', link: '/guide/api-reference' },
      {
        text: 'SDKs',
        items: [
          { text: 'Changelog (Node.js)', link: 'https://github.com/APIForge-Organisation/sdk-nodejs/blob/main/CHANGELOG.md' },
          { text: 'Changelog (Python)', link: 'https://github.com/APIForge-Organisation/sdk-python/blob/main/CHANGELOG.md' },
          { text: 'Changelog (PHP)', link: 'https://github.com/APIForge-Organisation/sdk-composer/blob/main/CHANGELOG.md' },
          { text: 'npm — apiforgejs', link: 'https://www.npmjs.com/package/apiforgejs' },
          { text: 'PyPI — apiforgepy', link: 'https://pypi.org/project/apiforgepy/' },
          { text: 'Packagist — apiforgephp', link: 'https://packagist.org/packages/apiforge/apiforgephp' },
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
            { text: 'API Reference', link: '/guide/api-reference' },
          ],
        },
        {
          text: 'Deployment',
          items: [
            { text: 'Local Dashboard', link: '/guide/dashboard' },
            { text: 'Cloud Mode', link: '/guide/cloud-mode' },
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
      { icon: { svg: '<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>PyPI</title><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-.535 2.636c2.11 0 3.532.478 4.181 1.072.649.593.787 1.377.787 2.206v4.073c0 .843-.638 1.56-1.48 1.56H9.027c-1.156 0-2.086.945-2.086 2.1v1.574H4.87c-.86 0-1.322-.614-1.322-1.574V7.18c0-2.473 2.107-4.544 7.917-4.544zm-.34 1.406c-.607 0-1.099.493-1.099 1.1s.492 1.099 1.099 1.099c.607 0 1.099-.492 1.099-1.1 0-.606-.492-1.099-1.1-1.099zm4.772 8.205v1.574c0 .96-.463 1.574-1.322 1.574h-2.07v1.574c0 1.156-.93 2.1-2.087 2.1H5.502c-.842 0-1.48-.717-1.48-1.56v-4.073c0-.829.138-1.613.787-2.206.649-.594 2.07-1.072 4.18-1.072 5.811 0 7.918 2.07 7.918 4.544v-.455zm-3.83 4.648c-.607 0-1.1.492-1.1 1.099s.493 1.099 1.1 1.099c.606 0 1.098-.492 1.098-1.1 0-.606-.492-1.098-1.099-1.098z"/></svg>' }, link: 'https://pypi.org/project/apiforgepy/' },
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
