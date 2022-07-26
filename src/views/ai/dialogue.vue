<template>
  <div class="ai_container">
    <div class="search_container" style="margin-bottom: 10px">
      <!-- <div clasPath Intellisense s="text">语义对话记录</div> -->
      <el-form :inline="true" :model="queryInfor">
        <el-form-item label="设备ID">
          <el-input
            v-model="queryInfor.deviceId"
            placeholder="请输入设备ID"
          ></el-input>
        </el-form-item>
        <el-form-item label="设备类型">
          <el-select
            v-model="queryInfor.deviceType"
            clearable
            multiple
            collapse-tags
            placeholder="全部类型"
          >
            <el-option value label="全部类型">全部类型</el-option>
            <el-option
              v-for="(item, index) in filterData.deviceTypeList"
              :label="item"
              :value="item"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="行业">
          <el-select
            v-model="queryInfor.scene"
            clearable
            multiple
            collapse-tags
            placeholder="全部行业"
          >
            <el-option value label="全部行业">全部行业</el-option>
            <el-option
              v-for="(item, index) in filterData.sceneList"
              :label="item"
              :value="item"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上报时间:">
          <el-date-picker
            v-model="queryInfor.dateRange"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="问题内容">
          <el-input
            v-model="queryInfor.ciotText"
            placeholder="请输入问题内容"
          ></el-input>
        </el-form-item>
        <el-form-item label="触发业务类型">
          <el-select
            v-model="queryInfor.triggerBusinessType"
            clearable
            multiple
            collapse-tags
            placeholder="全部类型"
          >
            <el-option value label="全部类型">全部类型</el-option>
            <el-option
              v-for="(item, index) in filterData.triggerList"
              :label="item"
              :value="item"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="版本号">
          <el-select
            v-model="queryInfor.VersionNum"
            clearable
            collapse-tags
            placeholder="请选择版本号"
          >
            <el-option value label="全部版本">全部版本</el-option>
            <el-option
              v-for="(item, index) in filterData.versionList"
              :label="item"
              :value="item"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="项目名称">
          <el-select
            v-model="queryInfor.itemName"
            clearable
            filterable
            reseve-keyword
            allow-create
            placeholder="输入并选择项目"
            remote
            :remote-method="changeItem"
            :automatic-dropdown="true"
            :loading="itemLoading"
          >
            <el-option
              v-for="(item, index) in projectName"
              :label="item"
              :value="item"
              :key="index"
            ></el-option>
            <!-- </el-input>  -->
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="initData">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" plain @click="userReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="list_container">
      <div class="list_top">
        <span>语义对话记录列表</span>
        <!-- <el-button type="primary" @click="exportData">导出</el-button> -->
        <exports-button
          :exportUrl="exportUrl"
          :isExport="isExport"
          @exports="exportData"
        ></exports-button>
      </div>
      <div class="list_content">
        <el-table
          stripe
          style="width: 100%"
          :data="avrList"
          v-loading="loading"
        >
          <el-table-column label="设备ID" prop="deviceId"></el-table-column>
          <el-table-column label="设备类型" prop="deviceType"></el-table-column>
          <el-table-column label="上报时间" prop="dateTime"></el-table-column>
          <el-table-column label="问答内容" prop="text"></el-table-column>
          <el-table-column label="版本号" prop="version"></el-table-column>
          <el-table-column label="触发模块" prop="moduleName"></el-table-column>
          <el-table-column
            label="项目名称"
            prop="projectName"
          ></el-table-column>
          <!-- <el-table-column label="对话ID" prop="scene"></el-table-column> -->
          <el-table-column label="语义状态" prop="yuyiStatus"></el-table-column>
        </el-table>
        <pagination
          :total="pageInfor.total"
          @pageChange="turnPage"
          @sizeChange="sizeChange"
          :currentPage="pageInfor.pageNo"
        ></pagination>
      </div>
    </div>
  </div>
