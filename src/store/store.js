import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    titleList: [],
    newArr: [],
    name: ''
  },
  mutations: {
    SET_titleList(state, value) {
      state.titleList = value;
    },
    SET_newArr(state, value) {
      state.newArr = value;
    },
    SET_name(state, name) {
      state.name = name;
    }
  },
  actions: {},
  modules: {}
});