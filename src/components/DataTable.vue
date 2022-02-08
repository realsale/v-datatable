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
          {{ getProp(d, f) }}
        </td>
      </tr>
    </table>

    <DataTablePagination
      :initialPage="initialPage"
      :perPage="perPage"
      :total="data.length"
      @prev="pageChange"
      @next="pageChange"
      @jump="pageChange"
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
    initialPage: Number,
    perPageOptions: Array,
    perPage: Number
  },
  data() {
    return {
      fields: this.columns.map(c => c.field),
      activePerPage: this.perPage || 10,
      page: this.initialPage || 1
    };
  },
  methods: {
    getProp(obj, path) {
      // transform dotted string path to object property reference
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
  border: 1px solid #eee;
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
  background: #eee;
}

.datatable__td {
  padding: 16px 12px;
}
</style>
