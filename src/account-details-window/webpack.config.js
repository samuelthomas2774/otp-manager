const path = require('path');
const HTMLPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const vueLoader = {
    test: /\.(vue)$/,
    loader: 'vue-loader'
};

const scssLoader = {
    test: /\.scss$/,
    exclude: /node_modules/,
    loader: ExtractTextPlugin.extract(['css-loader', 'sass-loader'])
};

module.exports = {
    module: {
        loaders: [
            vueLoader, scssLoader
        ]
    },
    resolve: {
        alias: {
            vue$: path.resolve(__dirname, '..', '..', 'node_modules', 'vue', 'dist', 'vue.esm.js')
        },
        modules: [
            path.resolve('..', 'node_modules')
        ]
    },
    target: 'electron-renderer',
    node: {
        process: false,
        __filename: false,
        __dirname: false
    },
    plugins: [
        new HTMLPlugin({
            template: './src/main-window/index.html'
        }),
        new ExtractTextPlugin({
            filename: '[name].css',
            allChunks: true
        })
    ]
};
