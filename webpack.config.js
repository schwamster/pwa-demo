var path = require('path');

module.exports = {
  entry: ['es6-promise', 'whatwg-fetch', 'localforage', './app/localforage-setitems.js', './app/localforage-getitems.js', './sw.js', './app/index.js'],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: "/dist/"
  },
  // watchOptions: {
  //   poll: true
  // },
  devtool: "cheap-eval-source-map"
};