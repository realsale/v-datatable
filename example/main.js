import Vue from "vue";
import Demo from "./Demo.vue";
import DataTable from "../src/components/DataTable.vue";

Vue.config.productionTip = false;

Vue.component("DataTable", DataTable);

new Vue({
  render: (h) => h(Demo),
}).$mount("#app");
