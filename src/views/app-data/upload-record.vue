<template>
  <div class="container">
    <el-form :inline="true" :model="queryInfor" class="demo-form-inline">
      <div class="container_title">APP数据-上报记录列表</div>
      <el-form-item label="设备id">
        <el-input
          v-model="queryInfor.deviceId"
          placeholder="请输入设备id"
        ></el-input>
      </el-form-item>
      <el-form-item label="设备类型">
        <el-select v-model="queryInfor.deviceType" placeholder="请选择设备类型">
          <el-option
            v-for="item in deviceType"
            :key="item"
            :label="item"
            :value="item"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="事件名称">
        <el-select v-model="queryInfor.eventTitle" placeholder="请选择事件名称">
          <el-option
            v-for="item in eventTitleList"
            :key="item"
            :label="item"
            :value="item"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="版本号">
        <el-select v-model="queryInfor.version" placeholder="请选择版本号">
          <el-option
            v-for="item in deviceVersion"
            :key="item"
            :label="item"
            :value="item"
          ></el-option>
        </el-select>
      </el-form-item>
      <!-- 时间选择器 -->
      <div>
        <el-form-item>
          <time-select
            @childChangeDateRange="changeDateRange"
            :resetIndex="resetIndex"
          ></time-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search(), cacheParam()"
            >查询</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button type="primary" plain @click="userReset">重置</el-button>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            plain
            @click="exportData"
            v-loading="loading.exLoading"
            >导出</el-button
          >
        </el-form-item>
      </div>
    </el-form>
    <div class="content">
      <el-table
        :data="dataList"
        stripe
        style="width: 100%"
        v-loading="loading.listLoading"
      >
        <el-table-column
          label="设备Id"
          prop="deviceId"
          header-align="center"
          align="center"
        ></el-table-column>
        <el-table-column
          label="设备版本"
          prop="version"
          header-align="center"
          align="center"
        ></el-table-column>
        <el-table-column
          label="事件名称"
          prop="eventTitle"
          header-align="center"
          align="center"
        ></el-table-column>
        <el-table-column
          label="字段名称"
          prop="eventName"
          header-align="center"
          align="center"
        ></el-table-column>
        <el-table-column
          label="上报时间"
          prop="reportTimestamp"
          header-align="center"
          align="center"
        ></el-table-column>
        <el-table-column
          label="设备类型"
          prop="deviceType"
          fixed="right"
          header-align="center"
          align="center"
        ></el-table-column>
      </el-table>
      <pagination
        :current-page="pageInfor.pageNo"
        layout="total, sizes, prev, pager, next, jumper"
        :total="adverTotal"
        :pager-count="9"
        @sizeChange="sizeChange"
        @pageChange="pageChange"
      >
      </pagination>
    </div>
  </div>
</template>

<script>
import TimeSelect from "./components/TimeSelect.vue";
import pagination from "@/components/Pagination/index.vue";
import {
  getUploadRecordParamList,
  getUploadRecordDataList,
} from "@/api/appData/index.js";
import { reset, cacheParamList, userExport } from "@/utils/tool.js";
export default {
  components: { TimeSelect, pagination },
  data() {
    return {
      // param
      queryInfor: {
        deviceId: null || "",
        deviceType: null || "",
        eventTitle: null || "",
        version: null || "",
        startTime: null || "",
        endTime: null || "",
      },
      pageInfor: {
        pageNo: 1,
        pageSize: 10,
      },
      // paramList
      cacheQueryInfor: {},
      deviceType: [],
      eventTitleList: [],
      deviceVersion: [],
      // control
      resetIndex: false,
      loading: {
        listLoading: false,
        exLoading: false,
      },
      timer: null,
      adverTotal: 0,
      // data
      dataList: [
        {
          planId: "001",
        },
      ],
    };
  },
  methods: {
    initdata() {
      this.getParamList();
    },
    async getParamList() {
      let { data } = await getUploadRecordParamList();
      this.deviceType = data.deviceType;
      this.eventTitleList = data.eventTitleList;
      this.deviceVersion = data.versionList;
      this.search();
    },
    userReset() {
      this.resetIndex = !this.resetIndex;
      reset(this.queryInfor);
      reset(this.cacheQueryInfor);
      this.search();
    },
    cacheParam() {
      this.cacheQueryInfor = cacheParamList(this.queryInfor);
    },
    search(pageNo = 1, pageSize = 10, fromPageChange) {
      this.loading.listLoading = true;
      let params = fromPageChange ? this.cacheQueryInfor : this.queryInfor;
      // console.log("params", params);
      params.pageSize = pageSize;
      params.pageNo = pageNo;
      // let params = { id, deviceType, eventName, deviceVersion, startTime, endTime }
      this.getDataList(params);
    },
    async getDataList(params) {
      let { data } = await getUploadRecordDataList({ ...params });
      this.loading.listLoading = false;
      this.dataList = data.records;
      this.adverTotal = data.total;
    },
    changeDateRange(val) {
      this.queryInfor.startTime = val[0];
      this.queryInfor.endTime = val[1];
    },
    sizeChange(val) {
      this.queryInfor.pageSize = val;
      this.search(this.queryInfor.pageNo, this.queryInfor.pageSize, true);
    },
    pageChange(val) {
      this.queryInfor.pageNo = val;
      this.search(this.queryInfor.pageNo, this.queryInfor.pageSize, true);
    },
    exportData() {
      this.$message.success(`导出中，请稍等`);
      this.loading.exLoading = true;
      const query = this.cacheQueryInfor;
      const url =
        `/advEventDetailList/export?` +
        `&fileName=APP数据-上报记录列表` +
        `&deviceId=${query.deviceId}` +
        `&deviceType=${query.deviceType}` +
        `&endTime=${query.endTime}` +
        `&eventTitle=${query.eventTitle}` +
        `&startTime=${query.startTime}` +
        `&version=${query.version}`;
      userExport(url);
      this.timer = setTimeout((_) => {
        this.loading.exLoading = false;
      }, 200);
    },
  },
  mounted() {
    this.cacheParam();
    this.initdata();
  },
  beforeDestroy() {
    clearInterval(this.timer);
    this.timer = null;
  },
};
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  .demo-form-inline {
    background: #fff;
    padding: 30px 30px 0px 30px;
    .container_title {
      padding-bottom: 30px;
      // background: #fff;
      font-size: 20px;
    }
    .el-form-item {
      margin-right: 20px;
    }
  }
}
</style>
