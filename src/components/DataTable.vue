<template>
  <div :class="obtainClasses.rootContainer">
    <div :class="obtainClasses.filterContainer">
      <input
        v-if="searchableFields.length"
        :class="obtainClasses.search"
        type="text"
        placeholder="Search"
        v-model="searchKey"
      />
    </div>

    <div :class="obtainClasses.tableContainer">
      <table :class="obtainClasses.table">
        <thead :class="obtainClasses.thead">
          <tr :class="obtainClasses.tr">
            <th v-if="rowSelect" :class="obtainClasses.th">
              <input
                :class="obtainClasses.rowSelectAll"
                ref="selectAll"
                type="checkbox"
                @change="selectAll"
                :checked="isAllRowSelected"
              />
            </th>

            <th v-if="rowDetail" :class="obtainClasses.th"></th>

            <th
              :class="[
                obtainClasses.th,
                {'_datatable__th--sort': c.sortable}
              ]"
              @click="sort(c.field, c.sortable, c.type)"
              v-for="c in columns"
              :key="c.field"
            >
              <div v-if="c.sortable" class="_sort-icon-wrapper">
                {{ c.label || c.field.split(".")[0] }}

                <span :class="sortClass(c.field, c.sortable)"></span>
              </div>

              <template v-else>
                {{ c.label || c.field.split(".")[0] }}
              </template>
            </th>
          </tr>
        </thead>

        <tbody :class="obtainClasses.tbody">
          <template v-for="d in limitData">
            <tr :class="obtainClasses.tr" :key="JSON.stringify(d)">
              <td v-if="rowSelect" :class="obtainClasses.td">
                <input
                  :class="obtainClasses.rowSelect"
                  type="checkbox"
                  :checked="d.isSelected"
                  @change="select(d)"
                />
              </td>

              <td v-if="rowDetail" :class="obtainClasses.td">
                <span
                  @click="toggleRowDetail(d)"
                  :class="[
                    obtainClasses.rowDetailBtn,
                    {
                      [obtainClasses.rowDetailBtnIconOpen || '']:
                        !d.isRowDetailOpen
                    },
                    {
                      [obtainClasses.rowDetailBtnIconClose || '']:
                        d.isRowDetailOpen
                    }
                  ]">
                </span>
              </td>

              <td
                :class="obtainClasses.td"
                v-for="f in fields"
                :key="f.concat(d[f])"
              >
                <slot :name="`field.${f}`" v-bind:record="d">
                  {{ getProp(d, f) }}
                </slot>
              </td>
            </tr>

            <tr
              v-if="rowDetail"
              v-show="d.isRowDetailOpen"
              :key="`${JSON.stringify(d)}-dropdown`"
              :class="obtainClasses.tr"
            >
              <td
                :class="[obtainClasses.td, obtainClasses.rowDetailTd]"
                :colspan="colspanFullWidth"
              >
                <slot name="row-detail" v-bind:row="d"></slot>
              </td>
            </tr>
          </template>

          <tr v-show="!limitData.length" :class="obtainClasses.tr">
            <td
              :class="[obtainClasses.td, obtainClasses.noRecordTd]"
              :colspan="colspanFullWidth"
            >
              {{ noRecordMessage }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <DataTablePagination
      v-if="pagination.enabled"
      :total="data.length"
      :filteredTotal="filteredData.length"
      :initialPage="pagination.initialPage"
      :perPageOptions="pagination.perPageOptions"
      :perPage="pagination.perPage"
      :pageGoto="pagination.pageGoto"
      :pagClasses="pagClasses"
      :mergeDefault="mergeDefault"
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
    rowSelect: {
      type: Boolean,
      default: false
    },
    rowDetail: {
      type: Boolean,
      default: false
    },
    dtClasses: {
      type: Object,
      default: () => ({})
    },
    mergeDefault: {
      type: Boolean,
      default: true
    },
    noRecordMessage: {
      type: String,
      default: "No records to show"
    },
    pagination: {
      type: Object,
      default: () => ({})
    },
    pagClasses: {
      type: Object,
      default: () => ({})
    }
  },
  created() {
    /**
     * conditionally watch data prop length if pagination disabled, assign data
     * length as active per page in order for limit data computed prop to work
     */
    if (this.pagination.enabled) return;
    this.$watch("data.length", newData => this.activePerPage = newData);
  },
  watch: {
    data: {
      handler() {
        this.$refs.selectAll.indeterminate = this.hasSelectedRow;
      },
      deep: true
    }
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

      return [
        this.obtainClasses.sort,
        {
          [this.obtainClasses.sortIconSort || ""]:
            (!isSameField && sortable) || (sortable && !isAsc && !isDesc),
          [this.obtainClasses.sortIconAsc || ""]: isSameField && isAsc,
          [this.obtainClasses.sortIconDesc || ""]: isSameField && isDesc
        }
      ];
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
    toggleRowDetail(d) {
      this.$set(d, 'isRowDetailOpen', !d.isRowDetailOpen);

      this.$emit("on-row-detail", d, d.isRowDetailOpen);
    },
    select(d) {
      this.$set(d, 'isSelected', !d.isSelected);

      this.$emit("on-select", d, d.isSelected);
    },
    selectAll(e) {
      this.filteredData.forEach(d => {
        this.$set(d, 'isSelected', e.target.checked);
      });

      this.$emit("on-select-all", this.selectedRow);
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

      let patt = String.raw`${this.searchKey}`.replace(/\\/g, "\\\\");
      patt = new RegExp(patt, "i");

      const filtered = this.formattedData.filter(d => {
        return this.searchableFields.find(sf => {
          return d[sf].toString().search(patt) < 0 ? false : true;
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
      if (!this.sortBy.field || this.sortBy.dir === "none")
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
    },
    selectedRow() {
      return this.data.filter(d => d.isSelected);
    },
    selectedRowCount() {return this.selectedRow.length;},
    isAllRowSelected() {
      return this.selectedRowCount == this.data.length &&
        this.selectedRowCount != 0;
    },
    hasSelectedRow() {
      return this.data.some(d => d.isSelected) && !this.isAllRowSelected;
    },
    obtainClasses() {
      // define component specific classes
      const defaultClasses = {
        rootContainer: "_root-container",
        filterContainer: "_filter-container",
        search: "_search",
        tableContainer: "_datatable-container",
        table: "_datatable",
        thead: "",
        tbody: "",
        tr: "",
        th: "_datatable__th",
        td: "_datatable__td",
        sort: "_icon",
        sortIconSort: "_icon__sort",
        sortIconAsc: "_icon__sort-asc",
        sortIconDesc: "_icon__sort-desc",
        rowSelect: "",
        rowSelectAll: "",
        rowDetailBtn: "_icon _row-toggle",
        rowDetailBtnIconOpen: "_icon__add-circle",
        rowDetailBtnIconClose: "_icon__remove-circle",
        rowDetailTd: "_datatable__td--no-padding",
        noRecordTd: "_datatable__td--text-center"
      }

      if (this.mergeDefault)
        return Object.assign(defaultClasses, this.dtClasses);
      return Object.keys(this.dtClasses).length ?
        this.dtClasses : defaultClasses;
    },
    colspanFullWidth() {
      let i = 0;

      if (this.rowSelect) ++i;
      if (this.rowDetail) ++i;

      return this.fields.length + i;
    }
  }
};
</script>

<style src="../assets/style/font-icon.css" scoped></style>

<style scoped>
._root-container {
  max-width: 960px;
  margin: 0 auto;
}

._filter-container {
  display: flex;
  align-items: center;
}

._search {
  padding: 8px 12px;
  border: 1px solid #bbb;
  outline: none;
  margin-left: auto;
}

._datatable-container {margin: 16px 0;}

._datatable {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

._datatable__th {
  text-align: left;
  text-transform: capitalize;
  padding: 8px 10px;
  user-select: none;
  border: 1px solid #bbb;
}

._datatable__td {
  padding: 8px 10px;
  border: 1px solid #bbb;
}

._datatable__td--no-padding {padding: 0;}

._datatable__td--text-center {text-align: center;}

._datatable__th--sort {cursor: pointer;}

._sort-icon-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

._icon__sort {color: #bbb;}

._icon__sort-asc,
._icon__sort-desc {color: #2c3e50;}

._row-toggle {
  cursor: pointer;
  font-size: 24px;
}

._icon__add-circle {color: #9595f7;}

._icon__remove-circle {color: #f79595;}
</style>
