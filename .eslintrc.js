// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  // File parser
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: 'babel-eslint',
    'ecmaVersion': 2017,
    // With import/export syntax
    'sourceType': 'module',
  },
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    // https://github.com/standard/standard/blob/master/docs/RULES-en.md
    'standard',
    // https://github.com/vuejs/eslint-plugin-vue#bulb-rules
    'plugin:vue/recommended',
  ],
  // required to lint *.vue files
  plugins: [
    'vue'
  ],
  // add your custom rules here
  rules: {
    'comma-dangle': [ 'error', 'always-multiline' ],
    // allow async-await
    'generator-star-spacing': 'off',
    'indent': [ 'warn', 4 ],
    'key-spacing': 'off',
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-multi-spaces': 'off',
    // https://github.com/babel/babel-eslint/issues/517
    'no-use-before-define': 'off',
    'one-var': [ 'error', { var: 'always' } ],
    // Always terminate statements with semi-colons
    'semi': [ 'error', 'always' ],
    'space-before-function-paren': [ 'error',
                                     { 'anonymous': 'always',
                                       'named': 'never',
                                       'asyncArrow': 'always',
                                     }
                                   ],
    'space-in-parens': [ 'error', 'always' ],
    'space-unary-ops': [
        'error',
        {
            'words': true,
            'nonwords': false,
            'overrides': {
                '!': true,
            }
        }
    ],
    'standard/computed-property-even-spacing': [ 'error', 'always' ],
  }
};
