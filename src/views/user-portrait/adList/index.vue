<template>
  <ad-detail
    :planId="planId"
    v-if="isDetail"
    @back="isDetail = !isDetail"
  ></ad-detail>
  <div class="container" v-else>
    <el-form :inline="true" :model="queryInfor" class="demo-form-inline">
      <el-form-item label="计划ID">
        <el-input
          v-model="queryInfor.plan_id"
          placeholder="请输入计划ID"
        ></el-input>
      </el-form-item>
      <el-form-item label="计划名称">
        <el-input
          v-model="queryInfor.planName"
          placeholder="请输入计划名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="计划投放状态">
        <el-select v-model="queryInfor.status" placeholder="请选择">
          <el-option
            v-for="item in statusArr"
            :key="item"
            :label="item"
            :value="item"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="订单编号">
        <el-input
          v-model="queryInfor.orderId"
          placeholder="请输入订单编号"
        ></el-input>
      </el-form-item>
      <el-form-item label="开始时间">
        <el-date-picker
          :default-value="currentData"
          v-model="queryInfor.startTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
          :picker-options="pickerStartTimeOptions"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="结束时间">
        <el-date-picker
          v-model="queryInfor.endTime"
          value-format="yyyy-MM-dd"
          type="date"
          placeholder="选择日期"
          :picker-options="pickerEndTimeOptions"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search()">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" plain @click="userReset">重置</el-button>
      </el-form-item>
      <el-form-item>
        <el-button plain @click="exportData()">导出</el-button>
      </el-form-item>
    </el-form>
    <Table
      :adverPlanList="adverPlanList"
      ref="Table"
      @Detail="goDetailPage"
      v-loading="adListLoading"
    ></Table>
    <pagination
      :total="adverTotal"
      @sizeChange="sizeChange"
      @pageChange="pageChange"
      :currentPage="pageInfor.pageNo"
    ></pagination>
  </div>
</template>

<script>
import { getCurrentDate, userExport } from "@/utils/tool.js";
import { reset, cacheParamList } from "@/utils/tool.js";
import { adverPlanFilterValue, adverReleasePlan } from "@/api/userPortrait";

import pagination from "@/components/Pagination/index.vue";
import adDetail from "./detail.vue";
import Table from "./components/table.vue";
export default {
  components: {
    adDetail,
    Table,
    pagination,
  },
  data() {
    return {
      queryInfor: {
        endTime: "",
        planName: "",
        plan_id: "",
        startTime: "",
        status: "",
        orderId: "",
      },
      cacheQueryInfor: {},
      statusArr: [],
      currentData: "",
      pickerStartTimeOptions: {
        disabledDate: (time) => {
          if (this.queryInfor.endTime == "") {
            return time.getTime() > new Date(getCurrentDate(1)).getTime();
          } else {
            return time.getTime() > new Date(this.queryInfor.endTime).getTime();
          }
        },
      },
      pickerEndTimeOptions: {
        disabledDate: (time) => {
          return (
            time.getTime() > new Date(getCurrentDate(1)).getTime() ||
            time.getTime() <
              new Date(this.queryInfor.startTime).getTime() -
                1 * 24 * 60 * 60 * 1000
          );
        },
      },
      planId: "",
      isDetail: false,
      adListLoading: false,
      adverTotal: 0,
      adverPlanList: [],
      pageInfor: {
        pageNo: 1,
        pageSize: 10,
      },
    };
  },
  created() {
    this.getFilterList();
  },
  methods: {
    init() {
      this.setAdverPlanListAndTotal(false);
    },
    sizeChange(val) {
      this.pageInfor.pageSize = val;
      this.setAdverPlanListAndTotal(true);
    },
    pageChange(val) {
      this.pageInfor.pageNo = val;
      this.setAdverPlanListAndTotal(true);
    },
    async setAdverPlanListAndTotal(sign) {
      this.adListLoading = true;
      sign ? "" : (this.pageInfor.pageNo = 1);
      const { data } = await adverReleasePlan({
        endTime: sign ? this.cacheQueryInfor.endTime : this.queryInfor.endTime,
        pageNo: this.pageInfor.pageNo,
        pageSize: this.pageInfor.pageSize,
        planName: sign
          ? this.cacheQueryInfor.planName
          : this.queryInfor.planName,
        startTime: sign
          ? this.cacheQueryInfor.startTime
          : this.queryInfor.startTime,
        status: sign ? this.cacheQueryInfor.status : this.queryInfor.status,
        planId: sign ? this.cacheQueryInfor.plan_id : this.queryInfor.plan_id,
        orderId: sign ? this.cacheQueryInfor.orderId : this.queryInfor.orderId,
      });
      this.adListLoading = false;
      this.adverPlanList = data.records.map((item) => {
        return {
          ...item,
          pullVsPlanDevice: `${item.pullDevices}/${item.planDevices}`,
        };
      });
      this.adverTotal = data.total;
    },

    initCurrentDate() {
      let date = new Date();
      let y = date.getFullYear();
      let m = date.getMonth();
      if (m == 0) {
        y -= 1;
        m = 12;
      }
      this.currentData = `${y}-${m}`;
    },
    userReset() {
      reset(this.queryInfor);
      this.search();
    },
    getFilterList() {
      adverPlanFilterValue().then(({ data }) => {
        this.statusArr = data.statusArr;
      });
    },
    exportData() {
      this.$message.success(`导出中，请稍等`);
      let url =
        `/adverReleasePlan/export?planId=${this.cacheQueryInfor.plan_id}` +
        `&endTime=${this.cacheQueryInfor.endTime}` +
        `&fileName=广告计划投放列表&planName=${this.cacheQueryInfor.planName}` +
        `&startTime=${this.cacheQueryInfor.startTime}` +
        `&status=${this.cacheQueryInfor.status}`;
      userExport(url);
    },
    search() {
      this.saveParamList();
      this.init();
    },
    saveParamList() {
      this.cacheQueryInfor = cacheParamList(this.queryInfor);
    },
    goDetailPage(id) {
      this.planId = id;
      this.isDetail = true;
    },
  },
  mounted() {
    this.search();
  },
};
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  .el-form {
    background-color: #fff;
    padding: 20px;
    padding-bottom: 0;
    margin-bottom: 10px;
  }
  .el-date-editor {
    width: 195px;
  }
  .content {
    background-color: #fff;
  }
}
</style>
