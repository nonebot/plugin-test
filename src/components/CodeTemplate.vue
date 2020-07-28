<template>
  <pre id="code">
    <code class="json hljs" v-html="highlighted"></code>
  </pre>
</template>

<script>
import hljs from "highlight.js/lib/core";
import prettier from "prettier/standalone";
import parserJson from "prettier/parser-babel";

export default {
  name: "CodeTemplate",
  props: {
    json: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    highlighted() {
      return this.highlightJson(this.prettierJson(JSON.stringify(this.json)));
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
  padding: 0.5em;
  min-height: 420px;
  background: #1d1f21 !important;
  color: #c5c8c6 !important;
}

code {
  font-family: Consolas, monaco, monospace;
  background: #1d1f21 !important;
  color: #c5c8c6 !important;
}
</style>
