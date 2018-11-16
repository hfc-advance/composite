module.exports =  {
  "plugins": [
    require("postcss-import")({}),
    require("postcss-url")({}),
    require("autoprefixer")({}),
    require("./build/postcss-px-to-viewport-mod")({
      viewportWidth: 750,
      viewportHeight: 1334,
      unitPrecision: 3,
      viewportUnit: 'vw',
      selectorBlackList: ['.ignore', '.hairlines'],
      minPixelValue: 1,
      mediaQuery: false,
      exclude: /(\/|\\)(node_modules(\/|\\)nprogress)(\/|\\)|(\/|\\)(vant-css)(\/|\\)/
    })
  ]
}