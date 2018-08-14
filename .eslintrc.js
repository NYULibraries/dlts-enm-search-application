// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint'
  },
  env: {
    browser: true,
  },
  extends: [
    // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
    // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
    'plugin:vue/essential', 
    // https://github.com/standard/standard/blob/master/docs/RULES-en.md
    'standard'
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
    'space-unary-ops': [ 'error', { 'words': true, 'nonwords': false } ],
    'standard/computed-property-even-spacing': [ 'error', 'always' ],
  }
};
