<template>
  <v-container fluid class="home">
    <v-row dense>
      <v-col cols="auto">
        <!-- <v-img src="@/assets/logo.png" width="200"></v-img> -->
        <div
          class="text-h3 text-capitalize grey--text text--darken-2 font-weight-medium"
        >
          {{ projectInfo.name }}
        </div>
      </v-col>
    </v-row>
    <v-row dense>
      <v-col>
        <p>Working Directory: {{ projectInfo.dir }}</p>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-expansion-panels multiple :value="[0, 1]">
          <!-- Plugin Panel -->
          <v-expansion-panel>
            <v-expansion-panel-header>Plugin Overview</v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-container>
                <v-row>
                  <v-col
                    cols="12"
                    sm="6"
                    md="3"
                    v-for="(plugin, index) in plugins"
                    :key="index"
                  >
                    <v-card color="#f3f6fc">
                      <v-card-title class="py-2">
                        <div class="text-h5">
                          {{ plugin.name }}
                        </div>
                      </v-card-title>
                      <v-list-item dense two-line>
                        <v-list-item-content>
                          <v-list-item-title>Module Path</v-list-item-title>
                          <v-list-item-subtitle>
                            {{ plugin.module }}
                          </v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>
                      <v-list-item dense>
                        <v-list-item-content>
                          <v-list-item-title>
                            Matcher
                            <v-badge
                              inline
                              class="mt-0"
                              :content="plugin.matcher"
                            ></v-badge>
                          </v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                    </v-card>
                  </v-col>
                </v-row>
              </v-container>
            </v-expansion-panel-content>
          </v-expansion-panel>
          <!-- TODO: Matcher Panel -->
          <v-expansion-panel>
            <v-expansion-panel-header>
              Matcher Overview
            </v-expansion-panel-header>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "Home",
  data: () => ({
    projectInfo: {
      name: "",
      dir: "",
    },
    plugins: [],
  }),
  methods: {
    getProject() {
      this.$axios
        .get("/info")
        .then((res) => {
          if (res.data.status === 200) {
            this.projectInfo = res.data.data || {
              name: "NoneBot",
              dir: "Unknown",
            };
          } else {
            this.$toastr.error("", "Could not get project info");
            console.log("[!] Could not get project info: ", res.data);
            this.projectInfo = { name: "NoneBot", dir: "Unknown" };
          }
        })
        .catch((err) => {
          this.$toastr.error("", "Could not get project info");
          console.log("[!] Could not get project info: ", err);
          this.projectInfo = { name: "NoneBot", dir: "Unknown" };
        });
    },
    getPlugins() {
      this.$axios
        .get("/plugins")
        .then((res) => {
          if (res.data.status === 200) {
            this.plugins = res.data.data;
          } else {
            this.$toastr.error("", "Could not get loaded plugins");
            console.log("[!] Could not get loaded plugins: ", res.data);
          }
        })
        .catch((err) => {
          this.$toastr.error("", "Could not get loaded plugins");
          console.log("[!] Could not get loaded plugins: ", err);
        });
    },
  },
  mounted() {
    this.getProject();
    this.getPlugins();
  },
};
</script>
