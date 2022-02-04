<template>
  <div>
    <ul class="pagination">
      <li>
        <a
          class="pag-btn"
          :class="{'pag-btn--disabled': !hasPrev}"
          @click="prev">
          Previous
        </a>
      </li>
      <li>
        <a class="pag-btn pag-btn--active">1</a>
      </li>
      <li>
        <a
          class="pag-btn"
          :class="{'pag-btn--disabled': !hasNext}"
          @click="next">
          Next
        </a>
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
    };
  },
  methods: {
    prev() {
      if (!this.hasPrev) return;
      --this.page;
      this.$emit("prev", this.page);
    },
    next() {
      if (!this.hasNext) return;
      ++this.page;
      this.$emit("next", this.page);
    },
    jump(pageNumber) {
      this.$emit("jump", pageNumber);
    }
  },
  computed: {
    lastPage() {
      return Math.ceil(this.total / this.perPage);
    },
    hasPrev() {
      if (this.page <= 1) return false;
      return true;
    },
    hasNext() {
      if (this.page >= this.lastPage) return false;
      return true;
    }
  }
};
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
  user-select: none;
}

.pag-btn:hover:not(.pag-btn--active):not(.pag-btn--disabled) {
  background: #eaeaea;
}

.pag-btn--active {
  background: #3399ff;
  color: #fff;
}

.pag-btn--disabled {
  pointer-events: none;
  color: #ddd;
  cursor: default;
}
</style>
