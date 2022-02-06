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

      <li v-for="(p, i) in pages" :key="i.toString().concat(p)">
        <a
          class="pag-btn"
          :class="{
            'pag-btn--active': page === p,
            'pag-btn--disabled': p === '...'
          }"
          @click="jump(p)">
          {{ p }}
        </a>
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
      if (this.page === pageNumber || pageNumber === "...") return;
      this.page = pageNumber;
      this.$emit("jump", pageNumber);
    }
  },
  computed: {
    lastPage() {
      return Math.ceil(this.total / this.perPage);
    },
    pages() {
      const pages = [];

      if (this.lastPage > 2) {
        /**
         * page-number links
         * max page number to be display, default: 7
         * first and last page are static
         * 
         * max page number = mpn
         * static page number = spn
         * dynamic page number = dpn
         * gap page number = itn
         * 
         * gap page number is the number of page(s) span
         * from dynamic page center
         * 
         * count must start/end with number excluding first/last page
         */
        const mpn = 7;
        const spn = 2;
        const dpn = mpn - spn;
        const gpn = Math.floor(dpn / 2);

        const len = this.lastPage > mpn ? dpn : this.lastPage - spn;
        const baseCntStart = 2;
        const baseCntEnd = this.lastPage - 1;
        let cntStart, cntEnd;

        for (let i = 0; i < len; ++i) {
          cntStart = this.page - gpn;
          cntStart = cntStart > baseCntStart ? cntStart : baseCntStart;

          cntEnd = this.page + gpn;
          if (cntEnd > baseCntEnd) cntStart -= cntEnd - baseCntEnd;

          cntStart += i;

          if (i === 0 && cntStart > baseCntStart) cntStart = "...";
          if (i === dpn - 1 && cntEnd < baseCntEnd) cntStart = "...";

          pages[i] = cntStart;
        }
      }

      // add first page to the beginning
      pages.unshift(1);
      // if total pages is more than 1, add last page to the end
      if (this.lastPage > 1) pages.push(this.lastPage);

      return pages;
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
  pointer-events: none;
  background: #3399ff;
  color: #fff;
  cursor: default;
}

.pag-btn--disabled {
  pointer-events: none;
  color: #ddd;
  cursor: default;
}
</style>
