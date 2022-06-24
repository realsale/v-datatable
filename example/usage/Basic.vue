<template>
  <div>
    <h3>Basic Usage</h3>
    <p>Simple tabular data rendering.</p>
    <p>
      The <code>data</code> and <code>column</code> are the minimum prop
      required for DataTable to work.
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
      rows: this.rowLimit(0, 10)
    };
  }
}
</script>
