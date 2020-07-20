import Vue from "vue";
import App from "./App.vue";

// vue-router
import router from "./router";

// vuex
// import store from "./store";

// axios
import "./plugins/axios";

import hljs from "highlight.js/lib/core";
import json from "highlight.js/lib/languages/json";
import "highlight.js/styles/tomorrow-night.css";

hljs.registerLanguage("json", json);

// vuetify
import vuetify from "./plugins/vuetify";

// devtools
Vue.config.devtools = process.env.NODE_ENV === "development";

Vue.config.productionTip = false;

new Vue({
  router,
  // store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");