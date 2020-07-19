<template>
  <div class="home">
    <div class="container">
      <div class="row">
        <div class="col-4 d-flex flex-column align-items-center">
          <!-- -------------------- -->
          <button class="btn btn-primary mb-3 mt-5" @click="clear()">Очистить фильтры</button>
          <!-- -------------------- -->
          <h4>Страна:</h4>
          <input list="countries" v-model="country" />
          <datalist id="countries" name="countries">
            <!-- вынес блок в компонент Country.vue -->
            <app-country v-for="country in getCountry" :key="country.id" :countryProp="country"></app-country>
          </datalist>
          <!-- -------------------- -->
          <h4>Тип:</h4>
          <div class="mdrop">
            <div class="mdrop-title" @click="toggle()" ref="mdropTitle">
              <span>Можественный выбор</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                version="1.1"
                id="Capa_1"
                x="0px"
                y="0px"
                width="15"
                height="10"
                viewBox="0 0 284.929 284.929"
                style="enable-background:new 0 0 284.929 284.929;"
                xml:space="preserve"
              >
                <g>
                  <path
                    d="M282.082,76.511l-14.274-14.273c-1.902-1.906-4.093-2.856-6.57-2.856c-2.471,0-4.661,0.95-6.563,2.856L142.466,174.441   L30.262,62.241c-1.903-1.906-4.093-2.856-6.567-2.856c-2.475,0-4.665,0.95-6.567,2.856L2.856,76.515C0.95,78.417,0,80.607,0,83.082   c0,2.473,0.953,4.663,2.856,6.565l133.043,133.046c1.902,1.903,4.093,2.854,6.567,2.854s4.661-0.951,6.562-2.854L282.082,89.647   c1.902-1.903,2.847-4.093,2.847-6.565C284.929,80.607,283.984,78.417,282.082,76.511z"
                  />
                </g>
              </svg>
            </div>
            <div class="mdrop-body close" ref="mdropBody">
              <!-- вынес блок в компонент Type.vue, который в home.vue итерирую через v-for и произвожу работу с пропсами.-->
              <!-- Все последующие блоки не выносил в отдельные компоненты -->
              <app-type
                v-for="item in getTypes"
                :key="item.id"
                :typeProp="item"
                @pushType="pushType($event)"
              ></app-type>
            </div>
          </div>
          <!-- ------------------- -->
          <h4>Звезды:</h4>
          <div class="star" v-for="star in getStars" :key="star.id">
            <!-- произвожу фильтрацию для подстановки подходящего окончания звезд,звезд[а],звезд[ы] -->
            <label :for="star.id">{{star.star | stars(star.star) }}</label>
            <input type="checkbox" :id="star.id" :value="star.star" v-model="stars" />
          </div>
          <!-- ------------------- -->
          <h4>Кол-во отзывов от:</h4>
          <!-- применяю модификаторы для удаление пробелов и преобразования строки к числу -->
          <input type="text" v-model.number.trim="countFeed" />
          <!-- ------------------- -->
          <h4>Цена до:</h4>
          <div class="range">
            <div class="min">{{getMinPrice}}</div>
            <input
              type="range"
              v-model="price"
              :min="getMinPrice"
              :max="getMaxPrice"
              :step="(getMaxPrice - getMinPrice)/10"
            />
            <div class="max">{{getMaxPrice}}</div>
          </div>
          {{price}}
          <!-- ------------------- -->
          <button class="btn btn-success mb-3 mt-5" @click="submit">Применить фильтры</button>
        </div>
        <div class="col-8">
          <div class="row post-title">
            <div class="col-4">Название</div>
            <div class="col-8">Описание</div>
          </div>
          <div class="row post" v-for="post in getPosts" :key="post.id">
            <div class="col-4">{{post.name}}</div>
            <div class="col-8">{{post.description}}</div>
          </div>
          <div class="pag">
            <div class="prev" @click="curPage == 1? curPage:curPage--">Назад</div>
            <div class="pags" ref="pages">
              <div
                :class="p==curPage? 'p act':'p'"
                v-for="(p,ind) in getPages"
                :data-page="p"
                :key="ind"
                @click="curPage = p"
              >{{p}}</div>
            </div>
            <div class="next" @click="curPage == pages? curPage:curPage++">Вперед</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import appCountry from "../components/Country";
