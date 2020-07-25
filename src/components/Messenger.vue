<template>
  <div class="qq-chat">
    <div class="portlet-box portlet-fullHeight portlet-shadow mb-30">
      <div
        class="portlet-header bg-primary flex-row flex d-flex align-items-center b-b"
      >
        <div class="flex d-flex justify-content-between">
          <h3>
            <i class="fas fa-chevron-left"></i>
          </h3>
          <!-- <h3>
            <i class="fas fa-dragon fa-fw"></i>
            <i class="fas fa-fire fa-fw"></i>
          </h3>-->
          <h3>🐲🔥</h3>
        </div>
        <div class="flex d-flex flex-column">
          <h3>NoneBot</h3>
        </div>
        <div class="portlet-tools">
          <ul class="nav">
            <li class="nav-item">
              <i class="fas fa-user-friends"></i>
            </li>
          </ul>
        </div>
      </div>
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
      <div class="portlet-body chat-bg pb-1">
        <div class="form-group row mb-0">
          <div class="col-9 p-1">
            <input
              type="text"
              class="form-control form-control-sm disabled bg-white"
            />
          </div>
          <div class="col-3 p-1">
            <button
              class="form-control form-control-sm btn btn-sm btn-rounded btn-primary btn-block"
            >
              发送
            </button>
          </div>
        </div>
        <div class="row text-center">
          <div class="col-2">
            <i class="fas fa-microphone"></i>
          </div>
          <div class="col-2">
            <i class="fas fa-image"></i>
          </div>
          <div class="col-2">
            <i class="fas fa-camera"></i>
          </div>
          <div class="col-2">
            <i class="fas fa-wallet"></i>
          </div>
          <div class="col-2">
            <i class="fas fa-smile-wink"></i>
          </div>
          <div class="col-2">
            <i class="fas fa-plus-circle"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import { WOW } from "wowjs";

export default {
  name: "chat-interface",
  props: {
    messages: Array,
  },
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
