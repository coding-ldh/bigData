<template>
  <el-dialog :visible.sync="dialogVisible" :title="title">
    <el-form
      :model="userObj"
      label-width="80px"
      label-position="left"
      ref="userForm"
      :rules="rules"
    >
      <el-form-item label="账号名" prop="userName">
        <el-input v-model="userObj.userName" placeholder="请输入账号名" style="width:100%"/>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="userObj.password" placeholder="请输入密码" style="width:100%"/>
      </el-form-item>
      <el-form-item label="姓名" prop="realName">
        <el-input v-model="userObj.realName" placeholder="请输入姓名" style="width:100%"/>
      </el-form-item>
      <el-form-item label="角色" prop="roleName">
        <el-select v-model="userObj.roleName">
          <el-option v-for="(role,index) in roles" :key="index" :value="role.roleName"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态">
        <el-switch
          v-model="userObj.status"
          active-value="0"
          inactive-value="1"
        ></el-switch>
      </el-form-item>
    </el-form>
    <div style="text-align: right">
      <el-button type="danger" @click="closeDialog">取消</el-button>
      <el-button type="primary" @click="confirmUser"
        >确定</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
import { validatePass, validateAccount } from "./UserRule.js";

export default {
  props: {
    title: {
      type: String,
      default: "新增角色",
    },
    userObj: {
      type: Object,
      default: {},
    },
    roles: {
      type: Array,
      default: [],
    }
  },
  data() {
    return {
      rules: {
        password: [
          {
            min: 6,
            max: 16,
            message: "长度在 6 到 16 个字符",
            trigger: "blur",
          },
          { required: true, validator: validatePass, trigger: "blur" },
        ],
        userName: [
          {
            min: 2,
            max: 16,
            message: "长度在 2 到 16 个字符",
            trigger: "blur",
          },
          { required: true, validator: validateAccount, trigger: "blur" },
        ],
        realName: [
          { required: true, message: "姓名不能为空", trigger: "blur" },
          { max: 20, message: "长度在 20 个字符以内", trigger: "blur" },
        ],
        roleName: [
          { required: true, message: "请选择角色", trigger: "change" },
        ],
      },
      dialogVisible: false,
    };
  },
  created() {
    this.$on("openDialog", function () {
      this.$nextTick(() => {
        this.$refs.userForm.clearValidate();
      });
      this.dialogVisible = true;
    });
  },
  methods: {
    closeDialog() {
      this.dialogVisible = false;
    },
    confirmUser() {
      this.$refs.userForm.validate((valid) => {
        if (valid) {
          this.$emit("confirm-user", this.userObj)
          this.closeDialog();
          this.$message.success(`${this.title}成功`);
        } else {
          this.$message.error(`${this.title}失败`)
          return false;
        }
      });
    },
  },
};
</script>

<style>
</style>