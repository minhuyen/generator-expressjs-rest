module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
    jest: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:prettier/recommended",
  ],
  plugins: ["react", "prettier"],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2020,
    sourceType: "module",
    requireConfigFile: false,
    "babelOptions": {
      "presets": ["@babel/preset-react"]
   },
  },
  parser: "@babel/eslint-parser",
  rules: {
    // indent: ["error", "tab"],
    "linebreak-style": ["warn", "unix"],
    quotes: ["warn", "double"],
    semi: ["warn", "always"],
    "react/prop-types": "off",
    "react/jsx-key": "off",
    "react/display-name": "off",
    "no-unused-vars": "warn"
  },
  settings: {
    react: {
      version: "detect",
    },
  },
};
