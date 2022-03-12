<template>
  <div class="container">
    <div class="filter">
      <input
        class="search"
        type="text"
        placeholder="Search"
        v-model="searchKey" />
    </div>

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
      :total="filteredData.length"
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
    initialSort: {
      type: Object,
      default: () => ({})
    },
    reverseSort: {
      type: Boolean,
      default: false
    },
    allowNoSort: {
      type: Boolean,
      default: false
    },
    pagination: Object
  },
  data() {
    return {
      fields: this.columns.map(c => c.field),
      searchKey: "",
      sortBy: this.initializeSortBy(),
      page: 1,
      activePerPage: 10
    };
  },
  methods: {
    initializeSortBy() {
      let column, field = "", dir = "none", type = "";

      /**
       * by making sure that only sortable field is allowed to initially sorted
       * find column via initial sort field key and check if it is sortable
       */
      if (this.initialSort.field) {
        column = this.columns.find(c => {
          return c.sortable && c.field === this.initialSort.field;
        });
      }

      if (column) {
        // extracting field and type of sortable field
        field = column.field;
        type = column.type || "";

        // check if dir field in initial sort has valid value (asc|desc)
        if (this.initialSort.dir === "asc" || this.initialSort.dir === "desc")
          dir = this.initialSort.dir;
      }

      return { field, dir, type };
    },
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
        // get sort dir index to increment its value
        let i = this.sortDirs.indexOf(this.sortBy.dir);
        this.sortBy.dir = this.sortDirs[++i % this.dirsCount];
      } else {
        this.sortBy.field = field;
        this.sortBy.dir = this.sortDirs[0];
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
      this.$emit("on-page-change", n);
    },
    perPageChange(n) {
      this.activePerPage = n;
      this.$emit("on-page-option-change", n);
    }
  },
  computed: {
    formattedData() {
      const formatableFields = this.columns
        .filter(c => {
          return c.format && typeof c.format === "function";
        });

      if (formatableFields.length) {
        return this.data.map(d => {
          formatableFields.forEach(f => {
            d[f.field] = f.format(d[f.field]);
          });

          return d;
        });
      }
      return this.data;
    },
    searchableFields() {
      return this.columns.filter(c => c.searchable).map(c => c.field);
    },
    filteredData() {
      if (!this.searchableFields.length || !this.searchKey)
        return this.formattedData;

      const searchPattern = new RegExp(this.searchKey, "i");

      const filtered = this.formattedData.filter(d => {
        return this.searchableFields.find(sf => {
          return d[sf].toString().search(searchPattern) < 0 ? false : true;
        });
      });

      this.$emit("on-search", {
        searchKey: this.searchKey,
        rowCount: filtered.length
      });

      return filtered;
    },
    sortDirs() {
      const sortDirs = ["asc", "desc"];

      if (this.reverseSort) sortDirs.reverse();
      if (this.allowNoSort) sortDirs.push("none");

      return sortDirs;
    },
    dirsCount() {
      return this.sortDirs.length;
    },
    sortedData() {
      if (
        !this.sortBy.field ||
        this.sortBy.dir === "none")
        return this.filteredData;

      const typeFn = this.sortTypeFunction(this.sortBy.type);

      return this.filteredData.slice(0).sort((itemA, itemB) => {
        let a = itemA,
          b = itemB;

        if (this.sortBy.dir === "desc") {
          a = itemB;
          b = itemA;
        }

        return typeFn(a[this.sortBy.field], b[this.sortBy.field]);
      });
    },
    recordStart() {
      return (this.page - 1) * this.activePerPage;
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
  table-layout: fixed;
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
  user-select: none;
}

.datatable__td {
  padding: 16px 12px;
}

.filter {
  display: flex;
  align-items: center;
}

.search {
  padding: 8px 12px;
  border: 1px solid #39f;
  outline: none;
  margin-left: auto;
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

.sort--asc::before {
  border-bottom-color: #fff;
}

.sort--desc::after {
  border-top-color: #fff;
}
</style>
