module.exports = function ({paths, options}) {
    return {
        module: {
            rules: [
                {
                    test:    /\.(js|jsx)$/,
                    include: paths,
                    enforce: 'pre',
                    loader:  'babel-loader',
                    options,
                },
            ],
        },
    };
};
