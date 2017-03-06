var path = require('path');
let config = {
    entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'vuex-firebase.js',
    library: 'vuex-firebase',
    libraryTarget: 'umd'
  },
    module: {
        rules: [{
            test: /\.js$/,
            loader: 'babel-loader',
            exclude: /node_modules/
        }, ]
    }
}


module.exports = config;