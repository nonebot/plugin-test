import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    groups: {},
    tests: {},
    groupIndex: [],
    defaultGroup: "",

    messages: [],

    envs: {
      self_id: "",
      access_token: "",
      senders: {},
    },
  },
  mutations: {
    updateGroup: (state, payload) => {
      if (payload && payload.id) {
        state.groups[payload.id] = { ...state.groups[payload.id], ...payload };
        localStorage.setItem("nonebot-groups", JSON.stringify(state.groups));
      }
    },
    updateGroups: (state, payload) => {
      if (payload) {
        state.groups = payload;
        localStorage.setItem("nonebot-groups", JSON.stringify(state.groups));
      }
    },
    updateDefaultGroup: (state, payload) => {
      if (payload) {
        state.defaultGroup = payload;
      }
    },
    updateTest: (state, payload) => {
      if (payload && payload.id) {
        state.tests[payload.id] = { ...state.tests[payload.id], ...payload };
        localStorage.setItem("nonebot-tests", JSON.stringify(state.tests));
      }
    },
    updateTests: (state, payload) => {
      if (payload) {
        state.tests = payload;
        localStorage.setItem("nonebot-tests", JSON.stringify(state.tests));
      }
    },
    updateGroupIndex: (state, payload) => {
      if (payload) {
        state.groupIndex = payload;
        localStorage.setItem(
          "nonebot-groupIndex",
          JSON.stringify(state.groupIndex)
        );
      }
    },
    appendMessage: (state, payload) => {
      if (payload) {
        state.messages.push(payload);
      }
    },
    appendMessages: (state, payload) => {
      if (payload) {
        state.messages.concat(payload);
      }
    },
    deleteMessage: (state, payload) => {
      if (payload) {
        Vue.delete(state.messages, payload);
      }
    },
    clearMessages: (state) => {
      state.messages = [];
    },
    updateEnv: (state, payload) => {
      if (payload) {
        state.envs = payload;
        localStorage.setItem("nonebot-envs", JSON.stringify(state.envs));
      }
    },
  },
  actions: {
    updateGroup: ({ commit }, payload) => {
      commit("updateGroup", payload);
    },
    updateGroups: ({ commit }, payload) => {
      commit("updateGroups", payload);
    },
    restoreGroups: ({ commit }, payload) => {
      for (let i in payload) {
        if (payload[i].default === true) {
          commit("updateDefaultGroup", i);
        }
      }
      commit("updateGroups", payload);
    },
    updateTest: ({ commit }, payload) => {
      commit("updateTest", payload);
    },
    updateTests: ({ commit }, payload) => {
      commit("updateTests", payload);
    },
    updateGroupIndex: ({ commit }, payload) => {
      commit("updateGroupIndex", payload);
    },
    appendMessage: ({ commit }, payload) => {
      commit("appendMessage", payload);
    },
    appendMessages: ({ commit }, payload) => {
      commit("appendMessages", payload);
    },
    deleteMessage: ({ commit }, payload) => {
      commit("deleteMessage", payload);
    },
    clearMessages: ({ commit }) => {
      commit("clearMessages");
    },
    updateEnv: ({ commit }, payload) => {
      commit("updateEnv", payload);
    },
  },
  modules: {},
});
