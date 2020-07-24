<template>
  <div class="home">
    <v-toolbar color="transparent" flat>
      <v-breadcrumbs :items="breadcrumbs" large></v-breadcrumbs>

      <v-spacer></v-spacer>

      <v-btn outlined color="success"
        >Settings
        <v-icon small right>fa-unlock-alt</v-icon>
      </v-btn>
    </v-toolbar>
    <v-container>
      <v-row>
        <v-col cols="12" sm="4"></v-col>
        <v-col cols="12" sm="8">
          <Sender :testId="testId"></Sender>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import Sender from "@/components/Sender";

export default {
  name: "Home",
  components: {
    Sender,
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
        return this.tests[this.testId];
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
  methods: {},
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
