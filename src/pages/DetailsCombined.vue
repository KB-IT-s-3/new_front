<template>
  <div class="container">
    <div class="half">
      <DetailsAdd />
    </div>
    <div class="half">
      <Details />
    </div>
  </div>
</template>

<script>
import DetailsAdd from './DetailsAdd.vue';
import Details from './Details.vue';

export default {
  components: {
    DetailsAdd,
    Details
  }
}
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: row;
  height: 100vh;
  max-width: none;
  padding: 0;
  background-color: #FEFFE2;
}

.half {
  flex: 1;
  overflow: auto;
}
</style>
