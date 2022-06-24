<template>
  <div>
    <h3>Global Search</h3>
    <p>
      Search is only available if you set <code>searchable: true</code>
      in any of your column.
    </p>
    <p>
      Global search affect all <strong>searchable</strong> column(s).
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
        { field: "firstName", label: "firstname", searchable: true },
        { field: "lastName", label: "lastname", searchable: true },
        { field: "age", searchable: true }
      ])
    };
  }
}
</script>
