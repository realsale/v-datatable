<template>
  <div>
    <h3>No Sort Order</h3>
    <p>
      By default sort direction are asc and desc, setting
      <code>allowNoSort="true"</code> will add <code>none</code>
      sort oder to sorting directions.
    </p>
    <p>
      <code>none</code> sort order returns the original order of the rows.
    </p>
    <p>
      Can also be used together with
      <a href="" @click.prevent="select">reverseSort</a>.
    </p>

    <DataTable :data="rows" :columns="columns" :allowNoSort="true" />
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
  },
  methods: {
    select() {
      this.$emit("select", "SortReverse");
    }
  }
}
</script>
