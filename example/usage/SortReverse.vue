<template>
  <div>
    <h3>Reverse Sort</h3>
    <p>
      By default sort direction are from asc to desc,
      <code>reverseSort="true"</code> reverse the sort direction,
      desc to asc.
    </p>
    <p>
      Can also be used together with
      <a href="" @click.prevent="select">allowNoSort</a>.
    </p>

    <DataTable :data="rows" :columns="columns" :reverseSort="true" />
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
      this.$emit("select", "NoSortOrder");
    }
  }
}
</script>
