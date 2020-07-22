module.exports = {
  publicPath: "/test/",
  outputDir: "nonebot-test/dist",
  assetsDir: "static",
  transpileDependencies: ["vuetify"],
  chainWebpack: (config) => {
    // config.module
    //   .rule("sass")
    //   .test(/\.sass$/)
    //   .use("vue-style-loader")
    //   .loader("vue-style-loader")
    //   .end()
    //   .use("css-loader")
    //   .loader("css-loader")
    //   .end()
    //   .use("sass-loader")
    //   .loader("sass-loader")
    //   .options({
    //     additionalData: "@import '@/styles/variables.scss'",
    //   });
    // config.module
    //   .rule("scss")
    //   .test(/\.scss$/)
    //   .use("vue-style-loader")
    //   .loader("vue-style-loader")
    //   .end()
    //   .use("css-loader")
    //   .loader("css-loader")
    //   .end()
    //   .use("sass-loader")
    //   .loader("sass-loader")
    //   .options({
    //     additionalData: "@import '@/styles/variables.scss';",
    //   });
  },
};
