<template>
  <div class="container">
    <div class="search_container" style="margin-bottom: 10px">
      自定义事件详情
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="设备类型">
          <el-select placeholder="全部设备" v-model="baseInfor.deviceType">
            <el-option value="">全部设备</el-option>
            <el-option
              v-for="(item, index) in filterData.deviceTypeList"
              :label="item"
              :value="item"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="事件名称">
          <el-select
            placeholder="全部事件"
            v-model="baseInfor.eventName"
            filterable
          >
            <el-option value="">全部事件</el-option>
            <el-option
              v-for="(item, index) in filterData.eventList"
              :label="item.eventtitle"
              :value="item.eventname"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select placeholder="全部版本" v-model="baseInfor.version">
            <el-option value="">全部版本</el-option>
            <el-option
              v-for="item in filterData.versionList"
              :label="item"
              :value="item"
              :key="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="baseInfor.appScene"
            value-key
            placeholder="场景"
            clearable
          >
            <el-option value="">全部场景</el-option>
            <el-option
              v-for="(item, index) in filterData.sceneList"
              :key="index"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="baseInfor.province"
            placeholder="请选择省"
            clearable
            @change="changeProvince"
          >
            <el-option
              v-for="(item, index) in filterData.provinceList"
              :key="index"
              :label="item"
              clearable
              :value="item"
            >
            </el-option>
          </el-select>
          <el-select
            v-model="baseInfor.city"
            placeholder="请选择市"
            :disabled="baseInfor.province == '' ? true : false"
            multiple
            clearable
            collapse-tags
          >
            <el-option
              v-for="(item, index) in filterData.cityList"
              :key="index"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="baseInfor.industry"
            multiple
            value-key
            placeholder="行业"
            filterable
            clearable
          >
            <el-option value="">全部行业</el-option>
            <el-option
              v-for="(item, index) in filterData.industryList"
              :key="index"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <time-select
            @childChangePeriod="changePeriod"
            @childChangeDateRange="changeDateRange"
          ></time-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="initData">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" plain @click="useReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="evnet_count">
      <div class="event_top">
        <span class="title">事件统计</span>
        <tool-tip
          content="消息数量：事件被触发的次数<br/>
            消息数/启动次数：平均每次启动被触发的次数<br >
            设备量：每日触发事件的设备量（以设备为判断标准)<br/>
            持续时长：事件持续的时间长度。事件上报时长有该切卡，不上报无该切卡<br/>
            全部事件不做该统计"
        ></tool-tip>
      </div>
      <div class="tabs_data">
        <ul class="tabs">
          <li
            v-for="(item, index) in tabList"
            :key="index"
            @click="changeTab(index)"
            :class="activeTabIndex == index ? 'active' : ''"
          >
            {{ item }}
          </li>
        </ul>
      </div>
      <el-select
        v-model="multiVersion"
        multiple
        clearable
        collapse-tags
        filterable
        value-key
        style="margin-right: 20px; float: right; width: 270px"
        placeholder="请选择对比版本"
        :multiple-limit="limit"
        @change="setMultiVersion()"
      >
        <el-option
          v-for="(item, index) in versionFilter"
          :key="index"
          :label="item"
          :value="item"
        >
        </el-option>
      </el-select>
      <line-chart
        id="chart6"
        title=""
        :series="eSeries"
        :trendXData="xData"
        :colorList="colorList"
        :legendData="legend"
        :formatter="trendFormatter"
        v-if="eSeries.length > 0"
      >
      </line-chart>
    </div>
    <div class="table_container">
      <div class="operate_container">
        <span class="title">事件统计明细</span>
        <el-button type="primary" @click="exportData">导出</el-button>
      </div>
      <div class="table_content">
        <el-table :data="onEventTableObj.list" style="width: 100%">
          <el-table-column
            v-for="(item, index) in getKeys('onEventTableObj')"
            :key="index"
            :prop="item"
            align="center"
            :label="onEventTableObj.header[0][item]"
          >
          </el-table-column>
        </el-table>
        <pagination
          :total="onEventTableObj.total"
          :page-size="onEventTableObj.pageSize"
          @pageChange="onEventTurnPage"
          @sizeChange="onEventSizeChange"
        ></pagination>
      </div>
    </div>
  </div>
