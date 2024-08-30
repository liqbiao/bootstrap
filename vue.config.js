const path = require('path')
const webpack = require('webpack')
const isProd = process.env.NODE_ENV === 'production'

const assetsCDN = {
  // webpack build externals
  externals: {},
  css: [],
  js: [],
}

module.exports = {
  devServer: {
    // proxy: {
    //   '/test/api': {
    //     target: 'http://39.108.81.193:9000/',
    //     changeOrigin: true,
    //     pathRewrite: {
    //       '^/test/api': '/api'
    //     }
    //   },
    // },
  },
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [],
    },
  },
  configureWebpack: config => {
    config.entry.app = ['babel-polyfill', 'whatwg-fetch', './src/main.js']
    config.performance = {
      hints: false,
    }
    config.plugins.push(new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/))
    if (isProd) {
      config.externals = assetsCDN.externals
    }
  },
  chainWebpack: (config) => {
    // peter new add
    // config.resolve.alias.set('@$', resolve('src'))
    const svgRule = config.module.rule('svg')
    svgRule.uses.clear()
    svgRule
      .oneOf('inline')
      .resourceQuery(/inline/)
      .use('vue-svg-icon-loader')
      .loader('vue-svg-icon-loader')
      .end()
      .end()
      .oneOf('external')
      .use('file-loader')
      .loader('file-loader')
      .options({
        name: 'assets/[name].[hash:8].[ext]'
      })

    // if prod is on
    // assets require on cdn
    if (isProd) {
      config.plugin('html').tap(args => {
        args[0].cdn = assetsCDN
        return args
      })
    }
  },
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          // modifyVars: modifyVars(),
          javascriptEnabled: true,
        },
      },
    },
  },
  publicPath: './',
  outputDir: 'dist',
  assetsDir: 'static',
  productionSourceMap: false,
}
