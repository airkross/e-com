import Vue from 'vue'
import Vuex from 'vuex'
import file from '../assets/hotels.json'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    initData: [],
    postsData: []
  },
  mutations: {
    // производим первое получение данных и помещение в стейт. На основе этих данных буду прописывать геттеры для отрисовки фильтров
    initFetchData(state) {
      console.log('call initFetchData mutation');
      state.initData = file.hotels;
      state.postsData = file.hotels;
    },
    // главная функция осуществляющая фильтрацию постов и обновляющая стейт с постами
    getFiltersPosts(state, data) {
      let fetchData = file.hotels;
      let result = [];
      if (data[0].length > 0) {
        for (let i = 0; i < data[0].length; i++) {
          fetchData = fetchData.filter(item => {
            if ((typeof data[0][i] == 'object')) {
              return item.reviews_amount >= data[0][i].reviews_amount
            } else {
              return item.country == data[0][i] || item.min_price < data[0][i]
            }
          })
        }
      }
      const keys = Object.keys(data[1]).filter(key => data[1].hasOwnProperty(key));
      result = fetchData.filter(elem => {
        const commonKeys = keys.filter(key => elem.hasOwnProperty(key));
        return commonKeys.reduce((flag, key) => (flag && data[1][key].includes(elem[key])), true);
      });
      state.postsData = result;
    }
  },
  actions: {
    // в данном случаи у нас  все операции будут синхронными, так как json лежит локально, поэтому экшены не нужны и работа будет производиться через мутации
  },
  getters: {
    // геттер получения стран. Использую для вывода списка фильтра стран. Также произвожу фильтрацию чтобы убрать дубликаты
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
    // геттер получения типов. Использую для вывода списка фильтра типов. Также произвожу фильтрацию чтобы убрать дубликаты
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
    // геттер получения звезд. Использую для вывода списка фильтра типов. Также произвожу фильтрацию чтобы убрать дубликаты
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
        return item.min_price + 1
      })
      return Math.max(...max)
    },
    getMinPrice(state) {
      console.log('call getMinPrice');
      let min = state.initData.map(item => {
        return item.min_price - 1
      })
      return Math.min(...min)
    },
    getPagination(state) {
      console.log('call getPagination');
      return state.postsData.length
    },
    // геттер получения постов. Использую для вывода списка постов.
    getPosts(state) {
      return curPage => {
        console.log('call getPosts');
        return state.postsData.map((item, index) => {
          return {
            id: index + 1,
            'name': item.name,
            'description': item.description
          }
        }).filter((item, ind) => ind < curPage * 3 && ind >= (curPage * 3 - 3))
      }
    }
  },
  modules: {
    // обычно работаю с модалями, но тут решил опустить этот момент
  }
})