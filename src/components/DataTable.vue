<template>
  <div class="root-container">
    <div class="filter">
      <input
        class="search"
        type="text"
        placeholder="Search"
        v-model="searchKey"
      />
    </div>

    <div class="datatable-container">
      <table class="datatable">
        <thead>
          <tr>
            <th v-if="rowDetail" class="datatable__th"></th>

            <th
              class="datatable__th"
              :class="{'datatable__th--sort': c.sortable}"
              @click="sort(c.field, c.sortable, c.type)"
              v-for="c in columns"
              :key="c.field"
            >
              <div v-if="c.sortable" class="sort-wrapper">
                {{ c.label || c.field.split(".")[0] }}

                <span class="icon" :class="sortClass(c.field, c.sortable)">
                </span>
              </div>

              <template v-else>
                {{ c.label || c.field.split(".")[0] }}
              </template>
            </th>
          </tr>
        </thead>

        <tbody>
          <template v-for="(d, i) in limitData">
            <tr :key="JSON.stringify(d)">
              <td v-if="rowDetail" class="datatable__td">
                <span
                  :ref="`btn${i}`"
                  @click="toggleRowDetail(i)"
                  class="icon icon__add-circle row-toggle">
                </span>
              </td>

              <td class="datatable__td" v-for="f in fields" :key="d[f]">
                <slot :name="`field.${f}`" v-bind:record="d">
                  {{ getProp(d, f) }}
                </slot>
              </td>
            </tr>

            <tr
              v-if="rowDetail"
              :key="`${JSON.stringify(d)}-dropdown`"
              :ref="`tr${i}`"
              class="row-detail"
            >
              <td
                class="datatable__td datatable__td--no-padding"
                :colspan="fields.length + 1"
              >
                <slot name="row-detail" v-bind:row="d"></slot>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>

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
    rowDetail: {
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
      const isSameField = field == this.sortBy.field;
      const isAsc = this.sortBy.dir == "asc";
      const isDesc = this.sortBy.dir == "desc";

      return {
        'icon__sort': !isSameField && sortable || sortable && !isAsc && !isDesc,
        "icon__sort-asc": isSameField && isAsc,
        "icon__sort-desc": isSameField && isDesc
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
    toggleRowDetail(i) {
      const btn = this.$refs[`btn${i}`][0];
      const tr = this.$refs[`tr${i}`][0];
      let oldClass = "icon__remove-circle";
      let newClass = "icon__add-circle";

      if (btn.classList.contains("icon__add-circle")) {
        oldClass = "icon__add-circle";
        newClass = "icon__remove-circle";
      }

      btn.classList.replace(oldClass, newClass);
      btn.classList.toggle("row-toggle--close");
      tr.classList.toggle("row-detail--show");
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

<style src="../assets/style/font-icon.css" scoped></style>

<style scoped>
.root-container {
  max-width: 960px;
  margin: 0 auto;
}

.datatable-container {margin: 16px 0;}

.datatable {
  table-layout: fixed;
  border: 1px solid #39f;
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
  border-radius: 5px;
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

.datatable__td--no-padding {
  padding: 0;
}

.datatable__th--sort {cursor: pointer;}

.sort-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.icon__sort {color: #bbb;}

.row-toggle {
  cursor: pointer;
  font-size: 24px;
  color: #29f;
}

.row-toggle--close {
  color: tomato;
}

.row-detail {display: none;}

.row-detail--show {display: table-row;}

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
</style>