</template>

<script>
import pagination from "@/components/Pagination";
import { reset, getCurrentDate, userExport } from "@/utils/tool.js";
import { getAvrFilterList, getAvrList, getProjectionNameList } from "@/api/ai";
import exportsButton from "@/components/exportByKey/exportsButton.vue";
export default {
  components: {
    pagination,
    exportsButton,
  },
  data() {
    return {
      random: null,
      loading: true,
      queryInfor: {
        dateRange: [],
        ciotText: "",
        deviceId: "",
        deviceType: [],
        scene: [],
        triggerBusinessType: [],
        VersionNum: "",
        itemName: "",
      },
      itemLoading: false,
      avrList: [],
      copyQueryInfor: "",
      filterData: {},
      projectName: [],
      aiVoiceRecordList: [],
      pageInfor: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      },
      notifyIndex: 0,
      exportUrl: "",
      isExport: true,
    };
  },
  created() {
    this.getFilterData();
    this.queryInfor.dateRange.length > 0 ? "" : this.setDefaultDate();
    this.initData();
  },
  methods: {
    userReset() {
      reset(this.queryInfor);
      this.initData();
    },
    setDefaultDate() {
      const yestreDayTime = getCurrentDate(1);
      this.queryInfor.dateRange = [yestreDayTime, yestreDayTime];
    },
    async setAvrList(isPage = false) {
      this.loading = true;
      const inforData = !isPage ? this.getInforData() : this.copyQueryInfor;
      const { pageNo, pageSize } = this.pageInfor;
      const { data } = await getAvrList({
        ...inforData,
        pageNo,
        pageSize,
      });
      this.loading = false;
      // console.log(data);
      this.avrList = data.records;
      // console.log(this.avrList);
      this.pageInfor.total = data.total;
    },
    async getFilterData() {
      const { data } = await getAvrFilterList();
      // console.log(data);
      this.filterData = data;
    },
    getInforData() {
      const {
        dateRange,
        ciotText,
        deviceId,
        deviceType,
        triggerBusinessType,
        scene,
        VersionNum,
        itemName,
      } = this.queryInfor;
      // console.log(itemName);
      const inforData = {
        startTime: dateRange.length ? dateRange[0] : "",
        endTime: dateRange.length ? dateRange[1] : "",
        ciotText,
        deviceId,
        deviceType: deviceType.join(","),
        scene: scene.join(","),
        triggerBusinessType: triggerBusinessType.join(","),
        version: VersionNum ? VersionNum : "",
        projectName: itemName ? itemName : "",
      };
      this.copyQueryInfor = inforData;
      this.pageInfor = {
        pageSize: 10,
        pageNo: 1,
      };
      return inforData;
    },
    turnPage(val) {
      this.pageInfor.pageNo = val;
      this.setAvrList(true);
    },
    sizeChange(val) {
      this.pageInfor.pageSize = val;
      this.setAvrList(true);
    },
    changeItem(val) {
      this.itemLoading = true;
      val
        ? getProjectionNameList({ projectName: val }).then((data) => {
            this.projectName = data.data;
            this.itemLoading = false;
          })
        : (this.itemLoading = false);
    },
    exportData() {
      this.isExport = !this.isExport;
      const {
        ciotText,
        deviceId,
        deviceType,
        endTime,
        scene,
        startTime,
        triggerBusinessType,
      } = this.copyQueryInfor;
      this.exportUrl = `/aiVoiceRecord/exportZip?deviceType=${deviceType}&ciotText=${ciotText}&startTime=${startTime}&endTime=${endTime}&deviceId=${deviceId}&scene=${scene}&triggerBusinessType=${triggerBusinessType}&fileName=语义对话记录列表`;
      // userExport(this.exportUrl);
    },
    initData() {
      this.setAvrList();
    },
  },
};
</script>

<style lang="scss" scoped>
.ai_container {
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