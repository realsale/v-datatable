<template>
  <div class="container">
    <table class="datatable">
      <tr>
        <th class="datatable__th" v-for="c in columns" :key="c.field">
          {{ c.label || c.field.split(".")[0] }}
        </th>
      </tr>

      <tr v-for="d in limitData" :key="JSON.stringify(d)">
        <td class="datatable__td" v-for="f in fields" :key="d[f]">
          <slot :name="`field.${f}`" v-bind:record="d">
            {{ getProp(d, f) }}
          </slot>
        </td>
      </tr>
    </table>

    <DataTablePagination
      :total="data.length"
      v-bind="pagination"
      @initial-state="initialState"
      @on-page-change="pageChange"
      @on-page-option-change="perPageChange" />
  </div>
</template>

<script>
import DataTablePagination from "./DataTablePagination";

export default {
  name: "DataTable",
  components: {
    DataTablePagination
  },
  props: {
    data: Array,
    columns: {
      type: Array,
      required: true
    },
    pagination: Object
  },
  data() {
    return {
      fields: this.columns.map(c => c.field),
      page: 1,
      activePerPage: 10
    };
  },
  methods: {
    initialState(pagState) {
      this.page = pagState.page;
      this.activePerPage = pagState.perPage;
    },
    getProp(obj, path) {
      // transform dotted string path to object property reference
      if (!path) {
        console.warn("field key is missing");
        return;
      }
      return path.split(".").reduce((o, i) => o[i], obj);
    },
    pageChange(n) {
      this.page = n;
    },
    perPageChange(n) {
      this.activePerPage = n;
    }
  },
  computed: {
    recordStart() {
      return (this.page - 1) * this.activePerPage;
    },
    limitData() {
      return this.data.slice(this.recordStart, this.activePerPage * this.page);
    }
  }
};
</script>

<style scoped>
.container {
  max-width: 960px;
  margin: 0 auto;
}

.datatable {
  border: 1px solid #39f;
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
  border-radius: 5px;
  margin: 16px 0;
}

.datatable__th {
  text-align: left;
  text-transform: capitalize;
  padding: 8px 12px;
  background: #39f;
  color: #fff;
}

.datatable__td {
  padding: 16px 12px;
}
</style>
