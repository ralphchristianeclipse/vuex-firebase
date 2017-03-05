var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: {
        "vuex-firebase": './src/index.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
    },
    module: {
        rules: [{
            test: /\.js$/,
            loader: 'babel-loader',
            exclude: /node_modules/
        }]
    }
}
