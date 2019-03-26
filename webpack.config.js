require('@babel/register');
const merge = require('webpack-merge');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CompressionPlugin = require('compression-webpack-plugin');
const WebpackMd5Hash = require('webpack-md5-hash');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const base = require('./webpack/webpack.config.base');
const pug = require('./webpack/loaders/pug');
const devserver = require('./webpack/devserver');
const sass = require('./webpack/loaders/sass');
const styl = require('./webpack/loaders/styl');
const extractCSS = require('./webpack/loaders/css.extract');
const css = require('./webpack/loaders/css');
const less = require('./webpack/loaders/less');
// const lintJS = require('./webpack/js.lint');
const lintCSS = require('./webpack/loaders/sass.lint');
const images = require('./webpack/loaders/images');
const babel = require('./webpack/loaders/babel');
const favicon = require('./webpack/favicon');

const common = merge([
    base,
    pug(),
    // lintJS({ paths: PATHS.sources }),
    lintCSS(),
    images(),
    babel(),
]);

module.exports = function (env, argv) {
    common.mode = argv.mode;
    if (argv.mode === 'production') {
        common.plugins.push(new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename:      '[name].[hash].css',
            chunkFilename: '[id].[hash].css',
        }));
        common.plugins.push(new LodashModuleReplacementPlugin());
        common.plugins.push(new webpack.ContextReplacementPlugin(
            // The path to directory which should be handled by this plugin
            /moment[\/\\]locale$/,
            // A regular expression matching files that should be included
            /en|ru/,
        ));
        common.plugins.push(new webpack.optimize.ModuleConcatenationPlugin());
        common.plugins.push(new webpack.optimize.OccurrenceOrderPlugin());
        common.plugins.push(new OptimizeCssAssetsPlugin());
        common.plugins.push(new WebpackMd5Hash());
        common.plugins.push(new TerserPlugin({
            terserOptions: {
                parallel:  4,
                sourceMap: true,
                ecma:      8,
                output:    {
                    comments: false, // remove comments
                },
                compress: {
                    unused:        true,
                    dead_code:     true, // big one--strip code that will never execute
                    warnings:      false, // good for prod apps so users can't peek behind curtain
                    drop_debugger: true,
                    conditionals:  true,
                    evaluate:      true,
                    drop_console:  true, // strips console statements
                    sequences:     true,
                    booleans:      true,
                    if_return:     true,
                    join_vars:     true,
                },
            },
        }));
        /* common.plugins.push(new UglifyJsPlugin({
            parallel:      4,
            sourceMap:     true,
            uglifyOptions: {
                inline: false,
                ecma:   8,
                output: {
                    comments: false, // remove comments
                },
                compress: {
                    unused:        true,
                    dead_code:     true, // big one--strip code that will never execute
                    warnings:      false, // good for prod apps so users can't peek behind curtain
                    drop_debugger: true,
                    conditionals:  true,
                    evaluate:      true,
                    drop_console:  true, // strips console statements
                    sequences:     true,
                    booleans:      true,
                    if_return:     true,
                    join_vars:     true,
                },
            },
        }));*/
        common.plugins.push(new BundleAnalyzerPlugin());
        common.plugins.push(new CompressionPlugin({
            algorithm: 'gzip',
        }));
        return merge([
            common,
            extractCSS(),
            favicon(),
        ]);
    }
    if (argv.mode === 'development') {
        common.devtool = 'cheap-module-source-map';
        common.plugins.push(new BundleAnalyzerPlugin());
        return merge([
            common,
            devserver(),
            sass(),
            styl(),
            css(),
            less(),
        ]);
    }
};
