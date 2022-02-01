<template>
  <div class="container">
    <table class="datatable">
      <tr>
        <th
          class="datatable__th"
          v-for="c in columns"
          :key="c.field">
            {{ c.label || c.field }}
        </th>
      </tr>

      <tr v-for="d in data" :key="JSON.stringify(d)">
        <td class="datatable__td" v-for="f in fields" :key="d[f]">{{ d[f] }}</td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  name: "DataTable",
  props: {
    data: Array,
    columns: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      fields: this.columns.map(c => c.field)
    };
  }
};
</script>

<style scoped>
.container {
  max-width: 960px;
  margin: 0 auto;
}

.datatable {
  border: 1px solid #eee;
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
  border-radius: 5px;
}

.datatable__th {
  text-align: left;
  text-transform: capitalize;
  padding: 8px 12px;
  background: #eee;
}

.datatable__td {
  padding: 16px 12px;
}
</style>
