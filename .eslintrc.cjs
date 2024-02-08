module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh', 'simple-import-sort'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
  
    "simple-import-sort/imports": [
      "error",
      {
        "groups": [
          // 1. `react` and packages starting with alphanumeric characters
          [
            "^react$",
            "^\\w"
          ],
          // 2. vendor packages
          [
            "^@"
          ],
          // 3. realative imports starting with "../"
          [
            "^\\.\\./?$"
          ],
          // 4. realative imports from same folder "./"
          [
            "^\\./?$"
          ],
          // 5. style imports
          [
            "^.+\\.(css|scss)$"
          ],
          // 6. media imports
          [
            "^.+\\.(gif|png|svg|jpg)$"
          ],
          // 7. side effect imports at the end
          [
            "^\\u0000"
          ]
        ]
      }
    ]
  }
}
