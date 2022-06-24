import users from "./MOCK_DATA.json";

export default {
  data() {
    return {
      rows: this.rowLimit(),
      columns: this.columnDef()
    }
  },
  methods: {
    rowLimit(from = 0, to = 1000) {
      return users.slice(from, to);
    },
    columnDef(columns) {
      let defColumns = [
        { field: "id" },
        { field: "firstName", label: "firstname" },
        { field: "lastName", label: "lastname" },
      ];

      if (columns) defColumns = columns;

      return defColumns;
    }
  }
};
