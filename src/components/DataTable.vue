<template>
  <div class="container">
    <table class="datatable">
      <tr>
        <th
          class="datatable__th"
          :class="sortClass(c.field, c.sortable)"
          @click="sort(c.field, c.sortable, c.type)"
          v-for="c in columns"
          :key="c.field"
        >
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
      @on-page-option-change="perPageChange"
    />
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
      sortBy: {
        field: "",
        dir: "",
        type: ""
      },
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
    sortClass(field, sortable) {
      return {
        sort: sortable,
        "sort--asc": field === this.sortBy.field && this.sortBy.dir === "asc",
        "sort--desc": field === this.sortBy.field && this.sortBy.dir === "desc"
      };
    },
    sort(field, sortable, type) {
      if (!sortable) return;

      if (this.sortBy.field === field) {
        this.sortBy.field = this.sortBy.dir === "desc" ? "" : field;
        this.sortBy.dir = this.sortBy.dir === "" ?
          "asc" : this.sortBy.dir === "asc" ?
          "desc" : "";
      } else {
        this.sortBy.field = field;
        this.sortBy.dir = "asc";
      }
      this.sortBy.type = type || "";
    },
    sortTypeFunction(type) {
      if (type === "number") {
        return (a, b) => a - b;
      } else if(type === "date") {
        return (a, b) => new Date(a) - new Date(b);
      } else {
        return (a, b) => a.toLowerCase() <= b.toLowerCase() ? -1 : 1;
      }
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
    sortedData() {
      if (!this.sortBy.field) return this.data;

      const typeFn = this.sortTypeFunction(this.sortBy.type);

      return this.data.slice(0).sort((itemA, itemB) => {
        let a = itemA,
          b = itemB;

        if (this.sortBy.dir === "desc") {
          a = itemB;
          b = itemA;
        }

        return typeFn(a[this.sortBy.field], b[this.sortBy.field]);
      });
    },
    limitData() {
      return this.sortedData.slice(
        this.recordStart,
        this.activePerPage * this.page
      );
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

.sort {
  position: relative;
  cursor: pointer;
}

.sort::before,
.sort::after {
  content: "";
  position: absolute;
  left: 100%;
  margin-left: -12px;
  border: 6px solid transparent;
  border-bottom-color: #bbb;
  top: 25%;
  transform: translateY(-50%);
}

.sort::after {
  top: initial;
  bottom: 25%;
  transform: translateY(50%);
  border-bottom-color: transparent;
  border-top-color: #bbb;
}

.sort--desc::before {
  border-bottom-color: #fff;
}

.sort--desc::after {
  border-top-color: transparent;
}

.sort--asc::after {
  border-top-color: #fff;
}

.sort--asc::before {
  border-bottom-color: transparent;
}
</style>
