<template>
  <!-- тут коментировать особо нечего. Вывожу данные из пропса -->
  <option :value="countryProp.country">{{countryProp.country}}</option>
</template>

<script>
export default {
  props: ["countryProp"] // опустил валидацию
};
</script>