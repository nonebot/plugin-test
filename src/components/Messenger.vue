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
                <v-btn icon small v-bind="attrs" v-on="on"
                  ><v-icon small>fa-trash-alt</v-icon></v-btn
                >
              </template>
              <span>Clear</span>
            </v-tooltip>
          </v-col>
        </v-row>
      </v-toolbar>
      <div class="chat-bg" style="min-height: 300px;"></div>
      <v-container fluid class="chat-bg py-0">
        <v-row dense class="mx-0">
          <v-col>
            <v-text-field dense solo hide-details height="28px"></v-text-field>
          </v-col>
          <v-col cols="auto">
            <v-btn color="primary" small rounded depressed>发送</v-btn>
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
    <!-- <div class="portlet-box portlet-fullHeight portlet-shadow mb-30">
      <div class="portlet-body chat-bg px-2">
        <template v-for="(item, index) in messages">
          <div
            v-if="item.position == 'right'"
            class="flex d-flex flex-row justify-content-end message wow fadeInRight"
            :key="index"
          >
            <div
              class="message-box"
              v-html="item.msg.replace(/\n/g, '<br/>').replace(/ /g, '&nbsp;')"
            ></div>
            <div
              class="avatar rounded-circle"
              style="background-color: #1565c0;"
            >
              <i class="fas fa-user"></i>
            </div>
          </div>
          <div
            v-else
            class="flex d-flex flex-row message wow fadeInLeft"
            :key="index"
          >
            <div
              class="message-box"
              v-html="item.msg.replace(/\n/g, '<br/>').replace(/ /g, '&nbsp;')"
            ></div>
            <img src="@/assets/logo.png" class="avatar rounded-circle" />
          </div>
        </template>
      </div>
    </div> -->
  </div>
</template>

<script>
// import { WOW } from "wowjs";

export default {
  name: "Messenger",
  methods: {
    // initWOW: function () {
    //   var wow = new WOW({
    //     noxClass: "wow",
    //     animateClass: "animated",
    //     offset: 0,
    //     mobile: true,
    //     live: true,
    //   });
    //   wow.init();
    // },
  },
  mounted() {
    // this.initWOW();
  },
};
</script>

<style scoped>
.chat-bg {
  background-color: #f3f6f9;
}

.message {
  position: relative;
}

.message .message-box {
  position: relative;
  width: fit-content;
  max-width: 55%;
  border-radius: 0.5rem;
  padding: 0.6rem 0.8rem;
  margin: 0.4rem 3rem;
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
.message.justify-content-end .message-box::after {
  left: 100%;
  right: auto;
  border-radius: 0 0 8px 0;
}

.message .avatar {
  top: 0px;
  left: -2px;
  width: 2.3rem;
  height: 2.3rem;
  position: absolute;
  user-select: none;
  pointer-events: none;
  text-align: center;
  line-height: 2.8rem;
  font-size: 1.2rem;
  color: #fff;
}
.message.justify-content-end .avatar {
  left: auto;
  right: -2px;
}
</style>
