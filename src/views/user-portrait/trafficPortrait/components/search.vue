<template>
  <div class="search_container">
    已激活设备流量概览
    <el-form :inline="true" :model="queryInfor" style="margin-top: 20px">
      <el-form-item>
        <my-area @fromChildArea="getAreaData"></my-area>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="queryInfor.scene"
          placeholder="请选择行业"
          style="margin-left: 10px; margin-right: 10px"
        >
          <el-option value="">全部行业</el-option>
          <el-option
            v-for="item in tradeList"
            :label="item"
            :value="item"
            :key="item"
            >{{ item }}</el-option
          >
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="queryInfor.deviceType"
          placeholder="请选择设备类型"
          style="margin-left: 10px; margin-right: 10px"
          multiple
          clearable
          collapse-tags
          class="deviceType"
        >
          <!-- <el-option value="">全部类型</el-option> -->
          <el-option
            v-for="item in deviceType"
            :label="item"
            :value="item"
            :key="item"
            >{{ item }}</el-option
          >
        </el-select>
      </el-form-item>
      <el-form-item>
        <time-select
          @childChangePeriod="changePeriod"
          @childChangeDateRange="changeDateRange"
        ></time-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button
          class="export_Btns"
          @click="downloadPdf({ title: '概览页面', selector: 'pdf-container' })"
          plain
          >导出PDF</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import MyArea from "@/components/Area";
import TimeSelect from "@/components/TimeSelect";
import { getCurrentDate } from "@/utils/tool.js";
import {
  sceneFilterValue,
  getOverviewDeviceType,
} from "@/api/userPortrait";
export default {
  components: {
    MyArea,
    TimeSelect,
  },
  data() {
    return {
      queryInfor: {
        area: [],
        scene: "",
        deviceType: [],
        period: 30,
        dateRange: [],
      },
      tradeList: [],
      deviceType: [],
    };
  },
  methods: {
    async setTradeList() {
      const { data } = await sceneFilterValue();
      this.tradeList = data.sceneArr;
    },
    async setDeviceType() {
      const { data } = await getOverviewDeviceType();
      this.deviceType = data;
    },
    getAreaData(val) {
      this.queryInfor.area = val;
    },
    changePeriod(val) {
      this.queryInfor.dateRange = [getCurrentDate(val * 24), getCurrentDate(1)];
    },
    changeDateRange(val) {
      this.queryInfor.dateRange = [val[0], val[1]];
    },
    search() {
      this.$emit("queryInfor", this.queryInfor);
    },
  },
  mounted() {
    this.setTradeList();
    this.setDeviceType();
    this.search()
  },
};
</script>

<style lang="scss" scoped>
.deviceType {
  width: 225px;
}
</style>