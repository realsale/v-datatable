<template>
  <div id="app">
    <DataTable :data="users" :columns="columns" />
  </div>
</template>

<script>
import DataTable from "../src/components/DataTable.vue";
import users from "./MOCK_DATA.json";

export default {
  name: "App",
  components: {
    DataTable,
  },
  data() {
    return {
      users,
      columns: [
        { field: "firstName" },
        { field: "age", label: "age" },
        { field: "nationality", label: "nationality" },
      ]
    }
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
