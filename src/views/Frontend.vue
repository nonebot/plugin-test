<template>
  <div class="frontend">
    <v-toolbar color="transparent" flat dense>
      <v-breadcrumbs :items="breadcrumbs" large></v-breadcrumbs>

      <v-spacer></v-spacer>

      <v-btn
        outlined
        color="success"
        @click="
          copyEnv();
          settingModal = true;
        "
      >
        Settings
        <v-icon small right>fa-unlock-alt</v-icon>
      </v-btn>
    </v-toolbar>
    <v-container fluid>
      <v-row dense>
        <v-col cols="12" sm="4">
          <Messenger></Messenger>
        </v-col>
        <v-col cols="12" sm="8">
          <Sender :testId="testId"></Sender>
        </v-col>
      </v-row>
    </v-container>
    <!-- SettingModal -->
    <v-dialog v-model="settingModal" width="900" max-width="95%">
      <v-card>
        <v-card-title class="headline">修改设置</v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-form ref="settingForm" v-model="settingValid" lazy-validation>
            <v-row>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  outlined
                  dense
                  label="self_id"
                  :rules="[required]"
                  v-model="tempEnvs.self_id"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  outlined
                  dense
                  label="access_token"
                  v-model="tempEnvs.access_token"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-toolbar flat dense>
                  <v-toolbar-title>Sender</v-toolbar-title>
                  <v-spacer></v-spacer>
                  <v-btn
                    fab
                    x-small
                    color="success"
                    @click="
                      clearSender();
                      senderModal = true;
                    "
                  >
                    <v-icon small>fa-plus</v-icon>
                  </v-btn>
                </v-toolbar>
                <v-data-table dense :headers="senderKeys" :items="tempSenders">
                  <template v-slot:[`item.action`]="{ item }">
                    <v-btn
                      dark
                      x-small
                      color="primary"
                      @click="
                        copySender(item.user_id);
                        senderModal = true;
                      "
                    >
                      修改
                    </v-btn>
                    <v-btn
                      dark
                      x-small
                      color="red"
                      @click="deleteSender(item.user_id)"
                    >
                      删除
                    </v-btn>
                  </template>
                </v-data-table>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn outlined @click="settingModal = false">取消</v-btn>
          <v-btn outlined color="success" @click="saveEnv()">保存</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- SenderModal -->
    <v-dialog v-model="senderModal" width="350" max-width="95%">
      <v-card>
        <v-card-title class="headline">信息</v-card-title>
        <v-card-text>
          <v-form
            ref="senderForm"
            v-model="senderValid"
            lazy-validation
            @submit.prevent="changeSender"
          >
            <v-text-field
              label="user_id"
              type="number"
              v-model="tempSender.user_id"
              :rules="[required]"
            ></v-text-field>
            <v-text-field
              label="nickname"
              v-model="tempSender.nickname"
              :rules="[required]"
            ></v-text-field>
            <v-text-field label="card" v-model="tempSender.card"></v-text-field>
            <v-text-field label="sex" v-model="tempSender.sex"></v-text-field>
            <v-text-field
              label="age"
              type="number"
              v-model="tempSender.age"
            ></v-text-field>
            <v-text-field label="area" v-model="tempSender.area"></v-text-field>
            <v-text-field
              label="level"
              type="number"
              v-model="tempSender.level"
            ></v-text-field>
            <v-select
              label="role"
              :items="['owner', 'admin', 'member']"
              v-model="tempSender.role"
              :rules="[required]"
            ></v-select>
            <v-text-field
              label="title"
              v-model="tempSender.title"
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="senderModal = false">取消</v-btn>
          <v-btn
            text
            color="primary"
            :disabled="!senderValid"
            @click="changeSender"
            >确定</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import _ from "lodash";
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
  data: () => ({
    required: (v) => !!v || "该项必填",

    settingModal: false,
    settingValid: true,
    tempEnvs: {
      self_id: "",
      access_token: "",
      senders: {},
    },
    senderKeys: [
      { text: "ID", value: "user_id", align: "center", sortable: false },
      { text: "昵称", value: "nickname", align: "center", sortable: false },
      { text: "群名片", value: "card", align: "center", sortable: false },
      { text: "性别", value: "sex", align: "center", sortable: false },
      { text: "年龄", value: "age", align: "center", sortable: false },
      { text: "地区", value: "area", align: "center", sortable: false },
      { text: "等级", value: "level", align: "center", sortable: false },
      { text: "身份", value: "role", align: "center", sortable: false },
      { text: "专属头衔", value: "title", align: "center", sortable: false },
      { text: "操作", value: "action", align: "center", sortable: false },
    ],

    senderModal: false,
    currentSender: "",
    senderValid: true,
    tempSender: {
      user_id: "",
      nickname: "",
      card: "",
      sex: "",
      age: "",
      area: "",
      level: "",
      role: "",
      title: "",
    },
  }),
  computed: {
    envs: {
      get() {
        return this.$store.state.envs;
      },
      set(value) {
        console.log("[i] Update envs");
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
    tempSenders() {
      return Object.values(this.tempEnvs.senders);
    },
  },
  methods: {
    copyEnv() {
      this.tempEnvs = _.cloneDeep(this.envs);
    },
    saveEnv() {
      if (!this.$refs.settingForm.validate()) {
        return;
      }
      this.settingModal = false;
      let reconnect = false;
      if (
        this.tempEnvs.self_id !== this.envs.self_id ||
        this.tempEnvs.access_token !== this.envs.access_token
      ) {
        reconnect = true;
      }
      this.envs = _.cloneDeep(this.tempEnvs);
      if (reconnect) {
        this.$socket.io.opts.transportOptions.polling.extraHeaders[
          "X-Self-ID"
        ] = this.$store.state.envs.self_id;
        this.$socket.io.opts.transportOptions.polling.extraHeaders[
          "Authorization"
        ] = this.$store.state.envs.access_token;
        if (this.$socket.connected) {
          this.$socket.disconnect();
        }
        console.log(this.$socket);
        this.$socket.io.reconnecting = false;
        this.$socket.io.onclose();
      }
    },
    deleteSender(user_id) {
      this.$delete(this.tempEnvs.senders, user_id);
    },
    copySender(user_id) {
      this.currentSender = user_id;
      this.tempSender = { ...this.tempEnvs.senders[user_id] };
    },
    clearSender() {
      this.tempSender = {
        user_id: "",
        nickname: "",
        card: "",
        sex: "",
        age: "",
        area: "",
        level: "",
        role: "",
        title: "",
      };
    },
    changeSender() {
      if (!this.$refs.senderForm.validate()) {
        return;
      }
      this.senderModal = false;
      this.tempSender.user_id = parseInt(this.tempSender.user_id);
      this.tempSender.age = parseInt(this.tempSender.age) || null;
      this.tempSender.level = parseInt(this.tempSender.level) || null;

      if (this.currentSender !== this.tempSender.user_id) {
        this.$delete(this.tempEnvs.senders, this.currentSender);
      }
      this.$set(
        this.tempEnvs.senders,
        this.tempSender.user_id,
        this.tempSender
      );
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
