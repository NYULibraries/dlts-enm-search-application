// https://eslint.org/docs/user-guide/configuring

module.exports = {
    root          : true,
    // File parser
    parser        : 'vue-eslint-parser',
    parserOptions : {
        parser        : 'babel-eslint',
        'ecmaVersion' : 2017,
        // With import/export syntax
        'sourceType'  : 'module',
    },
    env : {
        browser : true,
        es6     : true,
        mocha   : true,
        node    : true,
    },
    extends : [
        // https://github.com/standard/eslint-config-standard/blob/ddd325066548a9e94b31fe2c8fa968ae5a49edfb/eslintrc.json
        '@vue/standard`',
        // https://github.com/vuejs/eslint-plugin-vue/blob/9fdf8e030c880e99f9bfa63fe10c3408961ee256/lib/configs/recommended.js
        'plugin:vue/recommended',
    ],
    // required to lint *.vue files
    plugins : [
        'vue',
    ],
    // add your custom rules here
    rules : {
        'comma-dangle'           : [ 'error', 'always-multiline' ],
        // allow async-await
        'generator-star-spacing' : 'off',
        'indent'                 : [ 'warn', 4 ],
        'key-spacing'            : [
            'error',
            {
                'beforeColon' : true,
                'afterColon'  : true,
                'mode'        : 'minimum',
                'align'       : {
                    'beforeColon' : true,
                    'afterColon'  : true,
                    'on'          : 'colon',
                    'mode'        : 'minimum',
                },
            },
        ],
        'keyword-spacing' : [
            'error',
            {
                'overrides' : {
                    'catch' : { 'after' : false },
                },
            },
        ],
        'no-console'                  : process.env.NODE_ENV === 'production' ? 'error' : 'off',
        // allow debugger during development
        'no-debugger'                 : process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-multi-spaces'             : 'off',
        // https://github.com/babel/babel-eslint/issues/517
        'no-use-before-define'        : 'off',
        'one-var'                     : [ 'error', { var : 'always' } ],
        // Always terminate statements with semi-colons
        'semi'                        : [ 'error', 'always' ],
        'space-before-function-paren' : [ 'error',
            { 'anonymous'  : 'always',
                'named'      : 'never',
                'asyncArrow' : 'always',
            },
        ],
        'space-in-parens' : [ 'error', 'always' ],
        'space-unary-ops' : [
            'error',
            {
                'words'     : true,
                'nonwords'  : false,
                'overrides' : {
                    '!' : true,
                },
            },
        ],
        'standard/computed-property-even-spacing' : [ 'error', 'always' ],
        'template-curly-spacing'                  : [ 'error', 'always' ],
        'vue/attributes-order'                    : 'error',
        'vue/html-end-tags'                       : 'error',
        'vue/html-indent'                         : [
            'error', 4, {
                'attribute'                 : 1,
                'closeBracket'              : 0,
                'alignAttributesVertically' : true,
                'ignores'                   : [],
            } ],
        'vue/html-self-closing' : ['error', {
            'html' : {
                'void'      : 'never',
                'normal'    : 'never',
                'component' : 'always',
            },
            'svg'  : 'always',
            'math' : 'always',
        } ],
        'vue/html-quotes'                    : 'error',
        'vue/max-attributes-per-line'        : 'error',
        'vue/mustache-interpolation-spacing' : 'error',
        'vue/name-property-casing'           : 'error',
        'vue/require-default-prop'           : 'error',
        'vue/require-prop-types'             : 'error',
        'vue/v-bind-style'                   : 'error',
        'vue/v-on-style'                     : 'error',
  },
};
