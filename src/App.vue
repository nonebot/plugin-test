<template>
  <v-app>
    <v-app-bar app>
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="@/assets/logo.png"
          transition="scale-transition"
          width="40"
        />
        <v-toolbar-title class="hidden-sm-and-down">NoneBot</v-toolbar-title>
      </div>

      <v-spacer></v-spacer>

      <v-btn
        href="https://github.com/nonebot/nonebot-test"
        target="_blank"
        text
      >
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
export default {
  name: "App",

  data: () => ({
    //
  }),
};
</script>

<style scoped>
footer span {
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}
</style>
