const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');
const webpack = require('webpack');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const fs = require('fs');
const pug = require('./webpack/pug');
const devserver = require('./webpack/devserver');
const sass = require('./webpack/sass');
const extractCSS = require('./webpack/css.extract');
const css = require('./webpack/css');
const sourceMap = require('./webpack/sourceMap');
const lintJS = require('./webpack/js.lint');
const lintCSS = require('./webpack/sass.lint');
const images = require('./webpack/images');
const babel = require('./webpack/babel');
const favicon = require('./webpack/favicon');

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);
const PATHS = {
    source: path.join(__dirname, 'source'),
    build:  path.join(__dirname, 'build'),
};
/*const HTML_PLUGIN_MINIFY_OPTIONS = {
    removeComments:                true,
    collapseWhitespace:            true,
    removeRedundantAttributes:     true,
    useShortDoctype:               true,
    removeEmptyAttributes:         true,
    removeStyleLinkTypeAttributes: true,
    keepClosingSlash:              true,
    minifyJS:                      true,
    minifyCSS:                     true,
    minifyURLs:                    true,
};*/
const common = merge([
    {
        entry: {
            index: `${PATHS.source}/pages/index/index.js`,
            // 'blog':  PATHS.source + '/pages/blog/blog.js',
        },
        output: {
            path:                          PATHS.build,
            filename:                      './js/[name].js',
            pathinfo:                      true,
            chunkFilename:                 'static/js/[id].js',
            // Point sourcemap entries to original disk location
            devtoolModuleFilenameTemplate: info => path.resolve(info.absoluteResourcePath),
        },
        plugins: [
            new CleanWebpackPlugin([PATHS.build], {
                root:    resolveApp('/'),
                verbose: true,
                dry:     false,
                exclude: [],
            }),
            new webpack.ProvidePlugin({
                // $:      'jquery',
                // jQuery: 'jquery',
            }),
            new HtmlWebpackPlugin({
                filename: 'index.html',
                chunks:   ['index', 'common'],
                template: `${PATHS.source}/pages/index/index.pug`,
            }),
            /* new HtmlWebpackPlugin({
                filename: 'blog.html',
                chunks:   ['blog', 'common'],
                emplate:  PATHS.source + '/pages/blog/blog.pug',
            }),*/
            new CaseSensitivePathsPlugin(),
            new webpack.NamedModulesPlugin(),
            new webpack.NoEmitOnErrorsPlugin(),
            new webpack.HotModuleReplacementPlugin(),
        ],
        optimization: {
            splitChunks: {
                cacheGroups: {
                    common: {
                        minChunks: 2,
                        chunks:    'all',
                        name:      'common',
                        priority:  10,
                        enforce:   true,
                    },
                },
            },
        },

    },
    pug(),
    // lintJS({ paths: PATHS.sources }),
    lintCSS(),
    images(),
    babel(),
]);


module.exports = function (env, argv) {
    if (argv.mode === 'production') {
        common.plugins.push(new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename:      '[name].[hash].css',
            chunkFilename: '[id].[hash].css',
        }));
        common.plugins.push(new webpack.optimize.ModuleConcatenationPlugin());
        common.plugins.push(new webpack.optimize.OccurrenceOrderPlugin());
        common.plugins.push(new OptimizeCssAssetsPlugin());
        common.plugins.push(new UglifyJsPlugin({
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
        }));
        return merge([
            common,
            extractCSS(),
            favicon(),
        ]);
    }
    if (argv.mode === 'development') {
        return merge([
            common,
            devserver(),
            sass(),
            css(),
            sourceMap(),
        ]);
    }
};
