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

      <v-toolbar dense flat>
        <v-toolbar-title>分组</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon small>
          <v-icon small>fa-folder-plus</v-icon>
        </v-btn>
      </v-toolbar>

      <v-list dense shaped expand subheader>
        <v-list-group
          v-for="(group, index) in groups"
          :key="index"
          :value="true"
        >
          <template v-slot:activator>
            <v-list-item-title>{{ group.name }}</v-list-item-title>
            <v-list-item-icon>
              <v-btn icon small
                ><v-icon small>fa-chevron-up</v-icon></v-btn
              ></v-list-item-icon
            >
            <v-list-item-icon>
              <v-btn icon small
                ><v-icon small>fa-chevron-down</v-icon></v-btn
              ></v-list-item-icon
            >
            <v-list-item-icon>
              <v-btn icon small
                ><v-icon small>fa-trash-alt</v-icon></v-btn
              ></v-list-item-icon
            >
          </template>
          <template v-slot:appendIcon>
            <v-icon small>fa-chevron-down</v-icon>
          </template>

          <draggable
            v-model="group.items"
            group="group"
            draggable=".item"
            :sort="false"
          >
            <v-subheader slot="header" inset>Nothing here...</v-subheader>
            <transition-group>
              <v-list-item
                class="item"
                v-for="item in group.items"
                :key="item.created_at"
                link
              >
                <v-list-item-avatar :size="28">
                  <v-icon small>fa-grip-vertical</v-icon>
                </v-list-item-avatar>
                <v-list-item-title>{{ item.name }}</v-list-item-title>
                <v-list-item-icon>
                  <v-btn icon small><v-icon small>fa-trash-alt</v-icon></v-btn>
                </v-list-item-icon>
              </v-list-item>
            </transition-group>
          </draggable>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app color="transparent" flat absolute>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <!-- <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="@/assets/logo.png"
          transition="scale-transition"
          width="40"
        />
        <v-toolbar-title class="hidden-sm-and-down">NoneBot</v-toolbar-title>
      </div>-->

      <v-spacer></v-spacer>

      <v-btn href="https://nonebot.cqp.moe/" target="_blank" text>
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

    <v-footer app absolute color="transparent" padless>
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
import draggable from "vuedraggable";

export default {
  name: "App",
  components: {
    draggable,
  },
  data: () => ({
    drawer: true,
    groups: [
      {
        name: "默认分组",
        items: [
          {
            name: "something2",
            created_at: 1595311828124,
          },
        ],
      },
      {
        name: "分组2",
        items: [
          {
            name: "something1",
            created_at: 1595311828130,
          },
        ],
      },
    ],
  }),
};
</script>

<style scoped>
footer span {
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}
</style>
