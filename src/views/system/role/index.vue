<template>
  <div class="app-container">
    <el-button type="primary" @click="handleAddRole">新增角色</el-button>
    <el-table :data="rolesList" style="width: 100%; margin-top: 30px" border v-loading="loading">
      <el-table-column align="center" label="序号" width="220" type="index">
      </el-table-column>
      <el-table-column align="center" label="角色" width="220">
        <template slot-scope="scope">
          {{ scope.row.roleName }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="220">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope)"
            >编辑</el-button
          >
          <el-button type="danger" size="small" @click="handleDelete(scope)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <pagination
      :total="pageInfor.total"
      @pageChange="turnPage"
      @sizeChange="sizeChange"
      :currentPage="pageInfor.pageNo"
    ></pagination>
    <role-dialog
      ref="form"
      :dialogType="dialogType"
      @confirm-role="onConfirmRole"
      :role="role"
    ></role-dialog>
  </div>
</template>

<script>
import pagination from "@/components/Pagination";
import { deepClone } from "@/utils";
import RoleDialog from "./RoleDialog.vue";
import { getRoles, deleteRoleById, updateRole, addRole } from "@/api/system";

const defaultRole = {
  roleKey: "",
  roleName: "",
  roleId: "",
};

export default {
  data() {
    return {
      loading: false,
      role: Object.assign({}, defaultRole),
      authTree: [],
      selectedAuth: [],
      routes: [],
      rolesList: [],
      dialogType: "new",
      defaultProps: {
        children: "children",
        label: "title",
      },
      pageInfor: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      },
    };
  },
  components: {
    RoleDialog,
    pagination,
  },
  created() {
    // Mock: get all routes and roles list from server
    this.setRolesList();
  },
  methods: {
    async setRolesList() {
      this.loading = true;
      const { pageNo, pageSize } = this.pageInfor;
      const { data } = await getRoles({ pageNo, pageSize });
      this.rolesList = data.records;
      this.pageInfor.total = data.total;
      this.loading = false;
    },
    onOpenDialog() {
      this.$refs.form.$emit("openDialog");
    },
    setCheckedNodes(routes) {
      this.$refs.form.$emit("checkedNodes", routes);
    },
    handleAddRole() {
      this.role = Object.assign({}, defaultRole);
      this.onOpenDialog();
      this.setCheckedNodes([]);
      this.dialogType = "new";
    },
    handleEdit(scope) {
      this.dialogType = "edit";
      this.onOpenDialog();
      this.role = deepClone(scope.row);
    },
    handleDelete({ $index, row }) {
      this.$confirm("是否确认删除该角色?", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const { data } = await deleteRoleById(row.roleId);
          if (data) {
            this.rolesList.splice($index, 1);
            this.$message({
              type: "success",
              message: "删除成功",
            });
          } else {
            this.$message.error("删除失败，该角色被用户使用");
          }
        })
        .catch((err) => {
          console.error(err);
        });
    },
    async onConfirmRole(role, menuOptions) {
      const isEdit = this.dialogType === "edit";
      // const checkedKeys = this.$refs.tree.getCheckedKeys();
      const { roleName, roleId } = role;
      let isOk = false;
      if (isEdit) {
        const { status } = await updateRole(
          { roleName, menuId: menuOptions },
          roleId
        );
        isOk = status === "success";
      } else {
        const { status } = await addRole({ roleName, menuId: menuOptions });
        isOk = status === "success";
        this.setRolesList();
      }
      if (isOk) {
        this.$notify({
          title: `${isEdit ? "编辑角色" : "新增角色"}`,
          dangerouslyUseHTMLString: true,
          message: `
            <div>角色名: ${roleName}</div>
          `,
          type: "success",
        });
      }
    },
    turnPage(val) {
      this.pageInfor.pageNo = val;
      this.setRolesList();
    },
    sizeChange(val) {
      this.pageInfor.pageSize = val;
      this.setRolesList();
    },
  },
};
</script>

<style lang="scss" scoped>
.app-container {
  .roles-table {
    margin-top: 30px;
  }
  .permission-tree {
    margin-bottom: 30px;
  }
}
</style>
