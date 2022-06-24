<template>
<div>
  <h1 class="title">Demonstration</h1>

  <nav class="tab-container">
    <ul class="tab wrapper">
      <li
        class="tab__item"
        :class="tabActiveClass(cl.name)"
        v-for="cl in compList"
        :key="cl.name"
        @click="select(cl.name)"
      >
        {{ cl.label }}
      </li>
    </ul>
  </nav>

  <section>
    <component
      class="wrapper"
      v-bind:is="currentTab"
      @select="select"
    >
    </component>
  </section>
</div>
</template>

<script>
import Basic from "./usage/Basic.vue";
import Search from "./usage/Search.vue";
import Sort from "./usage/Sort.vue";
import InitialSort from "./usage/InitialSort.vue";
import SortReverse from "./usage/SortReverse.vue";
import NoSortOrder from "./usage/NoSortOrder.vue";
import FormatFunction from "./usage/FormatFunction.vue";
import RowSelect from "./usage/RowSelect.vue";
import RowDetail from "./usage/RowDetail.vue";
import CustomStyle from "./usage/CustomStyle.vue";
import Pagination from "./usage/Pagination.vue";
import FieldSlot from "./usage/FieldSlot.vue";
import CRUD from "./usage/CRUD.vue";

export default {
  components: {
    Basic,
    Search,
    Sort,
    InitialSort,
    SortReverse,
    NoSortOrder,
    FormatFunction,
    RowSelect,
    RowDetail,
    CustomStyle,
    Pagination,
    FieldSlot,
    CRUD
  },
  data() {
    return {
      compList: [
        {
          name: "Basic",
          label: "Basic Usage"
        },
        {
          name: "Search",
          label: "Searching"
        },
        {
          name: "Sort",
          label: "Sorting"
        },
        {
          name: "InitialSort",
          label: "Initial Sorting"
        },
        {
          name: "SortReverse",
          label: "Reverse Sort"
        },
        {
          name: "NoSortOrder",
          label: "No Sort Order"
        },
        {
          name: "FormatFunction",
          label: "Format Function"
        },
        {
          name: "RowSelect",
          label: "Row Select"
        },
        {
          name: "RowDetail",
          label: "Row Detail"
        },
        {
          name: "CustomStyle",
          label: "Default and Customizable Style"
        },
        {
          name: "Pagination",
          label: "Pagination"
        },
        {
          name: "FieldSlot",
          label: "Field Slot"
        },
        {
          name: "CRUD",
          label: "Crud Operation"
        },
      ],
      currentTab: "Basic"
    }
  },
  methods: {
    select(name) {
      this.currentTab = name;
    },
    tabActiveClass(name) {
      return this.currentTab == name ? "tab__item--active" : "";
    }
  }
}
</script>

<style scoped>
.title {margin: 0;}

.tab-container {background: #9fa8da;}

.wrapper {
  max-width: 960px;
  margin: 0 auto;
}

.tab {
  list-style: none;
  height: 150px;
  padding: 4px;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  align-content: flex-start;
}

.tab__item {
  cursor: pointer;
  padding: 4px;
  background: #f48fb1;
  color: #fff;
  border-radius: 5px;
  margin: 4px;
}

.tab__item--active,
.tab__item:hover {background: #ec407a;}
</style>
