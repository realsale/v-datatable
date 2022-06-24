<template>
  <div>
    <h3>Row Detail</h3>
    <p>
      Row detail allows you to provide an accordion content with the help of
      slot.
    </p>
    <p>
      In order for row detail to be available, you need to specify
      <code>rowDetail="true"</code> and provide a slot content.
    </p>
    <p>
      Here is a snippet of row detail slot<br />
      <code>{row}</code> here contains all the data in a single row
      <pre>
        <code>
          &lt;template v-slot:row-detail="{ row }"&gt;
            &lt;div class="row-content"&gt;
              My accordion content
            &lt;/div&gt;
          &lt;/template&gt;
        </code>
      </pre>
    </p>

    <DataTable :data="rows" :columns="columns" :rowDetail="true">
      <template v-slot:row-detail="{ row }">
        <div class="row-content">
          <p><b>FullName</b>: {{ row.firstName }} {{ row.lastName }}</p>
          <p><b>Age</b>: {{ row.age }}</p>
          <p><b>Nationality</b>: {{ row.nationality }}</p>
        </div>
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
      rows: this.rowLimit(0, 10)
    };
  }
}
</script>

<style scoped>
.row-content {
  background: #eee;
  padding: 8px;
}
</style>
