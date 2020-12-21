const { description } = require('../../package')

module.exports = {
  /**
   * Ref：https://v1.vuepress.vuejs.org/config/#title
   */
  title: 'Blog of a little bao',
  /**
   * Ref：https://v1.vuepress.vuejs.org/config/#description
   */
  description: description,

  /**
   * Extra tags to be injected to the page HTML `<head>`
   *
   * ref：https://v1.vuepress.vuejs.org/config/#head
   */
  head: [
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }]
  ],
  /**
   * Theme option used to define the theme that a user use
   *    I use the reco theme
   */
  theme: 'reco',
  /**
   * Theme configuration. As we use the reco theme we need to use the options
   * related to this theme
   *
   * ref：https://vuepress-theme-reco.recoluan.com/en/views/1.x/blog.html
   */
  themeConfig: {
    blogConfig: {
      socialLinks: [
        { icon: 'reco-github', link: 'https://github.com/shigedangao' }
      ]
    }
  },
  // themeConfig: {
  //   repo: '',
  //   editLinks: false,
  //   docsDir: '',
  //   editLinkText: '',
  //   lastUpdated: false,
  //   nav: [
  //     {
  //       text: 'Guide',
  //       link: '/guide/',
  //     },
  //     {
  //       text: 'Code',
  //       link: '/code/'
  //     },
  //     {
  //       text: 'VuePress',
  //       link: 'https://v1.vuepress.vuejs.org'
  //     }
  //   ],
  //   sidebar: {
  //     '/guide/': [
  //       {
  //         title: 'Guide',
  //         collapsable: false,
  //         children: [
  //           '',
  //           'using-vue',
  //         ]
  //       }
  //     ],
  //   }
  // },

  /**
   * Apply plugins，ref：https://v1.vuepress.vuejs.org/zh/plugin/
   */
  plugins: [
    '@vuepress/plugin-back-to-top',
    '@vuepress/plugin-medium-zoom',
  ]
}
