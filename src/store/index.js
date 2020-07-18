import Vue from 'vue'
import Vuex from 'vuex'
import file from '../assets/hotels.json'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    initData: [],
    filteredData: []
  },
  mutations: {
    // производим первое получение данных и помещение в стейт. На основе этих данных буду прописывать геттеры для отрисовки фильтров
    initFetchData(state) {
      console.log('call initFetchData mutation');
      state.initData = file.hotels;
    },
    getFiltersPosts(state, data) {
      console.log(data)
      let fetchData = file.hotels;
      let result = [];

      console.log(result)
    }
  },
  actions: {
    // в данном случаи у нас  все операции будут синхронными, так как json лежит локально, поэтому экшены не нужны и работа будет производиться через мутации
  },
  getters: {
    getCountry(state) {
      console.log('call getCountry');
      let resArr = [];
      for (let item in state.initData) {
        if (!resArr.includes(state.initData[item].country)) {
          resArr.push(state.initData[item].country)
        }
      }
      return resArr.map((item, index) => {
        return {
          id: index,
          'country': item
        }
      })
    },
    getTypes(state) {
      console.log('call getTypes');
      let resArr = [];
      for (let item in state.initData) {
        if (!resArr.includes(state.initData[item].type)) {
          resArr.push(state.initData[item].type)
        }
      }
      return resArr.map((item, index) => {
        return {
          id: index + 1,
          'type': item
        }
      })
    },
    getStars(state) {
      console.log('call getStars');
      let resArr = [];
      for (let item in state.initData) {
        if (!resArr.includes(state.initData[item].stars)) {
          resArr.push(state.initData[item].stars)
        }
      }
      return resArr.map((item, index) => {
        return {
          id: index + 1,
          'star': item
        }
      })
    },
    getMaxPrice(state) {
      console.log('call getMaxPrice');
      let max = state.initData.map(item => {
        return item.min_price
      })
      return Math.max(...max)
    },
    getMinPrice(state) {
      console.log('call getMinPrice');
      let min = state.initData.map(item => {
        return item.min_price
      })
      return Math.min(...min)
    },
    getPosts(state) {
      return curPage => {
        console.log('call getPosts');
        console.log(curPage)
        return state.initData.map((item, index) => {
          return {
            id: index + 1,
            'name': item.name,
            'description': item.description
          }
        }).filter((item, ind) => ind < curPage * 3 && ind >= (curPage * 3 - 3))
      }
    },
    getPagination(state) {
      console.log('call getPagination');
      return state.initData.length
    }
  },
  modules: {
    // обычно работаю с модалями, но тут решил опустить этот момент
  }
})