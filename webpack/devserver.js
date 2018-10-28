module.exports = function () {
    return {
        devServer: {
            // Enable gzip compression of generated files.
            compress:           true,
            hot:                true,
            stats:              'errors-only',
            overlay:            true,
            historyApiFallback: {
                // Paths with dots should still use the history fallback.
                // See https://github.com/facebookincubator/create-react-app/issues/387.
                disableDotRule: true,
            },
        },
    };
};
