import Vue from "vue";
import VueSocketIO from "vue-socket.io";

export default (store) =>
  Vue.use(
    new VueSocketIO({
      debug: process.env.NODE_ENV === "development",
      connection: "/",
      vuex: {
        store,
        actionPrefix: "SOCKET_",
      },
      options: {
        path: "/test_ws/socket",
        transportOptions: {
          polling: {
            extraHeaders: {
              Authorizarion: store.state.envs.access_token,
              "X-Self-ID": store.state.envs.self_id,
            },
          },
        },
      },
    })
  );
