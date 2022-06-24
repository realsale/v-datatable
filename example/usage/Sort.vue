<template>
  <div>
    <h3>Sort</h3>
    <p>
      Sort is only available if you set <code>sortable: true</code>
      in any of your column.
    </p>
    <p>
      By default it only sorts <code>string</code> data type.<br />
      If you happen to sort other types, you must explicitly declare its type
      by setting <code>type: "string|number|date"</code>.
    </p>

    <DataTable :data="rows" :columns="columns" />
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
        { field: "lastName", label: "lastname", sortable: true },
        { field: "age", sortable: true, type: "number" }
      ])
    };
  }
}
</script>
