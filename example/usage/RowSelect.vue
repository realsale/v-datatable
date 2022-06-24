<template>
  <div>
    <h3>Row Select</h3>
    <p>
      Row select gives a row an ability to be selected by means of checkbox.
      <br />
      Setting <code>rowSelect="true"</code> will allow you to use row select
      functionality
    </p>

    <DataTable :data="rows" :columns="columns" :rowSelect="true" />
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
