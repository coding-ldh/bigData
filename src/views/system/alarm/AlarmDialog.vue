<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :title="title"
    :close-on-click-modal="false"
  >
    <el-form
      :model="alarmObj"
      label-width="100px"
      label-position="left"
      :rules="rules"
      ref="alarmForm"
      class="alarm_form"
    >
      <el-form-item label="波动阙值" prop="threshold">
        <el-input
          v-model="alarmObj.threshold"
          placeholder="请输入波动阙值"
          style="width: 100%"
          :disabled="disabled"
        />
      </el-form-item>
      <el-form-item label="邮件接收人" prop="email">
        <el-input
          v-model="alarmObj.email"
          placeholder="请输入邮箱地址"
          style="width: 490px; margin-right: 20px"
          :disabled="disabled"
        ></el-input>
        <el-button style="margin-top:15px" type="primary" @click="handleAdd" v-if="!disabled"
          >添加</el-button
        >
      </el-form-item>
      <el-form-item label="">
        <ul>
          <li v-for="item in arrEmail" :key="item">
            <div class="email_item">{{ item }}</div>
            <el-button
              type="danger"
              @click="handleDelete(item)"
              v-if="!disabled"
              >删除</el-button
            >
          </li>
        </ul>
      </el-form-item>
    </el-form>
    <div style="text-align: right" v-if="!disabled">
      <el-button type="danger" @click="closeDialog">取消</el-button>
      <el-button type="primary" @click="confirmAlarm">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { validateEmail, validateThreshold } from "./Alarm.js";
import { deepClone } from "@/utils";
export default {
  props: {
    alarm: {
      type: Object,
      default: {},
    },
    dialogType: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      rules: {
        threshold: [
          { required: true, validator: validateThreshold, trigger: "blur" },
        ],
        email: [{ required: true, validator: validateEmail, trigger: "blur" }],
      },
      arrEmail: [],
      dialogVisible: false,
      alarmObj: {
        email: "",
      },
    };
  },
  created() {
    this.$on("openDialog", function () {
      this.$nextTick(() => {
        this.$refs.alarmForm && this.$refs.alarmForm.clearValidate();
        this.initData();
      });
      this.dialogVisible = true;
    });
  },
  computed: {
    title() {
      return this.dialogType === "edit" ? "编辑" : "详情";
    },
    disabled() {
      return this.dialogType === "edit" ? false : true;
    },
  },
  methods: {
    initData() {
      this.alarmObj = { ...this.alarm, email: "" };
      this.arrEmail = deepClone(this.alarmObj.emails);
    },
    closeDialog() {
      this.dialogVisible = false;
    },
    handleDelete(emailValue) {
      const emailIndex = this.arrEmail.indexOf(emailValue);
      if (emailIndex !== -1) {
        this.arrEmail.splice(emailIndex, 1);
      }
    },
    handleAdd() {
      this.$refs["alarmForm"].validate((valid) => {
        const email = this.alarmObj.email.trim();
        if (valid && email && !this.arrEmail.includes(email)) {
          this.arrEmail.push(email);
        } else {
          this.alarmObj.email = "";
        }
      });
    },
    confirmAlarm() {
      this.alarmObj.emails = this.arrEmail;
      this.$refs["alarmForm"].validate((valid) => {
        if (valid) {
          this.$emit("confirm-alarm", this.alarmObj);
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.alarm_form {
  ul {
    > li {
      border-bottom: 1px solid rgb(240, 240, 240);
      display: flex;
      // flex-direction: column;
      margin-bottom: 22px;
      .email_item {
        display: inline-block;
        width: 490px;
        margin-right: 20px;
      }
      .el-button {
      }
    }
  }
}
</style>
