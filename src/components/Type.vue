<template>
  <div
    class="mdrop-body-item"
    ref="mdropBodyItem"
    :data-index="typeProp.type"
    @click="itemClick(typeProp.id)"
  >{{typeProp.type}}</div>
</template>

<script>
export default {
  data() {
    return {
      types: []
    };
  },
  methods: {
    itemClick(index) {
      // работа с DOM для того чтобы показать что умею использовать ref/refs + чтобы отображать активные пункты списка "Тип"
      // также здесь эмичу данные в Home.vue и пушу там эти данные в массив types из data для дальнейшей передачи во vuex, фильтрации и вывода постов...
      this.$refs.mdropBodyItem.classList.toggle("active");
      if (this.$refs.mdropBodyItem.classList.contains("active")) {
        this.types.push(this.$refs.mdropBodyItem.dataset.index);
        this.$emit("pushType", {'value': this.typeProp.type, 'push': true});
      } else {
        this.types = this.types.filter(
          item => item != this.$refs.mdropBodyItem.dataset.index
        );
        this.$emit("pushType", {'value': this.typeProp.type, 'push': false});
      }
    }
  },
  props: ["typeProp"] // опустил валидацию
};
</script>