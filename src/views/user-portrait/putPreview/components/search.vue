<template>
  <div class="content">
    <el-form
      :inline="true"
      :model="queryInfor"
      style="display: flex; justify-content: space-between"
    >
      <div>
        <el-form-item>
          <TimeSelect
            @childChangePeriod="childChangePeriod"
            @childChangeDateRange="childChangeDateRange"
          ></TimeSelect>
        </el-form-item>
        <el-form-item>
          <el-select
            @change="search()"
            v-model="queryInfor.deviceType"
            placeholder="设备软件类型"
            :multiple="multiple"
            :clearable="clearable"
          >
            <el-option value="">全部</el-option>
            <el-option
              v-for="(item, index) in filterData.deviceType"
              :key="index"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select
            @change="search()"
            v-model="queryInfor.sellMode"
            placeholder="设备售卖类型"
            :multiple="multiple"
            :clearable="clearable"
            :collapse-tags="collapse_tags"
          >
            <el-option value="">全部</el-option>
            <el-option
              v-for="(item, index) in filterData.sellMode"
              :key="index"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <AdsArea
            @fromChildArea="getAreaData"
            ref="areaRef"
            :handleArea="handleArea"
          />
        </el-form-item>
        <el-form-item>
          <el-select
            @change="search()"
            v-model="queryInfor.industry"
            placeholder="行业"
          >
            <el-option value="">全部</el-option>
            <el-option
              v-for="(item, index) in filterData.industry"
              :key="index"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
      </div>
      <div>
        <el-form-item>
          <el-button
            @click="exportTable()"
            style="height: 36px; line-height: 18px; padding: 0 10px"
          >
            <span style="color: #666">
              <i class="iconfont icondaochu" style="padding-right: 5px" />
              导出表格
            </span>
          </el-button>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
import areas from "@/components/Area/index.vue";
import AdsArea from "./area.vue";
import TimeSelect from "./TimeSelect.vue";
import { userExport } from "@/utils/tool.js";
import {
  getDeviceSoftType,
  getIndustry,
  getSellMode,
  getArea,
} from "@/api/base/index";
export default {
  components: { areas, TimeSelect, AdsArea },
  props: {
    from: { type: String, default: "广告投放" },
    multiple: { type: Boolean, default: false },
    clearable: { type: Boolean, default: false },
    collapse_tags: { type: Boolean, default: false },
  },
  data() {
    return {
      handleArea: getArea,
      queryInfor: {
        periodNum: 30,
        beginDate: "",
        endDate: "",
        deviceType: "",
        industry: "",
        sellMode: "",
        area: [],
      },
      filterData: {
        deviceType: [],
        industry: [],
        sellMode: [],
      },
    };
  },
  methods: {
    init() {
      getDeviceSoftType().then((_) => (this.filterData.deviceType = _.data));
      getIndustry().then((_) => (this.filterData.industry = _.data));
      getSellMode().then((_) => (this.filterData.sellMode = _.data));
    },
    search() {
      let queryInfor = {
        ...this.queryInfor,
      };
      let arr = ["", "", ""];
      for (let i = 0; i < this.queryInfor.area.length; i++) {
        arr[i] =
          this.queryInfor.area[i] == "全部"
            ? ""
            : this.queryInfor.area[i] == "全国"
            ? ""
            : this.queryInfor.area[i];
      }
      let area = {
        region: arr[0],
        province: arr[1],
        city: arr[2],
      };
      queryInfor = { ...queryInfor, ...area };
      delete queryInfor.area;
      this.$emit("search", queryInfor);
    },
    childChangePeriod(val) {
      this.queryInfor.periodNum = val;
      this.queryInfor.beginDate = "";
      this.queryInfor.endDate = "";
      this.search();
    },
    childChangeDateRange(val) {
      this.queryInfor.beginDate = val[0];
      this.queryInfor.endDate = val[1];
      this.queryInfor.periodNum = "";
      this.search();
    },
    getAreaData(val) {
      this.queryInfor.area = val ? val : [];
      this.search();
    },
    exportTable() {
      let arr = ["", "", ""];
      for (let i = 0; i < this.queryInfor.area.length; i++) {
        arr[i] =
          this.queryInfor.area[i] == "全部"
            ? ""
            : this.queryInfor.area[i] == "全国"
            ? ""
            : this.queryInfor.area[i];
      }
      let queryInfor = {
        ...this.queryInfor,
        ...{
          region: arr[0],
          province: arr[1],
          city: arr[2],
        },
      };
      delete queryInfor.area;
      let parmarList =
        `&periodNum=${queryInfor.periodNum}` +
        `&beginDate=${queryInfor.beginDate}` +
        `&endDate=${queryInfor.endDate}` +
        `&deviceType=${queryInfor.deviceType}` +
        `&sellMode=${queryInfor.sellMode}` +
        `&industry=${queryInfor.industry}` +
        `&region=${queryInfor.region}` +
        `&province=${queryInfor.province}` +
        `&city=${queryInfor.city}`;
      let url = "";
      url =
        this.from == "广告投放"
          ? `/adPlanOverview/exportSixTrendChartsOfAdvertisingPlan?` +
            `fileName=广告计划概览-趋势图列表` +
            parmarList
          : this.from == "城市"
          ? `/adPlanOverview/exportEquipmentInCityOfTop10?` +
            `fileName=广告计划概览-TOP10城市投放设备量` +
            parmarList
          : `/adPlanOverview/exportEquipmentInIndustryTop10?` +
            `fileName=广告计划概览-TOP10行业投放设备量` +
            parmarList;
      this.$message.success(`导出中，请稍等`);
      userExport(url);
    },
  },
  mounted() {
    this.init();
    this.search();
  },
};
</script>

<style lang="scss" scoped>
</style>