const postcss = require('./postcss');

module.exports = function (paths) {
    return {
        module: {
            rules: [
                {
                    test:    /\.scss$/,
                    include: paths,
                    use:     [
                        'style-loader',
                        {
                            loader:  'css-loader',
                            options: {
                                modules:        true,
                                importLoaders:  true,
                                localIdentName: 'rstcustom__[local]',
                            },
                        },
                        'sass-loader',
                        postcss,
                    ],
                },
            ],
        },
    };
};
