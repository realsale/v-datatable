<template>
  <div>
    <h3>Client Side Crud Operations</h3>

    <p>
      Performing crud operations can be done by manipulating the source
      data.
    </p>

    <button type="button" @click="openModal(false)">Add New Record</button>

    <DataTable
      :columns="columns"
      :data="users"
      :pagination="{enabled: true, perPageOptions: [2, 5, 10], pageGoto: true}"
      :allowNoSort="true"
      :mergeDefault="true"
      :rowDetail="true"
      :rowSelect="true"
      @on-row-detail-change="rowDetailChange"
      @on-sort="onSort"
      @on-search="onSearch"
      @on-select="select"
      @on-select-all="selectAll"
    >
      <template  v-slot:field.action="{ row }">
        <button type="button" @click="openModal(true, row)">Edit</button>

        <button type="button" @click="deleteRecord(row.id)">Delete</button>
      </template>

      <template  v-slot:row-detail="{ row }">
        <div class="row-content">
          <p><b>FullName</b>: {{ row.firstName }} {{ row.lastName }}</p>
          <p><b>Age</b>: {{ row.age }}</p>
        </div>
      </template>
    </DataTable>

    <!-- modal -->
    <div v-if="modal" class="modal">
      <form @submit.prevent="updateRecords">
        <p>
          <label>
            Id: {{ user.id }}
          </label>
        </p>

        <p>
          <label>
            FirstName:
            <input type="text" v-model="user.firstName" />
          </label>
        </p>

        <p>
          <label>
            LastName:
            <input type="text" v-model="user.lastName" />
          </label>
        </p>

        <p>
          <label>
            Age:
            <input type="number" v-model="user.age" />
          </label>
        </p>

        <button>Save</button>
        <button type="button" @click="closeModal">Cancel</button>
      </form>
    </div>
  </div>
</template>

<script>
import DataTable from "../../src/components/DataTable.vue";

let uid = 0;

export default {
  components: {
    DataTable
  },
  data() {
    return {
      columns: [
        { field: "id" },
        { field: "firstName", label: "firstname", sortable: true, searchable: true },
        { field: "lastName", label: "lastname", sortable: true, searchable: true},
        { field: "age", label: "age", sortable: true, type: "number", searchable: true},
        { field: "action", label: "Actions"}
      ],
      users: [
      ],

      // modal
      modal: false,
      isEditing: false,
      user: null,

      // pagination classes
      pagClasses: {
        rootContainer: "um"
      }
    };
  },
  methods: {
    initiateUserModel() {
      return {
        id: uid + 1,
        firstName: "",
        lastName: "",
        age: ""
      };
    },
    reset() {
      this.modal = false;
      this.isEditing = false;
      this.user = null;
    },
    openModal(isEditing = false, user) {
      this.isEditing = isEditing;

      if (this.isEditing) {
        this.user = {...user};
      } else {
        this.user = this.initiateUserModel();
      }
      this.modal = true;
    },
    closeModal() {this.modal = false;},
    updateRecords() {
      if(this.isEditing) {
        const userIndex = this.users.findIndex(user => user.id == this.user.id);

        this.users.splice(userIndex, 1, this.user);
        this.reset();
      } else {
        this.user.id = ++uid;
        this.users.push(this.user);
        this.reset();
      }
    },
    deleteRecord(id) {
      this.users = this.users.filter(user => user.id != id);
    },
    rowDetailChange(row, open) {
      console.log("on-row-detail-change:", row, open)
    },
    select(d, isSelected) {
      console.log("on-select:", d, isSelected)
    },
    selectAll(rows) {
      console.log("on-select-all", rows)
    },
    onSort(field, dir) {
      console.log("on-sort:", field, dir)
    },
    onSearch(key, count) {
      console.log("on-search:", key, count)
    }
  }
}
</script>

<style scoped>
.row-content {
  background: #eee;
  padding: 8px;
}
</style>