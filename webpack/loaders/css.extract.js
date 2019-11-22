const ExtractTextPlugin = require('extract-text-webpack-plugin');
const theme = require('../less.theme');
const postcss = require('./postcss');

module.exports = function (paths) {
    return {
        module: {
            rules: [
                {
                    test:    /\.scss$/,
                    include: paths,
                    use:     ExtractTextPlugin.extract({
                        publicPath: '../',
                        fallback:   'style-loader',
                        use:        [
                            {
                                loader:  'css-loader',
                                options: {
                                    modules: {
                                        mode:           'local',
                                        localIdentName: '[path][local]__[hash:base64:5]',
                                    },
                                    import:        true,
                                    importLoaders: true,
                                },
                            },
                            'sass-loader',
                            postcss,
                        ],
                    }),
                },
                {
                    test:    /\.styl$/,
                    include: paths,
                    use:     ExtractTextPlugin.extract({
                        publicPath: '../',
                        fallback:   'style-loader',
                        use:        [
                            {
                                loader:  'css-loader',
                                options: {
                                    modules: {
                                        mode:           'local',
                                        localIdentName: '[path][local]__[hash:base64:5]',
                                    },
                                    import:        true,
                                    importLoaders: true,
                                },
                            },
                            postcss,
                            'stylus-loader',
                        ],
                    }),
                },
                {
                    test:    /\.css$/,
                    include: paths,
                    use:     ExtractTextPlugin.extract({
                        fallback: 'style-loader',
                        use:      [
                            'css-loader',
                            postcss,
                        ],
                    }),
                },
                {
                    test:    /\.less$/,
                    include: paths,
                    use:     ExtractTextPlugin.extract({
                        publicPath: '../',
                        fallback:   'style-loader',
                        use:        [
                            'css-loader',
                            {
                                loader:  'less-loader',
                                options: {
                                    sourceMap:         true,
                                    modifyVars:        theme,
                                    javascriptEnabled: true,
                                },
                            },
                            // postcss,
                        ],
                    }),
                },
            ],
        },
        plugins: [
            new ExtractTextPlugin('./css/[name].css'),
        ],
    };
};
