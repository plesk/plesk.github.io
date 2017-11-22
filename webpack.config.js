// Copyright 1999-2017. Plesk International GmbH. All rights reserved.

const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const WebpackRTLPlugin = require('webpack-rtl-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const autoprefixer = require('autoprefixer');

const extractLess = new ExtractTextPlugin('[name].css');

const getPlugins = isDev => [
    new CopyWebpackPlugin(
        [{ from: '../images', to: 'images' }, { from: '../fonts', to: 'fonts' }],
        { debug: 'warning' }
    ),
    new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: JSON.stringify(isDev ? 'development' : 'production'),
        },
    }),
    extractLess,
    new WebpackRTLPlugin({
        minify: false,
    }),
];

module.exports = (env = {}) => {
    const isDev = env.dev;

    return {
        context: path.resolve(__dirname, './src/styles'),
        entry: {
            'css/index': './index.less',
        },
        output: {
            path: path.resolve(__dirname, './assets'),
            filename: '[name].css',
            sourceMapFilename: '[file].map?[hash]',
            libraryTarget: 'amd',
        },
        devtool: isDev ? 'source-map' : false,
        watch: isDev,
        module: {
            rules: [
                {
                    test: /\.less$/i,
                    use: extractLess.extract({
                        fallback: {
                            loader: 'style-loader',
                            options: {
                                sourceMap: isDev,
                            },
                        },
                        use: [
                            {
                                loader: 'css-loader',
                                options: {
                                    importLoaders: 2,
                                    minimize: {
                                        safe: true,
                                        discardComments: {
                                            remove: comment => !/^\s*(!|rtl)/i.test(comment),
                                        },
                                    },
                                    sourceMap: isDev,
                                },
                            },
                            {
                                loader: 'postcss-loader',
                                options: {
                                    plugins: [
                                        autoprefixer(),
                                    ],
                                    sourceMap: isDev,
                                },
                            },
                            {
                                loader: 'less-loader',
                                options: {
                                    sourceMap: isDev,
                                },
                            },
                        ],
                    }),
                },
                {
                    test: /\.(png|jpg|gif|svg|woff|woff2)$/i,
                    loader: 'file-loader',
                    options: {
                        emitFile: false,
                        name: '[name].[ext]?[md5:hash:hex:5]',
                        useRelativePath: true,
                    },
                },
            ],
        },
        plugins: getPlugins(isDev),
    };
};