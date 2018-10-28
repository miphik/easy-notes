const ExtractTextPlugin = require('extract-text-webpack-plugin');
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
                        use:        ['css-loader', 'sass-loader', postcss],
                    }),
                },
                {
                    test:    /\.styl$/,
                    include: paths,
                    use:     ExtractTextPlugin.extract({
                        publicPath: '../',
                        fallback:   'style-loader',
                        use:        ['css-loader', 'stylus-loader', postcss],
                    }),
                },
                {
                    test:    /\.css$/,
                    include: paths,
                    use:     ExtractTextPlugin.extract({
                        fallback: 'style-loader',
                        use:      ['css-loader', postcss],
                    }),
                },
            ],
        },
        plugins: [
            new ExtractTextPlugin('./css/[name].css'),
        ],
    };
};
