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
            <option
              v-for="country in getCountry"
              :key="country.id"
              :value="country.country"
            >{{country.country}}</option>
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
              <div
                class="mdrop-body-item"
                v-for="item in getTypes"
                :key="item.id"
                ref="mdropBodyItem"
                :data-index="item.id"
                @click="itemClick(item.id)"
              >{{item.type}}</div>
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
          <button class="btn btn-success mb-3 mt-5" @click="clear()">Применить фильтры</button>
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
          <ul class="list-group">
            <li v-for="(item,ind) in collection" :key="ind" class="list-group-item">{{item}}</li>
          </ul>
          <div class="btn-toolbar">
            <div class="btn-group">
              <button
                class="btn btn-primary"
                v-for="(p,ind) in pagination.pages"
                :key="ind"
                @click.prevent="setPage(p)"
              >{{p}}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      country: "",
      types: [],
      stars: [],
      countFeed: "",
      price: "",
      data: [0, 1, 2, 3, 4, 5, 6, 7, 8], //массив постов для пагинации
      perPage: 3, //кол-во отображаемых постов
      pagination: {},
      
    };
  },
  created() {
   
    this.setPage(1);
    //производим запрос для получения данных и для того чтобы положить их в стейт. Так как нам еще не нужен отрисованный DOM использую хук created()
    this.$store.commit("initFetchData");
  },
  computed: {
    getPrice() {
      return this.price;
    },
    collection() {
      return this.paginate(this.data);
    },
    // получение постов после первой загрузки экрана
    getPosts() {
      return this.$store.getters.getPosts;
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
    setPage(p) {
      this.pagination = this.paginator(this.data.length, p);
    },
    paginate(data) {
      return _.slice(
        data,
        this.pagination.startIndex,
        this.pagination.endIndex + 1
      );
    },
    paginator(totalItems, currentPage) {
      let startIndex = (currentPage - 1) * this.perPage,
        endIndex = Math.min(startIndex + this.perPage - 1, totalItems - 1);
      return {
        currentPage: currentPage,
        startIndex: startIndex,
        endIndex: endIndex,
        pages: _.range(1, Math.ceil(totalItems / this.perPage) + 1)
      };
    },
    itemClick(index) {
      console.log(this.$refs);
      this.$refs.mdropBodyItem[index - 1].classList.toggle("active");
      if (this.$refs.mdropBodyItem[index - 1].classList.contains("active")) {
        this.types.push(this.$refs.mdropBodyItem[index - 1].dataset.index);
        console.log(this.types);
      } else {
        this.types = this.types.filter(
          item => item != this.$refs.mdropBodyItem[index - 1].dataset.index
        );
        console.log(this.types);
      }
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
      for (let i = 0; i < this.$refs.mdropBodyItem.length; i++) {
        if (this.$refs.mdropBodyItem[i].classList.contains("active")) {
          this.$refs.mdropBodyItem[i].classList.remove("active");
          this.$refs.mdropBody.classList.add("close");
        }
      }
      console.log(this.country);
      console.log(this.types);
    }
  }
};
</script>

<style scoped>
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