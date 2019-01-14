const theme = require('../less.theme');

module.exports = function (paths) {
    return {
        module: {
            rules: [
                {
                    test:    /\.less$/,
                    include: paths,
                    use:     [
                        'style-loader',
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
                },
            ],
        },
    };
};
