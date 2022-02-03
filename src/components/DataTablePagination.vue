<template>
  <div>
    <ul class="pagination">
      <li>
        <a class="pag-btn" @click="prev">Previous</a>
      </li>
      <li>
        <a class="pag-btn pag-btn--active">1</a>
      </li>
      <li>
        <a class="pag-btn" @click="next">Next</a>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "DataTablePagination",
  props: {
    total: {
      type: Number,
      required: true
    },
    perPage: {
      type: Number,
      default: 10
    },
    initialPage: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      page: this.initialPage
    }
  },
  methods: {
    prev() {
      --this.page;
      this.$emit("prev", this.page);
    },
    next() {
      ++this.page;
      this.$emit("next", this.page);
    },
    jump(pageNumber) {
      this.$emit("jump", pageNumber);
    }
  },
}
</script>

<style scoped>
.pagination {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: flex-end;
}

.pag-btn {
  display: inline-block;
  border-radius: 4px;
  padding: 8px 12px;
  font-size: 14px;
  font-weight: bold;
  color: #a8a8a8;
  cursor: pointer;
}

.pag-btn:hover:not(.pag-btn--active) {
  background: #eaeaea;
}

.pag-btn--active {
  background: #3399ff;
  color: #fff;
}
</style>