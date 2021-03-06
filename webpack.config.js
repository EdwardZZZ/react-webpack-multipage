var path = require('path');
var webpack = require('webpack');
var webpackDevServer = require('webpack-dev-server');
var HtmlWebpackPlugin = require('html-webpack-plugin')

var node_modules = path.resolve(__dirname, 'node_modules');
var pathToReact = path.resolve(node_modules, 'react/dist/react.min.js');
var pathToReactDom = path.resolve(node_modules, 'react-dom/dist/react-dom.min.js');

var baseConfig = require('./webpack.base.config')
var devServer = baseConfig.devServer
var publicConfig = baseConfig.publicConfig
var extractCSS = baseConfig.extractCSS
var extractSCSS = baseConfig.extractSCSS

var config = {
    entry: baseConfig.entry,
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    output: {
        filename: publicConfig.jsPath + '/[name].js'
    },
    module: {
        loaders: [{
            test: /\.jsx?$/,
            include: path.join(__dirname, 'src'),
            loaders: ['react-hot', 'babel'],
        }, {
            test: /\.css$/,
            loader: extractCSS.extract(baseConfig.cssLoader)
        }, {
            test: /\.scss$/,
            loader: extractSCSS.extract(baseConfig.scssLoader)
        }, {
            test: /\.(png|jpg|gif|svg|woff2?|eot|ttf)(\?.*)?$/,
            loader: 'url',
            query: {
              limit: publicConfig.fileLimit,
              name: publicConfig.imgPath + '/[name].[ext]'
            }
        }],
        noParse: [pathToReact, pathToReactDom]
    },
    devServer: devServer,
    plugins: [
        extractCSS,
        extractSCSS,
        new webpack.HotModuleReplacementPlugin(),
    ]
};

module.exports = config;
