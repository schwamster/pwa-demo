var path = require('path');
var webpack = require('webpack');
var SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');

module.exports = {
  entry: ['es6-promise', 'whatwg-fetch', 'localforage', './app/localforage-setitems.js', './app/localforage-getitems.js', './sw-fetch.js', './sw.js', './app/index.js'],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: "/dist/",
    sourceMapFilename: '[name].map'
  },
  
  devtool: "cheap-eval-source-map",

  plugins:[
    new webpack.optimize.UglifyJsPlugin({
      // sourceMap: true
    }),
    new SWPrecacheWebpackPlugin(
      {
        cacheId: 'pwa-demo',
        filename: 'service-worker.js',
        minify: false
        // importScripts: ['sw-fetch.js']
      }
    )
  ]
};