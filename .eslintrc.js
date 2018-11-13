const path = require('path');

module.exports = {

    settings: {
        //"import/parser": "babel-eslint",
        // This is needed to stop VS Code from reporting that it cannot find modules
        // https://github.com/benmosher/eslint-plugin-import/issues/799
        // https://github.com/AtomLinter/linter-eslint/issues/610
        'import/resolver': {
            'node': {paths: [path.resolve(__dirname)],}
        },
    },

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
    'plugins':       ['import', 'react', 'jsx-a11y', 'promise'],
    'rules':         {
        'react/forbid-prop-types':               [0, {'forbid': []}],
        'import/no-unresolved':                  [
            2,
            {caseSensitive: false},
        ],
        'import/no-extraneous-dependencies':     ['error', {'devDependencies': true}],
        'jsx-a11y/click-events-have-key-events': 'off',
        'indent':                                [
            2,
            4,
            {
                'SwitchCase':   1,
                'ignoredNodes': ['ConditionalExpression'],
            },
        ],
        'function-paren-newline':                ['error', 'consistent'],
        'spaced-comment':                        [2, 'always'],
        'react/jsx-indent':                      [2, 4],
        'react/jsx-indent-props':                [2, 4],
        'react/jsx-tag-spacing':                 [
            2,
            {
                'closingSlash':      'never',
                'beforeSelfClosing': 'allow',
                'afterOpening':      'never',
                'beforeClosing':     'allow',
            },
        ],
        'max-len':                               ['error', {'code': 120}],
        'arrow-parens':                          ['error', 'as-needed'],
        'no-return-assign':                      ['warn', 'always'],
        'key-spacing':                           ['error', {'align': 'value'}],
        'object-curly-spacing':                  ['error', 'never'],
        'no-underscore-dangle':                  'off',
        'no-duplicate-imports':                  'error',
        'react/jsx-filename-extension':          [
            1,
            {
                'extensions': ['.js', '.jsx'],
            },
        ],
    },
    globals:         {
        'Blob':      true,
        'document':  true,
        'window':    true,
        'Number':    true,
        'isNaN':     true,
        'APP_TOKEN': true,
        '__DEV__':   true,
        'API_PORT':  true,
        'API_URL':   true,
        'require':   true,
        'FormData':  true,
    },
};
