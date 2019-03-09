const postcss = require('./postcss');

module.exports = function (paths) {
    return {
        module: {
            rules: [
                {
                    test:    /\.styl$/,
                    include: paths,
                    use:     [
                        'style-loader',
                        {
                            loader:  'css-loader',
                            options: {
                                modules:        true,
                                importLoaders:  true,
                                localIdentName: '[path][local]__[hash:base64:5]',
                            },
                        },
                        postcss,
                        'stylus-loader',
                    ],
                },
            ],
        },
    };
};
