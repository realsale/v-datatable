<template>
  <div :class="obtainClasses.rootContainer">
    <div :class="obtainClasses.perPage">
      <label
        :class="obtainClasses.perPageLabel"
        for="per-page"
      >
        Show: &nbsp;
      </label>

      <select
        id="per-page"
        :class="obtainClasses.perPageSelect"
        @change="selectPageOption($event.target.value)"
      >
        <option v-for="p in perPageOptions" :key="p">{{ p }}</option>
      </select>
    </div>

    <div v-if="pageGoto" :class="obtainClasses.pageGoto">
      <input
        type="number"
        :class="obtainClasses.pageGotoInput"
        size="3"
        v-model.number="goto"
        :min="1"
        :max="lastPage"
        :placeholder="page"
        @keyup.enter="updatePage('goto')"
      />

      <button
        type="button"
        :class="obtainClasses.pageGotoBtn"
        @click="updatePage('goto')"
      >
        Go
      </button>
    </div>

    <p :class="obtainClasses.pageDetails">
      {{ recordStart }} - {{ recordShow }} of {{ total }}
    </p>

    <ul :class="obtainClasses.paging">
      <li>
        <a
          :class="[
            obtainClasses.pagingBtn,
            {[obtainClasses.pagingBtnDisabled || '']: !hasPrev}
          ]"
          @click="updatePage('prev')"
        >
          Prev
        </a>
      </li>

      <li v-for="(p, i) in pages" :key="i.toString().concat(p)">
        <a
          :class="[
            obtainClasses.pagingBtn,
            {[obtainClasses.pagingBtnActive || '']: page === p},
            {[obtainClasses.pagingBtnDisabled || '']: p === '...'}
          ]"
          @click="updatePage('jump', p)"
        >
          {{ p }}
        </a>
      </li>

      <li>
        <a
          :class="[
            obtainClasses.pagingBtn,
            {[obtainClasses.pagingBtnDisabled || '']: !hasNext}
          ]"
          @click="updatePage('next')"
        >
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
    initialPage: {
      type: Number,
      default: 1
    },
    perPageOptions: {
      type: Array,
      default() {
        return [10, 25, 50];
      },
      validator(value) {
        return value.every(v => typeof v === "number");
      }
    },
    perPage: {
      type: Number,
      default() {
        return this.perPageOptions[0] || 10;
      }
    },
    pageGoto: {
      type: Boolean,
      default: false
    },
    pagClasses: {
      type: Object,
      default: () => ({})
    },
    mergeDefault: {
      type: Boolean,
      default: true
    }
  },
  created() {
    // emits initial pagination states
    this.$emit("initial-state", {
      page: this.page,
      perPage: this.selectedPerPage
    });
  },
  watch: {
    total() {
      this.updatePage();
    }
  },
  data() {
    return {
      page: this.initialPage,
      selectedPerPage: this.perPage,
      goto: ""
    };
  },
  methods: {
    updatePage(type, p) {
      switch (type) {
        case "prev":
          if (!this.hasPrev) return;
          --this.page;
          break;

        case "next":
          if (!this.hasNext) return;
          ++this.page;
          break;

        case "jump":
          if (this.page === p || p === "...") return;
          this.page = p;
          break;

        case "goto":
          this.goto = Math.floor(this.goto) ? Math.floor(this.goto) : "";

          if (
            this.page === this.goto ||
            this.goto < 1 ||
            this.goto > this.lastPage)
            return;

          this.page = this.goto;
          this.goto = "";
          break;

        default:
          if (this.page === 1) return;

          this.page = 1;
          break;
      }

      this.$emit("on-page-change", this.page);
    },
    selectPageOption(perPage) {
      this.selectedPerPage = Number(perPage);
      this.updatePage();

      this.$emit("on-page-option-change", perPage);
    }
  },
  computed: {
    recordStart() {
      if (!this.total) return 0;
      return (this.page - 1) * this.selectedPerPage + 1;
    },
    recordShow() {
      if (this.total < this.page * this.selectedPerPage)
        return this.total;
      return this.page * this.selectedPerPage;
    },
    lastPage() {
      return Math.ceil(this.total / this.selectedPerPage);
    },
    pages() {
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
      const pages = [];
      const mpn = 7;
      const spn = 2;
      let i;

      if (this.lastPage > mpn) {
        const dpn = mpn - spn;
        const gpn = Math.floor(dpn / 2);

        const len = this.lastPage > mpn ? dpn : this.lastPage - spn;
        const baseCntStart = 2;
        const baseCntEnd = this.lastPage - 1;
        let cntStart, cntEnd;

        for (i = 0; i < len; ++i) {
          cntStart = this.page - gpn;
          cntStart = cntStart > baseCntStart ? cntStart : baseCntStart;

          cntEnd = this.page + gpn;
          if (cntEnd > baseCntEnd) cntStart -= cntEnd - baseCntEnd;

          cntStart += i;

          if (i === 0 && cntStart > baseCntStart) cntStart = "...";
          if (i === dpn - 1 && cntEnd < baseCntEnd) cntStart = "...";

          pages[i] = cntStart;
        }
      } else if (this.lastPage > spn) {
        for (i = 2; i < this.lastPage; ++i) {
          pages.push(i);
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
    },
    obtainClasses() {
      // define component specific classes
      const defaultClasses = {
        rootContainer: "_root-container",
        perPage: "_per-page",
        perPageLabel: "",
        perPageSelect: "_per-page__select",
        pageDetails: "_page-details",
        pageGoto: "_page-goto",
        pageGotoInput: "_page-goto__input",
        pageGotoBtn: "_page-goto__btn",
        paging: "_paging",
        pagingBtn: "_paging__btn",
        pagingBtnActive: "_paging__btn--active",
        pagingBtnDisabled: "_paging__btn--disabled"
      }

      if (this.mergeDefault)
        return Object.assign(defaultClasses, this.pagClasses);
      return Object.keys(this.pagClasses).length ?
        this.pagClasses : defaultClasses;
    }
  }
};
</script>

<style scoped>
._root-container {
  display: flex;
  flex-direction: row;
  align-items: baseline;
  justify-content: space-evenly;
  flex-wrap: wrap;
  font-size: 14px;
  user-select: none;
}

._per-page__select {
  border: 1px solid #39f;
  border-radius: 4px;
  background: #fff;
  padding: 8px 12px;
}

._page-details {
  margin-left: 16px;
}

._page-goto {margin-left: 16px;}

._page-goto__input {
  border: 1px solid #39f;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
  padding: 8px 12px;
  outline: none;
}

._page-goto__input::-webkit-outer-spin-button,
._page-goto__input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

._page-goto__input {
  -moz-appearance: textfield;
}

._page-goto__btn {
  padding: 8px 12px;
  border: 1px solid #39f;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  background: #39f;
  color: #fff;
  cursor: pointer;
}

._paging {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  margin-left: 16px;
}

._paging__btn {
  display: inline-block;
  border-radius: 4px;
  padding: 8px 12px;
  font-weight: bold;
  color: #a8a8a8;
  cursor: pointer;
}

._paging__btn:hover:not(._paging__btn--active):not(._paging__btn--disabled) {
  background: #eaeaea;
}

._paging__btn--active,
._paging__btn--disabled {
  pointer-events: none;
  cursor: default;
}

._paging__btn--active {
  background: #39f;
  color: #fff;
}

._paging__btn--disabled {
  color: #ddd;
}

._per-page,
._page-details,
._page-goto,
._paging {
  margin-top: 16px;
}

@media only screen and (min-width: 650px) {
  ._root-container {
    justify-content: flex-end;
  }
}
</style>
