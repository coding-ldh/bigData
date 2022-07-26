<template>
  <div class="user_container">
    <div class="search_container" style="margin-bottom: 10px">
      <el-form :inline="true" :model="queryInfor">
        <el-form-item label="账号:">
          <el-input
            v-model="queryInfor.account"
            placeholder="请输入账号"
          ></el-input>
        </el-form-item>
        <el-form-item label="真实姓名:">
          <el-input
            v-model="queryInfor.realName"
            placeholder="请输入账号名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="用户ID:">
          <el-input
            v-model="queryInfor.userId"
            placeholder="请输入用户ID"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="setUserList(false)">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" plain @click="userReset">重置</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleAddUser">新增</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="list_container">
      <div class="list_content">
        <el-table
          stripe
          style="width: 100%"
          :data="userList"
          v-loading="loading"
        >
          <el-table-column label="用户ID" prop="userId"></el-table-column>
          <el-table-column label="账号" prop="userName"></el-table-column>
          <el-table-column label="真实姓名" prop="realName"></el-table-column>
          <el-table-column label="角色" prop="roleName"></el-table-column>
          <el-table-column label="状态" align="center" key="status">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.status"
                active-value="0"
                inactive-value="1"
                @change="handleStatusChange(scope.row)"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="220">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="handleEdit(scope)"
                >编辑</el-button
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
      </div>
    </div>
    <user-dialog
      ref="form"
      :title="dialogType === 'edit' ? '编辑用户' : '新增用户'"
      @confirm-user="onConfirmUser"
      :userObj="userObj"
      :roles="roles"
    ></user-dialog>
  </div>
</template>

<script>
import pagination from "@/components/Pagination";
import UserDialog from "./UserDialog.vue";
import { deepClone } from "@/utils";
import { reset } from "@/utils/tool.js";
import {
  getUserList,
  getRoleNameList,
  updateUserStatus,
  addUser,
  editorUser,
} from "@/api/system";

export default {
  components: {
    pagination,
    UserDialog,
  },
  data() {
    return {
      loading: false,
      dialogType: "new",
      userObj: {},
      queryInfor: {
        userId: "",
        realName: "",
        account: "",
      },
      userList: [],
      copyQueryInfor: "",
      filterData: {},
      aiVoiceRecordList: [],
      pageInfor: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      },
      roles: [],
    };
  },
  created() {
    this.setRoles();
    this.setUserList();
  },
  methods: {
    userReset() {
      reset(this.queryInfor);
      this.setUserList();
    },
    async setRoles() {
      const { data } = await getRoleNameList();
      this.roles = data;
    },
    async setUserList(isPage = false) {
      this.loading = true;
      const inforData = !isPage ? this.getInforData() : this.copyQueryInfor;
      const { pageNo, pageSize } = this.pageInfor;
      const { data } = await getUserList({
        ...inforData,
        pageNo,
        pageSize,
      });
      this.loading = false;
      this.userList = data.records;
      this.pageInfor.total = data.total;
    },
    getInforData() {
      const { userId, realName, account } = this.queryInfor;
      const inforData = {
        userId,
        realName,
        userName: account,
      };
      this.pageInfor = {
        pageSize: 10,
        pageNo: 1,
      };
      this.copyQueryInfor = inforData;
      return inforData;
    },
    async onConfirmUser(userObj) {
      const isEdit = this.dialogType === "edit";
      if (!isEdit) {
        await addUser(userObj);
        this.setUserList();
      } else {
        await editorUser(userObj.userId, userObj);
        for (let index = 0; index < this.userList.length; index++) {
          if (this.userList[index].userId === this.userObj.userId) {
            this.userList.splice(index, 1, this.userObj);
            break;
          }
        }
      }
    },
    handleStatusChange(row) {
      let text = row.status === "0" ? "启用" : "停用";
      this.$confirm(
        '确认要"' + text + '""' + row.userName + '"用户吗?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return updateUserStatus({ userId: row.userId, status: row.status });
        })
        .then(() => {
          this.$message({
            type: "success",
            message: text + "成功",
          });
        })
        .catch(function () {
          row.status = row.status === "0" ? "1" : "0";
        });
    },
    onOpenDialog() {
      this.$refs.form.$emit("openDialog");
    },
    handleAddUser() {
      this.userObj = {};
      this.onOpenDialog();
      this.dialogType = "new";
    },
    handleEdit(scope) {
      this.dialogType = "edit";
      this.onOpenDialog();
      this.userObj = deepClone(scope.row);
    },
    turnPage(val) {
      this.pageInfor.pageNo = val;
      this.setUserList(true);
    },
    sizeChange(val) {
      this.pageInfor.pageSize = val;
      this.setUserList(true);
    },
  },
};
</script>

<style lang="scss" scoped>
.user_container {
  width: 100%;
  .list_container {
    font-size: 20px;
    padding: 30px 30px 10px;
    color: #333;
    background-color: #fff;
    .list_top {
      display: flex;
      justify-content: space-between;
      margin-bottom: 22px;
      align-items: center;
    }
  }
}
</style>