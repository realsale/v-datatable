<template>
  <div>
    <h3>Pagination</h3>
    <p>
      Pagination allows you to navigate through your records(rows) by splitting
      an (n) of records, creating pages.
    </p>
    <p>
      <code>pagination="{enabled: true}"</code> is the minimun required option
      to use pagination.
    </p>
    <p>
      You can also specify the initial page you want your v-datatable navigate
      to, by setting <code>pagination="{initialPage: 3}"</code>.<br />

      Initial page will not accept negative value and higher than the computed
      total pages, it will fallback to 1.
    </p>
    <p>
      Per-page options can also be modified by passing an array of per-page
      to <code>pagination="{perPageOptions: [5, 10, 25, 50]}"</code>.<br />

      Per-page options don't accept negative and duplicate value, it will
      fallback to [10, 25, 50].
    </p>
    <p>
      Initial page limit is can be specified by
      <code>pagination="{perPage: 10}"</code>.<br />

      Per-page also don't accept negative value and will fallback to per-page
      options first value, otherwise to 10.
    </p>
    <p>
      Pagination also offers a go-to or jump to specific page.<br />
      It is useful if you have a lot of pages.<br />

      Just set <code>pagination="{pageGoto: true}"</code>.
    </p>

    <DataTable :data="rows" :columns="columns" :pagination="pagination" />
  </div>
</template>

<script>
import rowMixin from "../row-mixin";

export default {
  mixins: [rowMixin],
  data() {
    return {
      columns: this.columnDef([
        { field: "id" },
        { field: "firstName", label: "firstname", searchable: true },
        { field: "lastName", label: "lastname", searchable: true },
        { field: "age", searchable: true }
      ]),
      pagination: {
        enabled: true,
        initialPage: 3,
        perPage: 5,
        perPageOptions: [5, 25, 50, 100],
        pageGoto: true
      }
    };
  }
}
</script>
