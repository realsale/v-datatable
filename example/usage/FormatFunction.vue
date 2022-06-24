<template>
  <div>
    <h3>Format Function</h3>
    <p>
      In some cases you may want to modify your data in a specific format.
      <br />
      <code>format</code> function allows you to pass a function ang gives you
      a cell data as a parameter for you to modify in any format you need.
    </p>
    <p>
      Note: Formatted data affects the sort and search filter.
    </p>
    <p>
      Crit: Be careful of changing the data type if you're going to use a sort
      feature.<br /> If you have a column with type option defined to number
      and suddenly formats a data to any valid type, then sort might not work.
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
        {
          field: "firstName",
          label: "firstname",
          searchable: true,
          format(val) {
            return `Boss ${val}`;
          }
        },
        { field: "lastName", label: "lastname", searchable: true },
        { 
          field: "age",
          searchable: true,
          format(age) {
            // this will change the data type of age field
            // sort will not work here
            return `${age}(${age > 50 ? "senior" : "capable"})`;
          }
        },
      ])
    };
  }
}
</script>
