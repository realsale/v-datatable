<template>
  <div>
    <h3>Initial Sorting</h3>
    <p>
      Initial sort allows a column to be pre-sorted by setting
      <code>initialSort="{field: 'fieldName', dir: 'sort order'}"</code>.
    </p>

    <DataTable
      :data="rows"
      :columns="columns"
      :initialSort="initialSort"
    />
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
      ]),
      initialSort: {
        field: "lastName",
        dir: "desc"
      }
    };
  }
}
</script>
