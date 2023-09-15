const ExtensionReloader = require('@bartholomej/webpack-extension-reloader')
const CopyPlugin = require('copy-webpack-plugin')
const path = require('path')

const contentScripts = {
  content: './content/index.tsx',
}
const extensionPages = {
  options: './options/index.tsx',
  popup: './popup/index.tsx',
}

let config = {
  mode: process.env.NODE_ENV,
  context: __dirname + '/src/pages',
  devtool: 'cheap-module-source-map'
}

let ExtensionConfig = Object.assign({}, config, {
  entry: {
    background: './background/index.ts',
    ...contentScripts,
    ...extensionPages,
  },
  output: {
    path: __dirname + '/extension/dist/',
    filename: '[name].dist.js',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      },
      {
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      },
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
  plugins: [
    new ExtensionReloader({
      port: 9090,
      reloadPage: true,
      entries: {
        contentScript: Object.keys(contentScripts),
        extensionPage: Object.keys(extensionPages),
        background: 'background',
      },
    }),
    new CopyPlugin([
      {
        from: './popup/index.html',
        to: __dirname + '/extension/dist/popup.html',
      },
      {
        from: './background/bgWrapper.js',
        to: __dirname + '/extension/dist/bgWrapper.js',
      },
      {
        from: './popup/index.css',
        to: __dirname + '/extension/dist/popup.css',
      },
      {
        from: './options/index.html',
        to: __dirname + '/extension/dist/options.html',
      },
      {
        from: './options/index.css',
        to: __dirname + '/extension/dist/options.css',
      },
      {
        from: './content/index.css',
        to: __dirname + '/extension/dist/content.css',
      },
      {
        from: './common/styles/reset.css',
        to: __dirname + '/extension/dist/reset.css',
      },
      {
        from: '../assets/',
        to: __dirname + '/extension/dist/assets/',
      },
    ]),
  ],
})

module.exports = [ExtensionConfig]
