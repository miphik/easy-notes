const postcss = require('./postcss');

module.exports = function (paths) {
    return {
        module: {
            rules: [
                {
                    test:    /\.css$/,
                    include: paths,
                    use:     [
                        'style-loader',
                        'css-loader',
                        postcss,
                    ],
                },
            ],
        },
    };
};
