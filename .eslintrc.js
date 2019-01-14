const path = require('path');
process.chdir(__dirname);

module.exports = {

    'parser':        'babel-eslint',
    'extends':       [
        'airbnb',
        'plugin:import/errors',
        'plugin:import/warnings',
        'plugin:jsx-a11y/recommended',
        'plugin:promise/recommended',
    ],
    'parserOptions': {
        'ecmaVersion':  6,
        'sourceType':   'module',
        'ecmaFeatures': {
            'jsx': true,
        },
    },
    'env':           {
        'browser': true,
        'node':    true,
        'mocha':   true,
        'es6':     true,
        'jest':    true,
    },
    'plugins':       ['flowtype', 'import', 'react', 'jsx-a11y', 'promise'],
    'rules':         {
        'array-callback-return':                     ['off', {allowImplicit: false}],
        'react/forbid-prop-types':                   [0, {'forbid': []}],
        'import/no-unresolved':                      [
            2,
            {
                caseSensitive: false,
                'ignore':      [
                    'components/',
                    'pages/',
                    'actions/',
                    'services/',
                    'types/',
                    'utils/',
                ]
            },
        ],
        'import/no-extraneous-dependencies':         ['error', {'devDependencies': true}],
        'jsx-a11y/click-events-have-key-events':     'off',
        'indent':                                    [
            2,
            4,
            {
                'SwitchCase':   1,
                'ignoredNodes': ['ConditionalExpression'],
            },
        ],
        'function-paren-newline':                    ['error', 'consistent'],
        'spaced-comment':                            [2, 'always'],
        'react/jsx-indent':                          [2, 4],
        'react/jsx-indent-props':                    [2, 4],
        'react/jsx-tag-spacing':                     [
            2,
            {
                'closingSlash':      'never',
                'beforeSelfClosing': 'allow',
                'afterOpening':      'never',
                'beforeClosing':     'allow',
            },
        ],
        'max-len':                                   ['error', {'code': 120}],
        'arrow-parens':                              ['error', 'as-needed'],
        'no-return-assign':                          ['off', 'except-parens'],
        'key-spacing':                               ['error', {'align': 'value'}],
        'object-curly-spacing':                      ['error', 'never'],
        'no-underscore-dangle':                      'off',
        'no-duplicate-imports':                      'error',
        'react/jsx-filename-extension':              [
            1,
            {
                'extensions': ['.js', '.jsx'],
            },
        ],
        'flowtype/boolean-style':                    [
            2,
            'boolean'
        ],
        'flowtype/define-flow-type':                 1,
        'flowtype/generic-spacing':                  [
            2,
            'never'
        ],
        'flowtype/no-primitive-constructor-types':   2,
        'flowtype/no-types-missing-file-annotation': 2,
        'flowtype/no-weak-types':                    2,
        'flowtype/object-type-delimiter':            [
            2,
            'comma'
        ],
        'flowtype/require-parameter-type':           2,
        'flowtype/require-valid-file-annotation':    2,
        'flowtype/semi':                             [
            2,
            'always'
        ],
        'flowtype/space-before-generic-bracket':     [
            2,
            'never'
        ],
        'flowtype/type-id-match':                    [
            2,
            '^([A-Z][a-z0-9]+)+Type$'
        ],
        'flowtype/union-intersection-spacing':       [
            2,
            'always'
        ],
        'flowtype/use-flow-type':                    1,
        'flowtype/valid-syntax':                     1
    },
    globals:         {
        'Blob':         true,
        'document':     true,
        'window':       true,
        'Number':       true,
        'isNaN':        true,
        'APP_TOKEN':    true,
        '__DEV__':      true,
        'API_PORT':     true,
        'API_URL':      true,
        'require':      true,
        'FormData':     true,
        'Notification': true,
        'expect':       true,
        'test':         true,
        'jest':         true,
        'describe':     true,
    },
    settings:        {
        //"import/parser": "babel-eslint",
        // This is needed to stop VS Code from reporting that it cannot find modules
        // https://github.com/benmosher/eslint-plugin-import/issues/799
        // https://github.com/AtomLinter/linter-eslint/issues/610
        'import/resolver': {
            'node':  {paths: [path.resolve(__dirname)],},
            webpack: {
                config:         path.resolve('./webpack/webpack.config.base.js'),
                'config-index': 1
            },
        },
    }
};
