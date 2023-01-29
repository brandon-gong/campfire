const path = require('path');
const webpack = require('webpack')

module.exports = {
  // The entry point file described above
  entry: './src/js/sentiment.js',
  // The location of the build folder described above
  output: {
    path: path.resolve(__dirname, 'src/builtjs'),
    filename: 'bundle.js'
  },
  // Optional and for development only. This provides the ability to
  // map the built code back to the original source format when debugging.
  devtool: 'eval-source-map',
  resolve: {
    fallback: {
      "http": false,
      "child_process": false,
      "fs": false,
      "https": false,
      "crypto": false,
      "zlib": false
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': '{GOOGLE_APPLICATION_CREDENTIALS:"ember-376117-2e8892308c0d.json"}',
    }),
  ].filter(Boolean)
};

