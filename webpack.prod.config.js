require('shelljs/global')
var path = require('path');
var fs = require('fs');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin')

var baseConfig = require('./webpack.base.config')
var publicConfig = baseConfig.publicConfig
var extractCSS = baseConfig.extractCSS
var extractSCSS = baseConfig.extractSCSS

var entry = baseConfig.entry
entry['vendors'] = ['react', 'react-dom']

var config = {
    entry: entry,
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    output: {
        publicPath: publicConfig.publicPath,
        path: path.resolve(__dirname, 'build'),
        filename: publicConfig.jsPath + '/[name].js'
    },
    module: {
        loaders: [{
            test: /\.jsx?$/,
            include: path.join(__dirname, 'src'),
            loader: 'babel',
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
        }]
    },
    plugins: [
        extractCSS,
        extractSCSS,
        new webpack.optimize.CommonsChunkPlugin('vendors', publicConfig.jsPath + '/vendors.js'),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
        new webpack.optimize.OccurenceOrderPlugin()
    ]
};

// HtmlWebpackPlugin
fs.readdirSync(__dirname).forEach(function(name) {
    var m = name.match(/(.+)\.html$/)
    if (m && m[0]) config.plugins.push(
        new HtmlWebpackPlugin({
            filename: m[0],
            template: m[0],
            inject: false,
            chunksSortMode: 'none',
            minify: publicConfig.minify,
        })
    )
})

var assetsPath = path.resolve(__dirname, './build')
rm('-rf', assetsPath)
mkdir('-p', assetsPath)
cp('-R', 'static/', assetsPath)

module.exports = config;
