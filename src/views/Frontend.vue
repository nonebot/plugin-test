<template>
  <div class="home">
    <v-toolbar color="transparent" flat>
      <!-- <v-select
        v-model="adapter"
        :items="adapters"
        label="Adapter"
        dense
        outlined
        hide-details
      ></v-select> -->

      <v-spacer></v-spacer>

      <v-btn outlined color="success"
        >Settings
        <v-icon right>fa-unlock-alt</v-icon>
      </v-btn>
    </v-toolbar>
    <v-container>
      <v-row>
        <v-col cols="12" sm="4"></v-col>
        <v-col cols="12" sm="4"></v-col>
        <v-col cols="12" sm="4">
          <pre>
            <code class="json hljs" id="code" v-html="code"></code>
          </pre>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import hljs from "highlight.js/lib/core";
import prettier from "prettier/standalone";
import parserJson from "prettier/parser-babel";

export default {
  name: "Home",
  data: () => ({
    // adapter: "CoolQ",
    // adapters: ["CoolQ"],
    raw_code: JSON.stringify({
      message: "123",
      raw_message: "123",
      sender: {
        name: "xxx",
        qq: 1234,
      },
    }),
  }),
  computed: {
    code() {
      return this.highlightJson(this.prettierJson(this.raw_code));
    },
  },
  methods: {
    prettierJson(code) {
      return prettier.format(code, {
        printWidth: 36,
        parser: "json",
        plugins: [parserJson],
      });
    },
    highlightJson(code) {
      return hljs.highlight("json", code).value;
    },
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
