<template>
  <div class="alarm_container">
    <el-table
      :data="alarmList"
      style="width: 100%; margin-top: 30px"
      border
      v-loading="loading"
    >
      <el-table-column align="center" label="序号" type="index" width="220">
      </el-table-column>
      <el-table-column align="center" label="名称" width="220">
        <template slot-scope="scope">
          {{ scope.row.notifyTitle }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="邮件接收人" width="280">
        <template slot-scope="scope">
          <div v-for="emailItem in scope.row.messageReceivers.slice(0,5)" :key="emailItem">
            {{ emailItem }}
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="波动阙值" width="220">
        <template slot-scope="scope">
          {{ scope.row.fluctuateThreshold }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="220">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope)"
            >编辑</el-button
          >
          <el-button type="success" size="small" @click="handleDetail(scope)"
            >详情</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <alarm-dialog
      ref="form"
      :dialogType="dialogType"
      :alarm="alarm"
      @confirm-alarm="onCofirmAlarm"
    >
    </alarm-dialog>
  </div>
</template>

<script>
import AlarmDialog from "./AlarmDialog.vue";
import { getAlarmnotify, updateAlarmnotify } from "@/api/system";

const defaultRole = {
  roleKey: "",
  roleName: "",
  roleId: "",
};

export default {
  data() {
    return {
      alarm: {
        emails: [
        ],
        threshold: '',
      },
      alarmList: [],
      loading: false,
      dialogType: "edit",
    };
  },
  components: {
    AlarmDialog,
  },
  created() {
    // Mock: get all routes and roles list from server
    this.setAlarmList();
  },
  methods: {
    async setAlarmList() {
      this.loading = true;
      const { data } = await getAlarmnotify();
      this.alarmList = data;
      this.loading = false;
    },
    onOpenDialog() {
      // this.$refs['form'].onOpenDialog()
       this.$refs['form'].$emit("openDialog");
    },
    handleEdit(scope) {
      this.dialogType = "edit";
      const { fluctuateThreshold: alarmId, messageReceivers: emails, fluctuateThreshold: threshold, metricType } = scope.row;
      this.alarm = { threshold, emails: !emails ? [] : emails, alarmId, metricType, email: ''}
      this.onOpenDialog();
    },
    handleDetail(scope) {
      const { fluctuateThreshold: alarmId, messageReceivers: emails, fluctuateThreshold: threshold, metricType } = scope.row;
      this.alarm = { threshold, emails: !emails ? [] : emails, alarmId, metricType }
      this.dialogType = "detail";
      this.onOpenDialog();
    },
    async onCofirmAlarm(alarmObj) {
      const { emails: messageReceivers, threshold: fluctuateThreshold, metricType } = alarmObj;
      const { data } = await updateAlarmnotify({messageReceivers, fluctuateThreshold, metricType })
      if(data) {
        this.setAlarmList();
        this.$refs["form"].closeDialog();
        this.$message({
          message: '编辑成功',
          type: 'success'
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.alarm_container {
  .roles-table {
    margin-top: 30px;
  }
  .permission-tree {
    margin-bottom: 30px;
  }
}
</style>