</template>

<script>
import LineChart from "@/components/Charts/LineChart";
import ToolTip from "@/components/ToolTip";
import TimeSelect from "@/components/TimeSelect";
import MultiArea from "@/components/MultiArea";
import { getCurrentDate } from "@/utils/tool.js";
import Pagination from "@/components/Pagination";
import {
  getDayAll,
  reset,
  userExport,
  MillisecondToDate,
} from "@/utils/tool.js";
import { getAdvDetailSelectList, getAdvDetailList } from "@/api/appData";

export default {
  components: {
    LineChart,
    ToolTip,
    TimeSelect,
    Pagination,
    MultiArea,
  },
  data() {
    return {
      tabList: ["消息数量", "消息数/启动次数", "设备量", "持续时长"],
      limit: 3,
      activeTabIndex: 0,
      baseInfor: {
        deviceType: "",
        eventName: "",
        province: "",
        city: "",
        industry: "",
        appScene: "",
        dateRange: [],
        version: "",
        startDate: "",
        endDate: "",
      },
      singleVersion: "",
      multiVersion: "",
      versionFilter: [],
      filterData: {
        cityList: [],
        industryList: [],
        versionList: [],
        deviceTypeList: [],
        eventList: [],
        provinceList: [],
        sceneList: [],
      },
      detailDataList: [],
      lineData: [],
      legend: {
        data: ["消息数量"],
      },
      mesLegendData: ["消息数量"],
      mgsLegendData: ["消息数/启动次数"],
      devLegendData: ["设备量"],
      durLegendData: ["持续时长"],
      colorList: ["#3BA0FF", "#31CCD8", "red", "#89D36A", "#B31181"],
      detailData: [],
      xData: [],
      eSeries: [],
      messagesSeries: [],
      mgsPerstartSeries: [],
      devicesSeries: [],
      durationSeries: [],
      onEventTableObj: {
        header: [
          {
            dt: "日期",
            messages: "消息数量",
            mgsPerstart: "消息数/启动次数",
            devices: "设备量",
            duration: "消息时长",
          },
        ],
        list: [],
        total: 0,
        pageNo: 1,
        pageSize: 10,
      },
      trendFormatter: "{value}个",
    };
  },
  created() {
    if (this.$route.query.eventName) {
      const { eventName, deviceType, appScene, version } = this.$route.query;
      this.baseInfor.eventName = eventName;
      this.baseInfor.deviceType = deviceType;
      this.baseInfor.appScene = appScene;
      this.baseInfor.version = "全部版本" ? "" : version;
    }
    this.initData();
  },
  methods: {
    async initData() {
      this.activeTabIndex = 0;
      await this.getFitlerData();
      this.setXData();
      await this.getDetailData();
      this.getMultiVersion();
      this.setMultiVersion();
    },
    useReset() {
      reset(this.baseInfor);
      this.getFitlerData();
      this.initData();
    },
    changeProvince() {
      this.getFitlerData();
    },
    async getFitlerData() {
      const {
        deviceType,
        eventName,
        version,
        province,
        startDate,
        endDate,
        appScene,
        industry,
      } = this.baseInfor;
      const { data } = await getAdvDetailSelectList({
        deviceType,
        eventName,
        version,
        province,
        appScene: Array.isArray(appScene) ? appScene.join(",") : appScene,
        industry: Array.isArray(industry) ? industry.join(",") : industry,
      });
      this.filterData.cityList = data.cityList;
      this.filterData.industryList = data.industryList;
      this.filterData.versionList = data.versionList;
      this.filterData.deviceTypeList = data.deviceTypeList;
      this.filterData.eventList = data.eventList;
      this.filterData.provinceList = data.provinceList;
      this.filterData.cityList = data.cityList;
      this.filterData.sceneList = data.sceneList;

      // console.log(this.filterData.eventList)

      this.baseInfor.startDate = startDate
        ? startDate
        : getCurrentDate(30 * 24);
      this.baseInfor.endDate = endDate ? endDate : getCurrentDate(1);
    },
    async getMultiVersion() {
      const { deviceType, eventName } = this.baseInfor;
      const { data } = await getAdvDetailSelectList({
        deviceType,
        eventName,
      });
      this.versionFilter = data.versionList;
    },
    async setMultiVersion() {
      this.eSeries = [];
      const {
        city,
        deviceType,
        eventName,
        industry,
        startDate,
        endDate,
        appScene,
      } = this.baseInfor;
      this.messagesSeries = [];
      this.mgsPerstartSeries = [];
      this.devicesSeries = [];
      this.durationSeries = [];
      this.messagesSeries.push({
        name: `消息数量`,
        data: this.detailData.map((item) => item.messages),
        type: "line",
      });
      this.mgsPerstartSeries.push({
        name: `消息数/启动次数`,
        data: this.detailData.map((item) => item.mgsPerstart),
        type: "line",
      });
      this.devicesSeries.push({
        name: `设备量`,
        data: this.detailData.map((item) => item.devices),
        type: "line",
      });
      this.durationSeries.push({
        name: `持续时长`,
        data: this.detailData.map((item) =>
          (item.duration / 3600 / 1000).toFixed(1)
        ),
        type: "line",
      });
      await this.multiVersion.forEach(async (version) => {
        const { data } = await getAdvDetailList({
          city,
          deviceType,
          eventName,
          industry,
          version,
          startDate,
          appScene,
          endDate,
        });
        const targetData = this.getTargeData(data);
        this.messagesSeries.push({
          name: `${version}版本-消息数量`,
          data: targetData.map((item) => item.messages),
          type: "line",
        });
        this.mgsPerstartSeries.push({
          name: `${version}版本-消息数/启动次数`,
          data: targetData.map((item) => item.mgsPerstart),
          type: "line",
        });
        this.devicesSeries.push({
          name: `${version}版本-设备量`,
          data: targetData.map((item) => item.devices),
          type: "line",
        });
        this.durationSeries.push({
          name: `${version}版本-持续时长`,
          data: targetData.map((item) => (item.duration / 3600).toFixed(1)),
          type: "line",
        });
        this.mesLegendData.push(`${version}版本-消息数量`);
        this.mgsLegendData.push(`${version}版本-消息数/启动次数`);
        this.devLegendData.push(`${version}版本-设备量`);
        this.durLegendData.push(`${version}版本-持续时长`);
      });
      this.eSeries = this.messagesSeries;
      this.legend.data = this.mesLegendData;
    },
    changeTab(index) {
      this.activeTabIndex = index;
      if (this.activeTabIndex === 0) {
        this.trendFormatter = "{value}个";
        this.eSeries = this.messagesSeries;
        this.legend.data = this.mesLegendData;
      }
      if (this.activeTabIndex === 1) {
        this.trendFormatter = "{value}次";
        this.eSeries = this.mgsPerstartSeries;
        this.legend.data = this.mgsLegendData;
      }
      if (this.activeTabIndex === 2) {
        this.trendFormatter = "{value}台";
        this.eSeries = this.devicesSeries;
        this.legend.data = this.devLegendData;
      }
      if (this.activeTabIndex === 3) {
        this.trendFormatter = "{value}h";
        this.eSeries = this.durationSeries;
        this.legend.data = this.durLegendData;
      }
    },
    setXData() {
      const { startDate, endDate } = this.baseInfor;
      this.xData = getDayAll(startDate, endDate);
    },
    getTargeData(data) {
      const target = data.map((item) => {
        return [item.dt, item];
      });
      const m = new Map(target);
      const targetData = this.xData.map((item) =>
        m.get(item)
          ? m.get(item)
          : { devices: 0, dt: "", duration: 0, messages: 0, mgsPerstart: 0 }
      );
      return targetData;
    },
    async getDetailData() {
      const {
        city,
        deviceType,
        eventName,
        industry,
        version,
        appScene,
        startDate,
        endDate,
      } = this.baseInfor;
      const { data } = await getAdvDetailList({
        city: city.join(","),
        deviceType,
        eventName,
        appScene,
        industry: industry.join(","),
        version,
        startDate,
        endDate,
      });
      this.onEventTableObj.total = data.length;
      const targetData = this.getTargeData(data);
      this.detailData = targetData;
      this.detailDataList = data.map((item) => {
        return { ...item, duration: MillisecondToDate(item.duration) };
      });
      const { pageNo, pageSize } = this.onEventTableObj;
      this.onEventTableObj.list = this.detailDataList.slice(
        pageNo - 1,
        pageSize
      );
    },
    getKeys(eventObjName) {
      if (this[eventObjName].header.length != 0) {
        return Object.keys(this[eventObjName].header[0]);
      }
    },
    onEventTurnPage(val) {
      this.onEventTableObj.pageNo = val;
      const { pageSize } = this.onEventTableObj;
      const that = this;
      const start = pageSize * val - pageSize;
      const end = pageSize * val;
      if (that.detailData.length <= pageSize) {
        that.onEventTableObj.list = that.detailDataList;
      } else {
        if (pageSize * val >= that.detailData.length) {
          that.onEventTableObj.list = that.detailDataList.slice(start);
        } else {
          that.onEventTableObj.list = that.detailDataList.slice(start, end);
        }
      }
    },
    onEventSizeChange(val) {
      this.onEventTableObj.pageSize = val;
      this.onEventTableObj.pageNo = 1;
      const { pageNo, pageSize } = this.onEventTableObj;
      this.onEventTableObj.list = this.detailDataList.slice(
        pageNo - 1,
        pageSize
      );
    },
    changePeriod(val) {
      if (val != -1) {
        this.baseInfor.startDate = getCurrentDate(val * 24);
        this.baseInfor.endDate = getCurrentDate(1);
      } else {
        this.baseInfor.dateRange = [];
      }
    },
    changeDateRange(val) {
      this.baseInfor.startDate = val[0];
      this.baseInfor.endDate = val[1];
    },
    exportData() {
      this.$message.success(`导出中，请稍等`);
      const {
        city,
        deviceType,
        endDate,
        eventName,
        industry,
        appScene,
        startDate,
        version,
      } = this.baseInfor;
      const url = `/advEventDetail/export?city=${city}&deviceType=${deviceType}&eventName=${eventName}&endDate=${endDate}&startDate=${startDate}&industry=${industry}&version=${version}&appScence=${appScene}&fileName=事件统计明细`;
      userExport(url);
    },
  },
  computed: {
    isDetail() {
      let flag = false;
      if (this.$route.query.eventName) {
        flag = true;
      }
      return flag;
    },
  },
  watch: {
    baseInfor: {
      deep: true,
      handler: function () {
        this.getFitlerData();
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  .demo-form-inline {
    margin-top: 20px;
  }
  .evnet_count {
    background-color: #fff;
    // margin-top: 10px;
    margin-bottom: 10px;

    padding-top: 15px;
    padding-bottom: 15px;
    font-size: 16px;
    font-weight: 700;
    color: #333;
    .event_top {
      margin-top: 20px;
      margin-left: 30px;
    }
    .tabs_data {
      display: flex;
      justify-content: space-between;
      padding-left: 20px;
      padding-top: 20px;
    }
    .tabs {
      display: flex;
      li {
        width: 166px;
        height: 41px;
        font-size: 14px;
        border: 1px solid rgb(121, 121, 121);
        text-align: center;
        line-height: 41px;
        cursor: pointer;
      }
      li:first-child {
        border-right: none;
      }
      li.active {
        background-color: rgb(16, 142, 233);
        border-color: rgb(16, 142, 233);
        color: #fff;
      }
    }
  }
  .table_container {
    padding: 0px 15px 20px 30px;
    background: #fff;
    .operate_container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      padding: 22px 0;
      > span {
        font-size: 20px;
        color: #333;
      }
    }
  }
  .item {
    margin-left: 10px;
    color: #dddddd;
  }
}
</style>