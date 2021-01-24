<template>
  <v-app>
    <v-navigation-drawer app color="#f2f6f8" v-model="drawer">
      <router-link class="home" to="/">
        <v-list-item>
          <v-list-item-avatar>
            <v-img src="@/assets/logo.png"></v-img>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title><h2>NoneBot</h2></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </router-link>

      <v-divider></v-divider>

      <Grouper></Grouper>
    </v-navigation-drawer>

    <v-app-bar app color="#f2f6f8" flat>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-spacer></v-spacer>

      <v-btn href="https://v2.nonebot.dev/" target="_blank" text>
        <span class="mr-2">NoneBot</span>
        <v-icon small>fa-external-link-alt</v-icon>
      </v-btn>

      <v-btn href="https://github.com/nonebot" target="_blank" text>
        <span class="mr-2">GitHub</span>
        <v-icon small>fa-external-link-alt</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main style="background: #f2f6f8">
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-main>

    <v-footer app color="#f2f6f8" padless>
      <v-container fluid class="pa-0">
        <v-divider></v-divider>
        <v-row align="center" justify="center">
          <v-col class="text-center" cols="auto">
            <span>
              <v-icon small left>$gratipay</v-icon>Disigned by yanyongyu
            </span>
          </v-col>
          <v-col class="text-center" cols="auto">
            <span> <v-icon small left>fa-copyright</v-icon>NoneBot </span>
          </v-col>
        </v-row>
      </v-container>
    </v-footer>
  </v-app>
</template>

<script>
import { v1 as uuidv1 } from "uuid";
import Grouper from "@/components/Grouper";

export default {
  name: "App",
  components: {
    Grouper,
  },
  data: () => ({
    drawer: true,
  }),
  sockets: {
    connect() {
      console.log("Test Server Connected!");
      this.$toastr.success("", "WebSocket Connected!");
    },
    connect_error(error) {
      console.log(`Test Server Connect Failed: ${error}`);
      this.$toastr.error(
        "",
        (error && error.message) || "WebSocket Connection Error"
      );
    },
  },
  created() {
    // restore groups from localstorage or use default value.
    let restoreEnv = null;
    let restoreTest = null;
    let restoreGroup = null;
    let restoreGroupIndex = null;
    try {
      restoreEnv = JSON.parse(localStorage.getItem("nonebot-envs"));
      restoreTest = JSON.parse(localStorage.getItem("nonebot-tests"));
      restoreGroup = JSON.parse(localStorage.getItem("nonebot-groups"));
      restoreGroupIndex = JSON.parse(
        localStorage.getItem("nonebot-groupIndex")
      );
    } catch (error) {
      console.error(`[*]无法从本地存储恢复数据！Error: ${error}`);
      this.$toastr.error("", "无法从本地存储恢复数据");
    }
    const id = uuidv1();
    this.$store.dispatch(
      "updateEnv",
      restoreEnv || {
        self_id: "12345678",
        access_token: "",
        senders: {
          12345678: {
            user_id: 12345678,
            nickname: "机器人",
            card: "群名片",
            sex: "male",
            age: 8,
            area: "地区",
            level: 1,
            role: "member",
            title: "专属头衔",
          },
        },
      }
    );
    this.$store.dispatch("updateTests", restoreTest || {});
    this.$store.dispatch(
      "restoreGroups",
      restoreGroup || {
        [id]: {
          id: id,
          name: "默认分组",
          expand: true,
          default: true,
          editable: false,
          removable: false,
          tests: [],
        },
      }
    );
    this.$store.dispatch("updateGroupIndex", restoreGroupIndex || [id]);
    if (this.$store.state.envs.self_id) {
      this.$socket.io.opts.transportOptions.polling.extraHeaders[
        "X-Self-ID"
      ] = this.$store.state.envs.self_id;
      // this.$socket.io.opts.transportOptions.polling.extraHeaders[
      //   "Authorization"
      // ] = this.$store.state.envs.access_token;
      this.$socket.connect();
    }
  },
};
</script>

<style scoped>
.home {
  color: inherit;
  text-decoration: none;
}
.home:active {
  text-decoration: none;
}
.home:hover {
  text-decoration: none;
}
.home:visited {
  text-decoration: none;
}
footer span {
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}
</style>
