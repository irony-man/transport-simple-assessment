module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: '18.2' } },
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    "no-console": "off",
    "react-hooks/exhaustive-deps": "off",
    "react/prop-types": "off",
    "no-debugger": "warn",
    "no-unused-vars": [
      "warn",
      {
        "varsIgnorePattern": "^e$|selectize"
      }
    ],
    "indent": ["warn", 2],
    "semi": ["warn", "always"]
  },
}
