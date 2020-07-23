import Vue from "vue";
import Vuex from "vuex";
import { padStart } from "lodash";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    groups: [],
    // currentGroup: "未分类",
    // currentTest: "未命名测试",
    // currentTestData: {},
  },
  mutations: {
    updateGroups: (state, payload) => {
      if (payload) {
        localStorage.setItem("nonebot-groups", JSON.stringify(payload));
        state.groups = payload;
      }
    },
    // changeCurrentTest: (state, payload) => {
    //   state.currentGroup = payload.currentGroup;
    //   state.currentTest = payload.currentTest;
    //   state.currentTestData = payload.currentTestData;
    // },
  },
  actions: {
    updateGroups: ({ commit }, payload) => {
      commit("updateGroups", payload);
    },
    // changeCurrentTest: ({ commit }, payload) => {
    //   commit("changeCurrentTest", payload);
    // },
  },
  modules: {},
});
