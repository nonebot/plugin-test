<template>
  <v-row>
    <v-col cols="12" sm="6" class="text-center">
      <v-form ref="form" v-model="valid" lazy-validation>
        <!-- TODO: something in form -->
        <v-btn :disabled="!valid" color="success" class="mr-4" @click="submit"
          >发送</v-btn
        >
        <v-btn color="primary">保存</v-btn>
      </v-form>
    </v-col>
    <v-col cols="12" sm="6">
      <div id="code"></div>
    </v-col>
  </v-row>
</template>

<script>
import Vue from "vue";
import { v1 as uuidv1 } from "uuid";
import hljs from "highlight.js/lib/core";
import prettier from "prettier/standalone";
import parserJson from "prettier/parser-babel";

export default {
  name: "Home",
  props: {
    testId: {
      type: String,
      required: true,
    },
    env: {
      type: Object,
      required: false,
      default: () => ({}),
    },
  },
  data: () => ({
    valid: true,
    changed: false,
  }),
  computed: {
    tests() {
      return this.$store.state.tests;
    },
    test: {
      get() {
        if (this.testId) {
          return this.tests[this.testId];
        } else {
          return {
            id: uuidv1(),
            name: "未保存测试",
            group: null,
            created_at: new Date().getTime(),
            data: {},
          };
        }
      },
      set(value) {
        if (this.testId) {
          console.log("[i] Update test");
          this.$store.dispatch("updateTest", value);
        } else {
          this.changed = true;
        }
      },
    },
    data() {
      return this.test.data;
    },
    code() {
      return this.highlightJson(
        this.prettierJson(
          JSON.stringify({
            message: "123",
            raw_message: "123",
            sender: {
              name: "xxx",
              qq: 1234,
            },
          })
        )
      );
    },
  },
  methods: {
    renderJson(Json, data, target) {
      var Component = Vue.extend({
        template: `
        <pre style="display: block; padding: 0.5em; background: #1d1f21; color: #c5c8c6;">
          <code
            ref="code"
            class="json hljs"
            style="font-familly: Consolas,monaco,monospace; background: #1d1f21; color: #c5c8c6;"
          >${template}</code>
        </pre>`,
        data: () => data,
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
        mounted() {
          var node = this.$refs.code;
          node.innerHTML = this.highlightJson(
            this.prettierJson(node.innerHTML)
          );
        },
      });
      new Component().$mount(target);
    },
    submit() {
      //
    },
    handleUnload(e) {
      e = e || window.eevnt;
      if (e) {
        e.returnValue = "当前页面数据未保存，确定要离开？";
      }
      return "当前页面数据未保存，确定要离开？";
    },
  },
  created() {
    window.addEventListener("onbeforeunload", (e) => this.handleUnload(e));
  },
  mounted() {},
  destroyed() {
    window.removeEventListener("onbeforeunload", (e) => this.handleUnload(e));
  },
  beforeRouteLeave(to, from, next) {
    if (this.changed && !this.testId) {
      if (window.confirm("当前页面数据未保存，确定要离开？")) {
        next();
      } else {
        next(false);
      }
    }
  },
};
</script>

<style scoped>
/* pre {
  display: block;
  overflow-x: auto;
  padding: 0.5em;
  background: #1d1f21;
  color: #c5c8c6;
}

code {
  font-family: Consolas, monaco, monospace;
  background-color: #1d1f21;
  color: #c5c8c6;
  padding: 0;
} */
</style>
