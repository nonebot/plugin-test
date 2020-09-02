<template>
  <v-row dense>
    <v-col cols="12" sm="6" class="text-center">
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-row dense>
          <v-col cols="6">
            <v-select
              outlined
              dense
              v-model="adapter"
              :items="adapters"
            ></v-select>
          </v-col>
          <v-col cols="6">
            <v-select outlined dense v-model="event" :items="events"></v-select>
          </v-col>
        </v-row>
        <!-- * input, textarea, select, switch -->
        <template v-for="(field, index) in fields">
          <v-text-field
            :key="index"
            v-if="field.type == 'input'"
            v-model="data[field.model]"
            outlined
            dense
            :type="field.subType"
            :label="field.label"
            :rules="field.rules"
          ></v-text-field>
          <v-textarea
            :key="index"
            v-else-if="field.type == 'textarea'"
            v-model="data[field.model]"
            outlined
            dense
            :rows="2"
            :label="field.label"
            :rules="field.rules"
          ></v-textarea>
          <v-select
            :key="index"
            v-else-if="field.type == 'select'"
            v-model="data[field.model]"
            outlined
            dense
            :items="field.options"
            :label="field.label"
            :rules="field.rules"
          ></v-select>
          <v-switch
            :key="index"
            v-else-if="field.type == 'switch'"
            v-model="data[field.model]"
            :label="field.label"
          ></v-switch>
        </template>
        <v-btn class="mr-4" color="success" :disabled="!valid" @click="submit"
          >发送</v-btn
        >
        <v-btn v-if="!testId" color="primary" @click="save">保存</v-btn>
      </v-form>
    </v-col>
    <v-col cols="12" sm="6">
      <CodeTemplate :json="json"></CodeTemplate>
    </v-col>
  </v-row>
</template>

<script>
import Vue from "vue";
import ST from "stjs/st";
import object from "lodash";
import templates from "./templates";
import { v1 as uuidv1 } from "uuid";
import CodeTemplate from "./CodeTemplate";

export default {
  name: "Sender",
  components: {
    CodeTemplate,
  },
  props: {
    testId: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    templates: templates,

    test: {},

    valid: true,
    changed: false,
  }),
  computed: {
    envs() {
      return this.$store.state.envs;
    },
    tests() {
      return this.$store.state.tests;
    },
    fields() {
      if (this.adapter && this.event) {
        return this.templates[this.adapter][this.event].fields;
      } else {
        return [];
      }
    },
    data: {
      get() {
        if (this.testId && this.adapter && this.event) {
          return this.test.data;
        } else if (this.adapter && this.event) {
          const data = this.templates[this.adapter][this.event].data;
          this.$set(this.test, "data", data);
          return data;
        } else {
          return {};
        }
      },
      set(value) {
        this.changed = true;
        this.$set(this.test, "data", value);
      },
    },
    code() {
      if (this.adapter && this.event) {
        return this.templates[this.adapter][this.event].template;
      } else {
        return {};
      }
    },
    json() {
      return ST.select({
        ...this.envs,
        ...this.data,
        current_time: Math.floor(new Date().getTime() / 1000),
      })
        .transformWith(this.code)
        .root();
    },
    adapters() {
      return object.keys(this.templates);
    },
    events() {
      if (this.adapter) {
        return object.values(this.templates[this.adapter]);
      } else {
        return [];
      }
    },
    adapter: {
      get() {
        return this.test.adapter;
      },
      set(value) {
        this.changed = true;
        this.$set(this.test, "adapter", value);
        this.$set(this.test, "event", "");
        this.$set(this.test, "data", {});
      },
    },
    event: {
      get() {
        return this.test.event;
      },
      set(value) {
        this.changed = true;
        this.$set(this.test, "event", value);
        this.$set(this.test, "data", this.templates[this.adapter][value].data);
      },
    },
  },
  watch: {
    test: {
      deep: true,
      handler(value) {
        if (this.testId && this.changed) {
          console.log("[i] Update test");
          this.$store.dispatch("updateTest", value);
        }
      },
    },
    $route: "restoreTest",
  },
  methods: {
    submit() {
      if (this.$refs.form.validate()) {
        console.log(this.adapter, this.json);
        this.$socket.emit("event", [this.adapter.toLowerCase(), this.json]);
      }
    },
    save() {
      if (!this.testId) {
        this.$set(this.test, "name", "未命名测试");
        this.$store.dispatch("updateTest", this.test);
        const tests = this.$store.state.groups[this.test.group].tests;
        this.$set(tests, tests.length, this.test.id);
        this.$router.replace({
          name: "frontend-restore",
          params: { testId: this.test.id },
        });
      }
    },
    restoreTest() {
      if (this.testId) {
        this.test = this.tests[this.testId];
      } else {
        this.test = {
          id: uuidv1(),
          name: "未保存测试",
          group: this.$store.state.defaultGroup,
          created_at: new Date().getTime(),
          adapter: "",
          event: "",
          data: {},
        };
      }
    },
    handleUnload(e) {
      e = e || window.eevnt;
      if (e) {
        e.returnValue = "当前页面数据未保存，确定要离开？";
      }
      if (this.changed && !this.testId) {
        return "当前页面数据未保存，确定要离开？";
      }
    },
  },
  created() {
    window.addEventListener("onbeforeunload", (e) => this.handleUnload(e));
  },
  mounted() {
    this.restoreTest();
  },
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
