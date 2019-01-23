const files = '^.+\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$';

module.exports = {
    automock:            false,
    browser:             false,
    bail:                false,
    collectCoverageFrom: [
        'src/**/*.{js,jsx}',
        '!**/node_modules/**',
        '!**/vendor/**',
    ],
    coverageDirectory: '<rootDir>/coverage',
    globals:           {
        __DEV__: true,
    },
    moduleFileExtensions: ['js', 'json', 'jsx', 'node'],
    transform:            {
        '^.+\\.js?$': 'babel-jest',
    },
    verbose:          true,
    // setupTestFrameworkScriptFile: './rtl.setup.js',
    rootDir:          '__test__',
    moduleNameMapper: {
        '\\.(css|less|styl)$': '<rootDir>/__mocks__/styleStub.js',
        [files]:               '<rootDir>/__mocks__/fileMock.js',
        'components/(.*)$':    '<rootDir>/../src/components/$1',
        'pages/(.*)$':         '<rootDir>/../src/pages/$1',
        'actions/(.*)$':       '<rootDir>/../src/actions/$1',
        'services/(.*)$':      '<rootDir>/../src/services/$1',
        'stores/(.*)$':        '<rootDir>/../src/stores/$1',
        'utils/(.*)$':         '<rootDir>/../src/utils/$1',
        'src/(.*)$':           '<rootDir>/../src/$1',
    },
};
