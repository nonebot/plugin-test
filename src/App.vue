<template>
  <v-app>
    <v-navigation-drawer app v-model="drawer">
      <v-list-item>
        <v-list-item-avatar>
          <v-img src="@/assets/logo.png"></v-img>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title><h2>NoneBot</h2></v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <Grouper></Grouper>
    </v-navigation-drawer>

    <v-app-bar app color="white" flat>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-spacer></v-spacer>

      <v-btn href="https://docs.nonebot.dev/" target="_blank" text>
        <span class="mr-2">NoneBot</span>
        <v-icon small>fa-external-link-alt</v-icon>
      </v-btn>

      <v-btn href="https://github.com/nonebot" target="_blank" text>
        <span class="mr-2">GitHub</span>
        <v-icon small>fa-external-link-alt</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-main>

    <v-footer app color="white" padless>
      <v-container class="pa-0">
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
  created() {
    // restore groups from localstorage or use default value.
    let restoreGroup = null;
    let restoreTest = null;
    let restoreGroupIndex = null;
    try {
      restoreGroup = JSON.parse(localStorage.getItem("nonebot-groups"));
      restoreTest = JSON.parse(localStorage.getItem("nonebot-tests"));
      restoreGroupIndex = JSON.parse(
        localStorage.getItem("nonebot-groupIndex")
      );
    } catch (error) {
      console.error(`[*]无法从本地存储恢复数据！Error: ${error}`);
    }
    const id = uuidv1();
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
  },
};
</script>

<style scoped>
footer span {
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}
</style>
