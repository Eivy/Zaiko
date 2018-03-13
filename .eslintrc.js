module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true
  },
  plugins: [
    'html'
  ],
  extends: ['standard'],
  rules: {
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'no-tabs': 0,
    'camelcase': 'off',
    'indent': ['error', 2, { 'SwitchCase': 1 }]
  },
  globals: {
    'firebase': true,
    'componentHandler': true,
    'Vue': true,
    'VueRouter': true,
    'firebaseui': true
  }
}
