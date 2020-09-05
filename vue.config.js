const isProduction = process.env.NODE_ENV === "production";
const cdn = {
  css: [
    "https://cdn.jsdelivr.net/npm/jointjs@3.2.0/dist/joint.min.css",
    "https://cdn.jsdelivr.net/npm/animate.css@4.1.0/animate.min.css",
    "https://cdn.jsdelivr.net/npm/highlight.js@10.1.2/styles/tomorrow-night.css",
  ],
  js: [
    "https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.min.js",
    "https://cdn.jsdelivr.net/npm/lodash@4.17.20/lodash.min.js",
    "https://cdn.jsdelivr.net/npm/backbone@1.4.0/backbone-min.js",
    "https://cdn.jsdelivr.net/npm/jointjs@3.2.0/dist/joint.min.js",
  ],
};

module.exports = {
  publicPath: "/test/",
  assetsDir: "static",
  outputDir: "nonebot_test/dist",
  productionSourceMap: false,
  transpileDependencies: ["vuetify"],
  runtimeCompiler: true,
  configureWebpack: (config) => {
    if (isProduction) {
      config.externals = {
        jquery: "$",
        lodash: "_",
        backbone: "Backbone",
        jointjs: "joint",
      };
    }
  },
  chainWebpack: (config) => {
    if (isProduction) {
      config.plugin("html").tap((args) => {
        args[0].cdn = cdn;
        return args;
      });
    } else {
      config.plugin("html").tap((args) => {
        args[0].cdn = { css: cdn.css };
        return args;
      });
    }
  },
};
