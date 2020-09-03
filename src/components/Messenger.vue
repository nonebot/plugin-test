<template>
  <div class="qq-chat">
    <v-card class="elevation-6">
      <v-toolbar color="primary" dark dense flat>
        <v-row no-gutters>
          <v-col>
            <v-row no-gutters justify="space-between">
              <v-col cols="auto">
                <v-icon small>fa-chevron-left</v-icon>
              </v-col>
              <v-col cols="auto">
                <h3>🔥</h3>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="auto">
            <h3>NoneBot</h3>
          </v-col>
          <v-col class="text-right">
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-btn class="mr-2" icon small v-bind="attrs" v-on="on"
                  ><v-icon small>fa-terminal</v-icon></v-btn
                >
              </template>
              <span>Terminal</span>
            </v-tooltip>
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon small v-bind="attrs" v-on="on"
                  ><v-icon small>fa-trash-alt</v-icon></v-btn
                >
              </template>
              <span>Clear</span>
            </v-tooltip>
          </v-col>
        </v-row>
      </v-toolbar>
      <v-container fluid class="chat chat-bg">
        <template v-for="(item, index) in messages">
          <v-row
            v-if="item.position === 'right'"
            justify="end"
            :key="index"
            class="message"
          >
            <div
              class="message-box"
              v-html="item.msg.replace(/\n/g, '<br/>').replace(/ /g, '&nbsp;')"
            ></div>
            <v-avatar color="blue lighten-2" size="36">
              <v-icon small>fa-user</v-icon>
            </v-avatar>
          </v-row>
          <v-row
            v-else-if="item.position === 'left'"
            justify="start"
            :key="index"
            class="message"
          >
            <v-avatar color="transparent" size="36">
              <v-img src="@/assets/logo.png"></v-img>
            </v-avatar>
            <div
              class="message-box"
              v-html="item.msg.replace(/\n/g, '<br/>').replace(/ /g, '&nbsp;')"
            ></div>
          </v-row>
          <v-row v-else justify="center" :key="index" class="notify">
            <div class="notify-box">
              <span style="display: inline; white-space: nowrap">
                <v-icon x-small color="blue" left>fa-info-circle</v-icon>
              </span>
              <span
                v-html="
                  item.msg.replace(/\n/g, '<br/>').replace(/ /g, '&nbsp;')
                "
              ></span>
            </div>
          </v-row>
        </template>
      </v-container>
      <v-container fluid class="chat-bg py-0">
        <v-row dense class="mx-0">
          <v-col>
            <v-text-field dense solo hide-details height="28px"></v-text-field>
          </v-col>
          <v-col cols="auto">
            <v-btn
              style="font-size: 0.8rem"
              color="primary"
              small
              rounded
              depressed
              >发送</v-btn
            >
          </v-col>
        </v-row>
        <v-row class="text-center" no-gutters>
          <v-col class="pa-1" cols="2">
            <v-icon small>fa-microphone</v-icon>
          </v-col>
          <v-col class="pa-1" cols="2">
            <v-icon small>fa-image</v-icon>
          </v-col>
          <v-col class="pa-1" cols="2">
            <v-icon small>fa-camera</v-icon>
          </v-col>
          <v-col class="pa-1" cols="2">
            <v-icon small>fa-wallet</v-icon>
          </v-col>
          <v-col class="pa-1" cols="2">
            <v-icon small>fa-smile-wink</v-icon>
          </v-col>
          <v-col class="pa-1" cols="2">
            <v-icon small>fa-plus-circle</v-icon>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </div>
</template>

<script>
import { WOW } from "wowjs";

export default {
  name: "Messenger",
  data: () => ({
    messages: [
      { position: "right", msg: "奥术大师大所大所大所大所大多所大所多" },
      { position: "left", msg: "奥术大师大所大所大所大所大多所大所多" },
      { position: "center", msg: "您已被禁言" },
    ],
  }),
  computed: {
    // messages() {
    //   return this.$store.state.messages;
    // },
  },
  methods: {
    initWOW: function () {
      var wow = new WOW({
        noxClass: "wow",
        animateClass: "animated",
        offset: 0,
        mobile: true,
        live: true,
      });
      wow.init();
    },
  },
  mounted() {
    this.initWOW();
  },
};
</script>

<style scoped>
.chat {
  min-height: 400px;
  overflow-y: scroll;
}
.chat-bg {
  background-color: #f3f6f9;
}

.message {
  position: relative;
  margin: 0;
}
.message .message-box {
  position: relative;
  width: fit-content;
  max-width: 55%;
  border-radius: 0.5rem;
  padding: 0.6rem 0.8rem;
  margin: 0.4rem 0.8rem;
  background-color: #fff;
}
.message .message-box::after {
  content: "";
  position: absolute;
  right: 100%;
  top: 0;
  width: 8px;
  height: 12px;
  color: #fff;
  border: 0 solid transparent;
  border-bottom: 7px solid;
  border-radius: 0 0 0 8px;
}
.message.justify-end .message-box::after {
  left: 100%;
  right: auto;
  border-radius: 0 0 8px 0;
}

.notify {
  position: relative;
}
.notify .notify-box {
  max-width: 70%;
  background: #e0e0e0;
  border-radius: 10px;
  padding: 5px 12px;
  font-size: 12px;
}
</style>