import appType from "../components/Type";
export default {
  name: "Home",
  components: {
    appCountry,
    appType
  },
  data() {
    return {
      country: "",
      types: [],
      stars: [],
      countFeed: "",
      price: "",
      postsCount: "",
      pages: "",
      curPage: ""
    };
  },
  created() {
    //производим запрос для получения данных и для того чтобы положить их в стейт. Так как нам еще не нужен отрисованный DOM использую хук created()
    this.$store.commit("initFetchData");
  },
  computed: {
    // возвращаю кол-во страниц и произвожу некоторые операции
    getPages() {
      this.postsCount = this.$store.getters.getPagination;
      this.curPage = 1;
      this.pages = Math.ceil(this.postsCount / 3);
      return this.pages;
    },
    // получаем цену
    getPrice() {
      return this.price;
    },
    // получение постов после первой загрузки экрана
    getPosts() {
      return this.$store.getters.getPosts(this.curPage);
    },
    // получение списка стран для фильтра
    getCountry() {
      return this.$store.getters.getCountry;
    },
    // получение списка типов для фильтра
    getTypes() {
      return this.$store.getters.getTypes;
    },
    // получение списка звезд для фильтра
    getStars() {
      return this.$store.getters.getStars;
    },
    // получение максимальной цены для input[range]
    getMaxPrice() {
      return this.$store.getters.getMaxPrice;
    },
    //получение минимальной цены для input[range]
    getMinPrice() {
      return this.$store.getters.getMinPrice;
    }
  },
  // использую вотчер, чтобы следить за изменениями инпута и обрезания дродной части
  // можно было написать обработчик через события, но решил 1 раз добавить вотчер, чтобы показать что знаю о нем
  // на практике использую вотчеры редко, так как сильно грузям приложение
  watch: {
    countFeed: function(val) {
      if (Number.isInteger(val) || val == "") {
        this.countFeed = val;
      } else {
        this.countFeed = Math.trunc(val);
      }
    }
  },
  methods: {
    pushType(type) {
      if (type.push) {
        this.types.push(type.value);
      } else {
        this.types = this.types.filter(item => item != type.value);
      }
    },
    // отправляем запрос на получение отфильтрованых постов
    submit() {
      let data = [];
      let data1 = [];
      let obj = {};
      if (this.country) {
        data.push(this.country);
      }
      if (this.types.length) {
        obj.type = this.types;
      }
      if (this.stars.length) {
        obj.stars = this.stars;
      }
      if (this.countFeed) {
        data.push({ reviews_amount: this.countFeed });
      }
      if (this.price) {
        data.push(this.price);
      }
      data1.push(obj);
      this.$store.commit("getFiltersPosts", [data, obj]);
    },

    toggle() {
      this.$refs.mdropBody.classList.toggle("close");
    },
    clear() {
      console.log("call crear method");
      this.country = "";
      this.types = [];
      this.stars = [];
      this.countFeed = "";
      this.price = "";
      for (
        let i = 0;
        i <
        this.$refs.mdropBody.getElementsByClassName("mdrop-body-item").length;
        i++
      ) {
        if (
          this.$refs.mdropBody
            .getElementsByClassName("mdrop-body-item")
            [i].classList.contains("active")
        ) {
          this.$refs.mdropBody
            .getElementsByClassName("mdrop-body-item")
            [i].classList.remove("active");
          this.$refs.mdropBody.classList.add("close");
        }
      }
    }
  }
};
</script>

<style scoped>
.pag {
  display: flex;
  justify-content: center;
  margin-top: 32px;
}
.pags {
  display: flex;
}
.pags .p {
  margin-right: 8px;
  margin-left: 8px;
  cursor: pointer;
}
.pags .p.act {
  font-weight: 700;
}
.next {
  margin-left: 10px;
  cursor: pointer;
}
.prev {
  margin-right: 10px;
  cursor: pointer;
}
.pag-wrap {
  display: flex;
  justify-content: center;
  padding-top: 32px;
  padding-bottom: 32px;
}
.pag-item {
  margin-right: 15px;
  padding: 5px 15px;
  cursor: pointer;
  border-radius: 5px;
  border: 1px solid rgba(0, 0, 0, 0.2);
}
.pag-item.active {
  border: 1px solid rgba(65, 50, 204, 1);
}
.post-title {
  height: 80px;
  background: rgb(194, 194, 194);
  border-bottom-left-radius: 15px;
  border-bottom-right-radius: 15px;
  margin-bottom: 30px;
  color: white;
  font-weight: 700;
  font-size: 16px;
}
.post {
  border-bottom: 1px solid rgb(180, 180, 180);
  padding-top: 25px;
  padding-bottom: 25px;
}
.btn {
  max-width: 200px;
  width: 100%;
}
.range {
  display: flex;
}
.star {
  display: flex;
  align-items: center;
  height: 40px;
}
label {
  margin-right: 10px;
  margin-bottom: 0;
}
.mdrop {
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  border: 1px solid rgba(0, 0, 0, 0.1);
}
.mdrop-title {
  height: 40px;
  padding-left: 10px;
  padding-right: 10px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid rgba(0, 0, 0, 0.1);
}
.mdrop-title span {
  margin-right: 5px;
}
.mdrop-body.close {
  display: none;
}
.mdrop-body .mdrop-body-item {
  width: 100%;
  height: 40px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding-left: 10px;
  padding-right: 10px;
  display: flex;
  align-items: center;
  cursor: pointer;
}
.mdrop-body .mdrop-body-item.active {
  background: rgb(226, 226, 226);
}
.mdrop-body .mdrop-body-item:hover {
  background: rgb(226, 226, 226);
}
.mdrop-body .mdrop-body-item:last-child {
  border-bottom: none;
}
</style>