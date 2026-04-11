/** @type {import('@types/eslint').Linter.BaseConfig} */
module.exports = {
  root: true,
  ignorePatterns: [
    "build/**",
    "generated/**",
    "extensions/**/dist/**",
    "check_cart.js",
    "create_discount*.js",
    "query_*.js",
    "test_*.js",
    "test_*.ts",
    "test_*.mjs",
  ],
  extends: [
    "@remix-run/eslint-config",
    "@remix-run/eslint-config/node",
    "@remix-run/eslint-config/jest-testing-library",
    "prettier",
  ],
  globals: {
    shopify: "readonly"
  },
  settings: {
    jest: {
      version: 29,
    },
  },
};
