// Copyright 1999-2019. Plesk International GmbH. All rights reserved.

const { resolve } = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

module.exports = (env, argv) => {
    const isProd = argv.mode !== 'development';
    const plugins = [
        new MiniCssExtractPlugin({
            filename: 'css/index.css',
        }),
        new CopyWebpackPlugin([
            { from: 'images', to: 'images' },
            { from: 'fonts', to: 'fonts' },
        ]),
    ];

    if (isProd) {
        plugins.push(new CleanWebpackPlugin());
    }

    return {
        context: resolve(__dirname, './src'),
        entry: './styles/index.less',
        mode: isProd ? 'production' : 'development',
        output: {
            path: resolve(__dirname, 'assets'),
        },
        devtool: isProd ? false : 'source-map',
        module: {
            rules: [
                {
                    test: /\.less$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        'css-loader',
                        {
                            loader: 'postcss-loader',
                            options: {
                                plugins: [
                                    autoprefixer(),
                                    cssnano({
                                        safe: true,
                                    }),
                                ],
                            },
                        },
                        'less-loader',
                    ],
                },
                {
                    test: /\.(png|jpg|gif|svg)$/i,
                    loader: 'file-loader',
                    include: [
                        resolve(__dirname, './src/images')
                    ],
                    options: {
                        emitFile: false,
                        name: '../images/[name].[ext]?[md5:hash:hex:5]',
                    },
                },
                {
                    test: /\.(woff|woff2)$/i,
                    loader: 'file-loader',
                    include: [
                        resolve(__dirname, './src/fonts')
                    ],
                    options: {
                        emitFile: false,
                        name: '../fonts/[name].[ext]?[md5:hash:hex:5]',
                    },
                },
            ],
        },
        plugins,
    };
};
