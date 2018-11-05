const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');
const webpack = require('webpack');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
// const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const fs = require('fs');
const pug = require('./webpack/pug');
const devserver = require('./webpack/devserver');
const sass = require('./webpack/sass');
const styl = require('./webpack/styl');
const extractCSS = require('./webpack/css.extract');
const css = require('./webpack/css');
const sourceMap = require('./webpack/sourceMap');
// const lintJS = require('./webpack/js.lint');
const lintCSS = require('./webpack/sass.lint');
const images = require('./webpack/images');
const babel = require('./webpack/babel');
const favicon = require('./webpack/favicon');

const NODE_ENV = process.env.NODE_ENV || 'prod';

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);
const PATHS = {
    source: resolveApp('src'),
    build:  resolveApp('build'),
    public: resolveApp('public'),
};
/* const HTML_PLUGIN_MINIFY_OPTIONS = {
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
            index: (NODE_ENV === 'dev' ? [
                'react-dev-utils/webpackHotDevClient',
            ] : []).concat([`${PATHS.source}/index.js`]),
        },
        output: {
            path:          PATHS.build,
            filename:      './js/[name].js',
            pathinfo:      true,
            chunkFilename: 'static/js/[id].js',
            publicPath:    '/',
            // Point sourcemap entries to original disk location
            // devtoolModuleFilenameTemplate: info => path.resolve(info.absoluteResourcePath),
        },
        resolve: {
            // This allows you to set a fallback for where Webpack should look for modules.
            // We placed these paths second because we want `node_modules` to "win"
            // if there are any conflicts. This matches Node resolution mechanism.
            modules:    ['node_modules'],
            // JSX is not recommended, see:
            // https://github.com/facebookincubator/create-react-app/issues/290
            extensions: ['.js', '.json', '.jsx'],
            // Enable aliases to use utils as separate packages.
            // We might convert project to monorepo in the future.
            // https://github.com/lerna/lerna
            alias:      {
                components: path.resolve(__dirname, './src/components'),
                pages:      path.resolve(__dirname, './src/pages'),
                actions:    path.resolve(__dirname, './src/actions'),
                utils:      path.resolve(__dirname, './src/utils'),
                src:        path.resolve(__dirname, './src'),
            },
            symlinks: false,
        },
        plugins: [
            new CleanWebpackPlugin([PATHS.build], {
                root:    resolveApp('/'),
                verbose: true,
                dry:     false,
                exclude: [],
            }),
            new webpack.DefinePlugin({
                NODE_ENV: JSON.stringify(NODE_ENV),
                __DEV__:  NODE_ENV === 'dev',
                // $:      'jquery',
                // jQuery: 'jquery',
            }),
            new HtmlWebpackPlugin({
                inject:         true,
                chunks:         ['index', 'common'],
                filename:       `${PATHS.build}/index.html`,
                template:       `${PATHS.public}/index.html`,
                chunksSortMode: 'none',
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
        /* common.plugins.push(new UglifyJsPlugin({
            parallel:      4,
            sourceMap:     true,
            uglifyOptions: {
                inline:   false,
                ecma:     8,
                output:   {
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
        // common.plugins.push(new BundleAnalyzerPlugin());
        return merge([
            common,
            extractCSS(),
            favicon(),
        ]);
    }
    if (argv.mode === 'development') {
        common.devtool = 'cheap-module-source-map';
        // common.plugins.push(new BundleAnalyzerPlugin());
        return merge([
            common,
            devserver(),
            sass(),
            styl(),
            css(),
            sourceMap(),
        ]);
    }
};
