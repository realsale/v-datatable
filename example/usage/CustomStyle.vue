<template>
  <div>
    <h3>Default and Customizable Style</h3>

    <p>
      v-datatable component allows you to fully customize its styles by passing
      an object containing a list of classes you want to customize into
      <code>dtClasses="{table: 'custom-table-class'}"</code>.
    </p>
    <p>
      The datatable has a component specific classes or default classes.<br />

      A class pass to any element property will take priority and will be use
      instead of default class.
    </p>
    <p>
      The specified custom classes will be merge into default classes by
      default.<br />

      If you prefer to use your custom classes and don't want to merge with
      default, you can do so by setting <code>mergeDefault="false"</code>
    </p>
    <p>
      Check this link for further details
      <a
        href="https://dev.to/realsale/vue-2-component-default-and-customizeable-style-38nj"
        target="_blank"
      >
        Default and Customizable Style
      </a>
    </p>

    <DataTable
      :data="rows"
      :columns="columns"
      :rowDetail="true"
      :dtClasses="dtClasses"
      :allowNoSort="true"
    >
      <template v-slot:row-detail="{ row }">
        <div class="row-content">
          <p><b>FullName</b>: {{ row.firstName }} {{ row.lastName }}</p>
          <p><b>Age</b>: {{ row.age }}</p>
          <p><b>Nationality</b>: {{ row.nationality }}</p>
        </div>
      </template>
    </DataTable>
  </div>
</template>

<script>
import rowMixin from "../row-mixin";

export default {
  mixins: [rowMixin],
  data() {
    return {
      rows: this.rowLimit(0, 10),
      columns: this.columnDef([
        { field: "id" },
        { field: "firstName", label: "firstname", sortable: true },
        { field: "lastName", label: "lastname", sortable: true }
      ]),
      dtClasses: {
        tr: "datatable__tr",
        th: "datatable__th",
        sort: "icon",
        sortIconSort: "icon-sort",
        sortIconAsc: "icon-sort-amount-asc",
        sortIconDesc: "icon-sort-amount-desc",
        rowDetailBtn: "icon row-toggle",
        rowDetailBtnIconOpen: "icon-add_circle",
        rowDetailBtnIconClose: "icon-remove_circle",
      },
    };
  },
}
</script>

<style src="../../public/style/custom-icon.css">
</style>

<style>
.row-content {
  background: #eee;
  padding: 8px;
}

/* custom class */
.datatable__th {
  /* background property is a custom rule */
  background: #ffcdd2;

  /* below rules are the default styles */
  text-align: left;
  text-transform: capitalize;
  padding: 12px 16px;
  user-select: none;
  border: 1px solid #bbb;
}

.row-toggle {
  /* custom */
  color: #29f;

  /* default */
  cursor: pointer;
  font-size: 24px;
}

.icon-remove_circle {color: red;}

.icon-sort {color: #666;}
</style>
