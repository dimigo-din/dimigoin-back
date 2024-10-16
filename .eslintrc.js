module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin', 'import'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'plugin:import/recommended'
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    quotes: ["error", "double"],
    semi: ["error", "always"],
    "import/order": [
      "error",
      {
        "newlines-between": "always",
        distinctGroup: true,
        warnOnUnassignedImports: true,
        groups: [
          "type",
          "builtin",
          "external",
          "internal",
          "parent",
          "sibling",
          "index",
          "unknown",
        ],
        pathGroups: [
          {
            pattern: "@nestjs*",
            group: "external",
            position: "before",
          },
          {
            pattern: "src/app*",
            group: "internal",
            position: "after",
          },
          {
            pattern: "src/auth*",
            group: "internal",
            position: "after",
          },
          {
            pattern: "src/lib*",
            group: "internal",
            position: "after",
          },
          {
            pattern: "src/routes*",
            group: "internal",
            position: "after",
          },
          {
            pattern: "src/schemas*",
            group: "internal",
            position: "after",
          },
          {
            pattern: "src/typings*",
            group: "internal",
            position: "after",
          },
        ],
        alphabetize: {
          order: "asc",
          caseInsensitive: true,
        },
      },
    ],
  },
  settings: {
    "import/resolver": {
      typescript: {},
    },
  }
};