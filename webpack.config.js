var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: {
        "index": './src/index.js'
    },
    output: {
        path: path.resolve(__dirname, ''),
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
