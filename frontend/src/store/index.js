import { createStore } from 'vuex'

const axios = require('axios');

const instance = axios.create({
  baseURL: "http://localhost:3000/api"
});

let storage = localStorage.getItem('storage');
if (storage == null) {
    storage = {
      userId: -1,
      token: '',
    };
} else {
  try {
    storage = JSON.parse(storage);
    instance.defaults.headers.common['Authorization'] = 'Bearer' + ' ' + storage.token;
  } catch (ex) {
    storage = {
      userId: -1,
      token: '',
    };
  }
}

export default createStore({
  state: {
    storage: storage,
    user: {},
  },
  mutations: {
    setStatus: function (state, status) {
      state.status = status;
    },
    logUser: function (state, storage) {
      instance.defaults.headers.common['Authorization'] = 'Bearer' + ' ' + storage.token;
      localStorage.setItem('storage', JSON.stringify(storage));
      state.storage = storage;
    },
    logout: function (state) {
      state.storage = {
        userId: -1,
        token: '',
      }
      localStorage.removeItem('storage');
    },
    SET_USER: function (state, user) {
      state.user = user;
    },
    GET_USER_BY_ID(state, user) {
      state.user = user;
    },
  },
  actions: {
    // users
    signup: ({commit}, user) => {
      commit('setStatus', 'loading');
      return new Promise((resolve, reject) => {
        instance.post('user/signup', user)
        .then((response) => {
          commit('setStatus', 'created');
          resolve (response);
        }).catch((error) => {
          commit('setStatus', 'error_signup');
          reject (error);
        })
      });
    },
    login: ({commit}, user) => {
      commit('setStatus', 'loading');
      return new Promise((resolve, reject) => {
        instance.post('user/login', user)
        .then((response) => {
          commit('setStatus', '');
          commit('logUser', response.data);
          resolve (response);
        }).catch((error) => {
          commit('setStatus', 'error_login');
          reject (error);
        })
      });
    },
    setUser({ commit }, user) {
      commit("SET_USER", user);
    },
    getUserById({ commit }) {
      let id = this.state.user.id;
      console.log(id);
      instance.get(`user/${id}`)
      .then((response) => {
        const user = response.data;
        commit("GET_USER_BY_ID", user);
      });
    },
  },
  modules: {
  }
})
