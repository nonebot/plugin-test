module.exports = {
  root: true,

  env: {
    node: true,
    es6: true,
  },

  parserOptions: {
    parser: "babel-eslint",
  },

  rules: {
    "no-console": "off",
    "no-debugger": "off",
  },

  extends: ["plugin:vue/essential", "@vue/prettier"],
};
