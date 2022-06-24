<template>
  <div>
    <h3>Field Slot</h3>
    <p>
      Field slot allows you to provide an alternative content rather than
      simply displaying your data. <br />
    </p>
    <p>
      To use field slot a field must be existing, because a field name
      is gonna be part of slot name <br />
      <code>v-slot:<b>field.nameOfYourField</b></code>.
    </p>
    <p>
      Field slot has a <code>{row}</code> params, it contains the current
      row data. <br />

      By defining a field name that is not a part of your data structure, will
      allow you to use as a custom/virtual column. Fitting container for
      actions.
    </p>
    <p>
      Note: any transformation or formatting you made in a field slot will
      not affect searching and sorting.<br />

      As they will look for processed data and not to already rendered data.

      If you want format data that'll affect how searching and sorting works,
      you should use the
      <a href="" @click.prevent="select">format function</a> instead.
    </p>

    <DataTable :data="rows" :columns="columns">
      <template v-slot:field.age="{ row }">
        <span
          class="tag"
          :class="{
            'tag--senior': row.age >= 60,
            'tag--capable': row.age < 60
          }"
        >
          {{ row.age }}
        </span>
      </template>

      <!-- action is a custom field -->
      <template v-slot:field.action="{ row }">
        <button type="button" @click="alert(row)">Alert</button>
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
        { field: "firstName", label: "firstname" },
        { field: "lastName", label: "lastname" },
        { field: "age" },
        { field: "action" } // custom field
      ])
    };
  },
  methods: {
    alert(row) {
      alert(JSON.stringify(row));
    },
    select() {
      this.$emit("select", "FormatFunction");
    }
  }
}
</script>

<style scoped>
.tag {
  display: block;
  padding: 4px;
  border-radius: 5px;
  color: #fff;
  text-align: center;
}

.tag--senior {background: red;}

.tag--capable {background: green;}
</style>
