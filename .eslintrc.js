const ERROR = 2;
const OFF = 0;
const MAX_PARAMS = 4;
const MAX_LINE_LENGTH = 140;
const MAX_NESTED_CALLBACKS = 3;
const MAX_STATEMENTS = 30;
module.exports = {
  parser: "@typescript-eslint/parser", // Specifies the ESLint parser
  parserOptions: {
    ecmaVersion: 2020, // Allows for the parsing of modern ECMAScript features
    sourceType: "module", // Allows for the use of imports
    ecmaFeatures: {
      jsx: true // Allows for the parsing of JSX
    }
  },
  settings: {
    react: {
      version: "detect" // Tells eslint-plugin-react to automatically detect the version of React to use
    },
    project: "./tsconfig.json",
    tsconfigRootDir: __dirname,
  },
  extends: [
    "plugin:@typescript-eslint/recommended", // Uses the recommended rules from the @typescript-eslint/eslint-plugin
    "prettier/@typescript-eslint", // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
    "plugin:prettier/recommended" // Enables eslint-plugin-prettier and eslint-config-prettier. This will display prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
  ],
  rules: {
    "max-len": [ERROR, MAX_LINE_LENGTH],
    "max-params": [ERROR, MAX_PARAMS],
    "no-nested-ternary": OFF,
    "no-underscore-dangle": OFF, // Used in external APIs
    camelcase: OFF, // It doesn't work well with typescript interfaces for external APIs
    quotes: [ERROR, "single", { avoidEscape: true }],
    "no-return-assign": [ERROR, "always"],
    "class-methods-use-this": OFF, // We should not check for "this" in public methods.
    "quote-props": OFF,
    "array-element-newline": [ERROR, "consistent"],
    "comma-dangle": [ERROR, "never"],
    "function-paren-newline": [ERROR, "multiline-arguments"],
    //TODO il faut reactiver car il y a trop de Complexité cyclomatique
    "max-nested-callbacks": OFF, // [ERROR, MAX_NESTED_CALLBACKS],
    //TODO activer bientot car on devie l'utilisation de arrow functions
    "max-statements": OFF, // [ERROR, MAX_STATEMENTS],
    "func-style": [ERROR, "declaration", { allowArrowFunctions: true }],
    "consistent-this": [ERROR, "self"],
    "no-cond-assign": [ERROR, "always"],
    "no-shadow": [
      ERROR,
      {
        hoist: "functions",
      },
    ],
    "space-before-function-paren": OFF,
    "padded-blocks": [ERROR, "never"],
    "no-empty-function": [ERROR, { allow: ["constructors"] }],
    "no-unused-vars": OFF, // Delegate to @typescript-eslint
    "no-trailing-spaces": [ERROR, { "skipBlankLines": true, "ignoreComments": true }],

    // Plugin rules
    "@typescript-eslint/no-unused-vars": OFF,
    "@typescript-eslint/no-explicit-any": OFF,
    "@typescript-eslint/explicit-module-boundary-types": OFF,
    "@typescript-eslint/no-var-requires": OFF,
    "@typescript-eslint/no-empty-function": OFF,
    "@typescript-eslint/ban-types": OFF,


    //"import/no-extraneous-dependencies": [1, { devDependencies: false }],
    "prettier/prettier": ERROR,
    "node/no-unsupported-features/es-syntax": OFF,
    "node/no-unsupported-features/es-builtins": OFF,
    "node/no-unsupported-features/node-builtins": OFF,

  },
};