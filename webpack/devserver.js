const spawn = require('child_process').spawn;

module.exports = function () {
    return {
        devServer: {
            // Enable gzip compression of generated files.
            compress:     true,
            hot:          true,
            stats:        'errors-only',
            overlay:      true,
            headers:      {'Access-Control-Allow-Origin': '*'},
            // contentBase:  path.join(__dirname, 'dist'),
            watchOptions: {
                aggregateTimeout: 300,
                ignored:          /node_modules/,
                poll:             100,
            },
            historyApiFallback: {
                // Paths with dots should still use the history fallback.
                // See https://github.com/facebookincubator/create-react-app/issues/387.
                verbose:        true,
                disableDotRule: false,
            },
            before() {
                if (process.env.START_HOT) {
                    console.log('Starting Main Process...');
                    spawn('npm', ['run', 'serve'], {
                        shell: true,
                        env:   process.env,
                        stdio: 'inherit',
                    })
                        .on('close', code => process.exit(code))
                        .on('error', spawnError => console.error(spawnError));
                }
            },
        },
    };
};
