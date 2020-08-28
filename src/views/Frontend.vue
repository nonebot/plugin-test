<template>
  <div class="frontend">
    <v-toolbar color="transparent" flat>
      <v-breadcrumbs :items="breadcrumbs" large></v-breadcrumbs>

      <v-spacer></v-spacer>

      <v-btn outlined color="success">
        Settings
        <v-icon small right>fa-unlock-alt</v-icon>
      </v-btn>
    </v-toolbar>
    <v-container>
      <v-row dense>
        <v-col cols="12" sm="4">
          <Messenger></Messenger>
        </v-col>
        <v-col cols="12" sm="8">
          <Sender :testId="testId"></Sender>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import Sender from "@/components/Sender";
import Messenger from "@/components/Messenger";

export default {
  name: "Frontend",
  components: {
    Sender,
    Messenger,
  },
  props: {
    testId: {
      type: String,
      required: false,
      default: "",
    },
  },
  data: () => ({}),
  computed: {
    env: {
      get() {
        return this.$store.state.env;
      },
      set(value) {
        console.log("[i] Update env");
        this.$store.dispatch("updateEnv", value);
      },
    },
    groups() {
      return this.$store.state.groups;
    },
    tests() {
      return this.$store.state.tests;
    },
    group() {
      if (this.test.group) {
        return this.groups[this.test.group];
      } else {
        return {};
      }
    },
    test() {
      if (this.testId) {
        return this.tests[this.testId] || {};
      } else {
        return {};
      }
    },
    breadcrumbs() {
      return [
        {
          text: this.group.name || "未分类",
        },
        {
          text: this.test.name || "未保存测试",
        },
      ];
    },
  },
  mounted() {
    if (this.testId && !this.tests[this.testId]) {
      this.$router.replace({ name: "frontend" });
    }
  },
};
</script>

<style scoped>
pre {
  display: block;
  overflow-x: auto;
  padding: 0.5em;
  background: #1d1f21;
  color: #c5c8c6;
}

#code {
  font-family: Consolas, monaco, monospace;
  background-color: #1d1f21;
  color: #c5c8c6;
  padding: 0;
}
</style>
