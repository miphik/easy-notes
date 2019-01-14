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
                        'css-loader',
                        postcss,
                        'stylus-loader',
                    ],
                },
            ],
        },
    };
};
