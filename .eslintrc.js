module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: ["eslint:recommended", "airbnb-base", "prettier"],
  overrides: [],
  parserOptions: {
    ecmaVersion: 2021, // Specify the ECMAScript version (e.g., 2021)
  },
  rules: {
    "no-underscore-dangle": ["error", { allow: ["_id"] }],
  },
};
