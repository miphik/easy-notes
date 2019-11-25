const autoprefixer = require('autoprefixer');

module.exports = {
    loader:  'postcss-loader',
    options: {
        sourceMap: 'inline',
        ident:     'postcss', // https://webpack.js.org/guides/migrating/#complex-options
        plugins:   () => [
            require('postcss-flexbugs-fixes'),
            autoprefixer({
                flexbox: 'no-2009',
            }),
        ],
    },
};
