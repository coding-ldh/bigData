<template>
  <div class="container" id="pdf-container">
    <ul class="oviewContainer">
      <li>
        <div class="title">
          近7日在线设备量<tool-tip
            content="最近7日（不含今日）在线设备的总数（已激活去重），占比-公式：在线设备量/已激活设备量"
          ></tool-tip>
        </div>
        <span class="content">{{ oviewData.onlineDevicesOfRecent7Days }}</span>
        <span class="content zb">占比</span>
        <span class="content zbValue">{{
          oviewData.onlineDevicesOfRecent7DaysRate
        }}</span>
      </li>
      <li>
        <span class="title"
          >在线时长(近7日平均)<tool-tip
            content="最近7日（不含今日）在线设备（已激活）每台每日使用时长的平均值"
          ></tool-tip
        ></span>
        <span class="content">{{
          oviewData.avgOnlineDurationOfRecent7Days
        }}</span>
      </li>
      <li>
        <span class="title"
          >近30日在线设备量<tool-tip
            content="最近30日（不含今日）在线设备的总数（已激活去重）"
          ></tool-tip
        ></span>
        <span class="content">{{ oviewData.onlineDevicesOfRecent30Days }}</span>
        <span class="content zb">占比</span>
        <span class="content zbValue">{{
          oviewData.onlineDevicesOfRecent30DaysRate
        }}</span>
      </li>
      <li>
        <span class="title"
          >在线时长（近30日平均）<tool-tip
            content="最近30日（不含今日）在线设备（已激活）每台每日使用时长的平均值"
          ></tool-tip
        ></span>
        <span class="content">{{
          oviewData.avgOnlineDurationOfRecent30Days
        }}</span>
      </li>
      <li>
        <span class="title"
          >在线设备量变化/激活设备量变化（近7日）<tool-tip
            content="最近7日（不含今日）每日新增在线设备量（已激活）的平均值"
          ></tool-tip
        ></span>
        <span class="content"
          >{{ oviewData.newOnlineDevicesOfRecent7Days }}/{{
            oviewData.newActivatedDevicesOfRecent7Days
          }}</span
        >
      </li>
      <li>
        <span class="title"
          >累计在线设备量/累计激活设备量<tool-tip
            content="截止到当前时间，启动过应用的所有独立设备（已激活去重，以设备为判断标准）"
          ></tool-tip
        ></span>
        <span class="content"
          >{{ oviewData.cumulativeNumOfOnlineDevices }}/{{
            oviewData.cumulativeNumOfActivatedDevices
          }}</span
        >
      </li>
    </ul>
    <div class="search_container">
      <el-form
        :inline="true"
        :model="queryInfor"
        class="demo-form-inline"
        style="margin-top: 20px"
      >
        <el-form-item label="设备类型:">
          <el-select
            v-model="queryInfor.deviceType"
            placeholder="请选择设备类型"
            clearable
            multiple
            collapse-tags
            style="margin-left: 10px; margin-right: 10px"
          >
            <el-option
              v-for="item in filterObj.deviceType"
              :label="item"
              :value="item"
              :key="item"
              >{{ item }}</el-option
            >
          </el-select>
        </el-form-item>
        <el-form-item label="区域:">
          <multi-area ref="multiArea"></multi-area>
        </el-form-item>
        <el-form-item label="行业:">
          <el-select
            v-model="queryInfor.scene"
            placeholder="请选择行业"
            clearable
            multiple
            collapse-tags
            style="margin-left: 10px; margin-right: 10px"
          >
            <el-option
              v-for="item in filterObj.scene"
              :label="item"
              :value="item"
              :key="item"
              >{{ item }}</el-option
            >
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search()">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button
            class="export_Btns"
            @click="
              downloadPdf({ title: '在线时长概览', selector: 'pdf-container' })
            "
            plain
            >导出PDF</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <!-- 这期不做 -->
    <!-- <div class="hourTrendContainer">
      <line-chart
        id="chart1"
        title="小时趋势"
        :legendData="hourTrendLegendData"
        :series="hourTrendYData"
        :colorList="hourTrendColorList"
        :trendXData="hourTrendXData"
      >
        <el-date-picker
          v-model="hourTrendDate"
          type="date"
          placeholder="选择日期"
          value-format="yyyy-MM-dd"
          @change="changeHourTrendData"
        >
        </el-date-picker>
      </line-chart>
    </div> -->
    <div class="month_year_trend_container">
      <div class="tabs_date">
        <ul class="tabs">
          <li
            v-for="(item, index) in tabList"
            :key="item"
            @click="changeTab(index)"
            :class="activeTabIndex == index ? 'active' : ''"
          >
            {{ item }}
          </li>
        </ul>
        <div>
          <el-select
            v-model="chartType"
            placeholder="请选择"
            @change="trendDate = defaultTimeValue()"
          >
            <el-option value="1" label="月趋势"></el-option>
            <el-option value="2" label="年趋势"></el-option>
          </el-select>
          <el-date-picker
            v-model="trendDate"
            :type="chartType == '1' ? 'daterange' : 'monthrange'"
            range-separator="至"
            :value-format="chartType == '1' ? 'yyyy-MM-dd' : 'yyyy-MM'"
            @change="changeTrendDate"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </div>
      </div>
      <line-chart
        id="chart2"
        title="趋势图"
        ref="monthYear"
        :legendData="monthYearLegend"
        :series="monthYearYData"
        :colorList="monthYearColorList"
        :trendXData="monthYearXData"
        :formatter="trendFormatter"
        v-if="monthYearYData.length != 0"
      >
      </line-chart>
    </div>
    <div class="top10Container">
      <bar-chart
        title="TOP10城市在线设备量"
        id="chart4"
        yUnit="台"
        :series="deviceYData"
        :legend="deviceTop10Legend"
        :xData="deviceXData"
        :colorList="deviceColorList"
        v-if="deviceYData.length > 0"
      >
        <el-date-picker
          v-model="onLineDataTime"
          type="daterange"
          value-format="yyyy-MM-dd"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          @change="changeOnLineDataTime"
        >
        </el-date-picker>
      </bar-chart>
      <div class="table_container">
        <el-collapse @change="closeOpenOnLineTable">
          <el-collapse-item>
            <template slot="title">
              <div class="operate_container">
                <span>{{
                  showOnLineDetail ? "收起明细数据" : "展开明细数据"
                }}</span>
                <el-button type="primary" @click="exportData(1)"
                  >导出excel</el-button
                >
              </div>
            </template>
            <div class="table_content">
              <el-table :data="onLineTableObj.list" style="width: 100%">
                <el-table-column
                  v-for="(item, index) in getKeys('onLineTableObj')"
                  :key="index"
                  :prop="item"
                  :width="index == 1 ? 100 : 150"
                  align="center"
                  :label="onLineTableObj.header[0][item]"
                >
                </el-table-column>
              </el-table>
              <pagination
                :total="onLineTableObj.total"
                @pageChange="onLineTurnPage"
                @sizeChange="onLineSizeChange"
              ></pagination>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
    </div>
    <div class="top10Container">
      <bar-chart
        title="TOP10行业在线设备量"
        id="chart5"
        :showPercent="false"
        :series="sceneYData"
        yUnit="台"
        :legend="sceneTop10Legend"
        :colorList="sceneColorList"
        :xData="sceneXData"
        v-if="sceneYData.length > 0"
      >
        <el-date-picker
          v-model="sceneDataTime"
          type="daterange"
          value-format="yyyy-MM-dd"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          @change="changeSceneDataTime"
        >
        </el-date-picker>
      </bar-chart>
    </div>
    <div class="table_container">
      <el-collapse @change="closeOpenSceneTable">
        <el-collapse-item>
          <template slot="title">
            <div class="operate_container">
              <span>{{
                showSceneDetail ? "收起明细数据" : "展开明细数据"
              }}</span>
              <el-button type="primary" @click="exportData(2)"
                >导出excel</el-button
              >
            </div>
          </template>
          <div class="table_content">
            <el-table :data="sceneTableObj.list" style="width: 100%">
              <el-table-column
                v-for="(item, index) in getKeys('sceneTableObj')"
                :key="index"
                :prop="item"
                :width="index == 1 ? 100 : 160"
                align="center"
                :label="sceneTableObj.header[0][item]"
              >
              </el-table-column>
            </el-table>
            <pagination
              :total="sceneTableObj.total"
              @pageChange="sceneTurnPage"
              @sizeChange="sceneSizeChange"
            ></pagination>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script>
import LineChart from "@/components/Charts/LineChart";
import BarChart from "@/components/Charts/BarChart";
import MultiArea from "@/components/MultiArea";
import pagination from "@/components/Pagination/index.vue";
import ToolTip from "@/components/ToolTip";
import {
  getBarChartSeriesObj,
  getLineChartSeriesObj,
  userExport,
  getCurrentDate,
} from "@/utils/tool.js";
import {
  onlineDevicesInCityTop10,
  onlineDevicesInSceneTop10,
  dataOfHourlyTrend,
  dataOfMonthlyOrYearlyTrend,
  getOnlineDurationOviewData,
  onLineTop10Detail,
  sceneTop10Detail,
  filterValue,
} from "@/api/onLineTime";
export default {
  components: {
    BarChart,
    LineChart,
    MultiArea,
    pagination,
    ToolTip,
  },
  data() {
    return {
      oviewData: {},
      queryInfor: {
        scene: [],
        deviceType: [],
      },
      /**************小时趋势 */
      hourTrendYData: [],
      hourTrendXData: [],
      hourTrendLegendData: [],
      hourTrendColorList: ["#1477E3", "#89D36A", "#B31181"],
      hourTrendDate: "",
      /***************年月趋势 */
      monthYearTrendData: {},
      chartType: "1",
      trendDate: [],
      tabList: ["在线设备数", "平均单台设备在线时长"],
      activeTabIndex: 0,
      monthYearYData: [],
      monthYearXData: [],
      monthYearLegend: [],
      monthYearColorList: [],
      /*****TOP10城市在线设备量 */
      deviceXData: [],
      deviceYData: [],
      deviceTop10Legend: [],
      deviceColorList: ["#318CFF", "#FEC62E"],
      onLineDataTime: [],
      /******************TOP10行业在线设备量 */
      sceneXData: [],
      sceneYData: [],
      sceneDataTime: [],
      sceneTop10Legend: [],
      sceneColorList: ["#318CFF", "#6C3DEB"],
      filterObj: {},
      showSceneDetail: false,
      showOnLineDetail: false,
      sceneTableObj: {
        header: [],
        list: [],
        total: 0,
        pageNo: 1,
        pageSize: 10,
      },
      onLineTableObj: {
        header: [],
        list: [],
        total: 0,
        pageNo: 1,
        pageSize: 10,
      },
      trendFormatter: "{value}台",
    };
  },
  methods: {
    defaultTimeValue() {
      // console.log(1);
      if (this.chartType == "1") {
        return [getCurrentDate(30 * 24), getCurrentDate(1)];
      } else if (this.chartType == "2") {
        let date = new Date();
        let y = date.getFullYear();
        let m = date.getMonth() + 1;
        return [`${y - 1}-${m}`, `${y}-${m}`];
      }
    },
    getOviewData(city, deviceType, district, province, scene) {
      getOnlineDurationOviewData({
        city: city.join(","),
        deviceType: deviceType.join(","),
        district,
        province,
        scene: scene.join(","),
      }).then(({ data }) => {
        this.oviewData = data;
      });
    },
    //小时趋势
    getHourTrendData(date, city, deviceType, district, province, scene) {
      dataOfHourlyTrend({
        date,
        city: city.join(","),
        deviceType: deviceType.join(","),
        district,
        province,
        scene: scene.join(","),
      }).then(({ data }) => {
        this.hourTrendXData = data.date;
        let obj1 = getLineChartSeriesObj("激活总数", data.total);
        let obj2 = getLineChartSeriesObj("在线设备量", data.online);
        let obj3 = getLineChartSeriesObj("离线设备量", data.offline);
        this.hourTrendLegendData = ["激活总数", "在线设备量", "离线设备量"];
        this.hourTrendYData = [obj1, obj2, obj3];
      });
    },
    changeTab(index) {
      index === 0
        ? (this.trendFormatter = "{value}台")
        : (this.trendFormatter = "{value}min");
      this.activeTabIndex = index;
      this.$refs.monthYear.myChart.clear(this.$refs.monthYear.option);
      this.showMontYearData();
    },
    showMontYearData() {
      this.monthYearXData = this.monthYearTrendData.date;
      if (this.activeTabIndex == 0) {
        let obj1 = getLineChartSeriesObj(
          "激活总数",
          this.monthYearTrendData.totalDevicesNum
        );
        let obj2 = getLineChartSeriesObj(
          "在线设备量",
          this.monthYearTrendData.onlineDevicesNum
        );
        this.monthYearLegend = ["激活总数", "在线设备量"];
        this.monthYearColorList = ["#1477E3", "#89D36A"];
        this.monthYearYData = [obj1, obj2];
      } else {
        let obj1 = getLineChartSeriesObj(
          "平均单台设备在线时长",
          this.monthYearTrendData.AvgOnlineTimeOfDevices
        );
        this.monthYearLegend = ["平均单台设备在线时长"];
        this.monthYearColorList = ["#1477E3"];
        this.monthYearYData = [obj1];
      }
    },
    getMonthYearTrendData(
      beginDate,
      chartType,
      city,
      deviceType,
      district,
      endDate,
      province,
      scene
    ) {
      dataOfMonthlyOrYearlyTrend({
        beginDate,
        chartType,
        city: city.join(","),
        deviceType: deviceType.join(","),
        district,
        endDate,
        province,
        scene: scene.join(","),
      }).then(({ data }) => {
        this.monthYearTrendData = data;
        this.showMontYearData();
      });
    },
    getDeviceTop10Data(
      beginDate,
      city,
      deviceType,
      district,
      endDate,
      province,
      scene
    ) {
      onlineDevicesInCityTop10({
        beginDate,
        city: city.join(","),
        deviceType: deviceType.join(","),
        district,
        endDate,
        province,
        scene: scene.join(","),
      }).then(({ data }) => {
        this.deviceXData = [];
        let cityDeviceArr = [];
        let onlineDeviceArr = [];
        data.map((item) => {
          this.deviceXData.push(item.name);
          cityDeviceArr.push(item.totalDevicesNumInCity);
          onlineDeviceArr.push(item.onlineDevicesNumInCity);
        });
        let obj1 = getBarChartSeriesObj("城市设备数", cityDeviceArr);
        let obj2 = getBarChartSeriesObj("在线设备数", onlineDeviceArr);
        this.deviceTop10Legend = ["城市设备数", "在线设备数"];
        this.deviceYData = [obj1, obj2];
      });
    },
    getSceneTop10Data(
      beginDate,
      city,
      deviceType,
      district,
      endDate,
      province,
      scene
    ) {
      onlineDevicesInSceneTop10({
        beginDate,
        city: city.join(","),
        deviceType: deviceType.join(","),
        district,
        endDate,
        province,
        scene: scene.join(","),
      }).then(({ data }) => {
        this.sceneXData = [];
        let sceneTotalArr = [];
        let onlineDeviceArr = [];
        data.map((item) => {
          this.sceneXData.push(item.name);
          sceneTotalArr.push(item.totalDevicesNumOfScene);
          onlineDeviceArr.push(item.onlineDevicesNumOfScene);
        });
        let obj1 = getBarChartSeriesObj("行业设备总数", sceneTotalArr);
        let obj2 = getBarChartSeriesObj("在线设备数", onlineDeviceArr);
        this.sceneTop10Legend = ["行业设备总数", "在线设备数"];
        this.sceneYData = [obj1, obj2];
      });
    },
    getKeys(tableObjName) {
      if (this[tableObjName].header.length != 0) {
        return Object.keys(this[tableObjName].header[0]);
      }
    },
    getOnLineDetailList(
      beginDate,
      city,
      deviceType,
      district,
      endDate,
      province,
      scene,
      pageNo,
      pageSize
    ) {
      onLineTop10Detail({
        beginDate,
        city: city.join(","),
        deviceType: deviceType.join(","),
        district,
        endDate,
        province,
        scene: scene.join(","),
        pageNo,
        pageSize,
      }).then(({ data }) => {
        this.onLineTableObj.header = data.head;
        this.onLineTableObj.list = data.data.list;
        this.onLineTableObj.total = data.data.total;
      });
    },
    getSceneTop10DetailList(
      beginDate,
      city,
      deviceType,
      district,
      endDate,
      province,
      scene,
      pageNo,
      pageSize
    ) {
      sceneTop10Detail({
        beginDate,
        city: city.join(","),
        deviceType: deviceType.join(","),
        district,
        endDate,
        province,
        scene: scene.join(","),
        pageNo,
        pageSize,
      }).then(({ data }) => {
        this.sceneTableObj.header = data.head;
        this.sceneTableObj.list = data.data.list;
        this.sceneTableObj.total = data.data.total;
      });
    },
    changeHourTrendData(val) {
      let { province, city, district } = this.getParams();
      this.getHourTrendData(
        val,
        city,
        this.queryInfor.deviceType,
        district,
        province,
        this.queryInfor.scene
      );
    },
    getParams() {
      let province = "",
        city = [],
        district = "";
      if (this.$refs.multiArea != undefined) {
        province = this.$refs.multiArea.queryInfor.province;
        city = this.$refs.multiArea.queryInfor.city;
        district = this.$refs.multiArea.queryInfor.district;
      }
      return { province, city, district };
    },
    getTableData(methodName, date, tableObj) {
      let { province, city, district } = this.getParams();
      this[methodName](
        this[date][0],
        city,
        this.queryInfor.deviceType,
        district,
        this[date][1],
        province,
        this.queryInfor.scene,
        this[tableObj].pageNo,
        this[tableObj].pageSize
      );
    },
    search() {
      let { province, city, district } = this.getParams();
      this.getOviewData(
        city,
        this.queryInfor.deviceType,
        district,
        province,
        this.queryInfor.scene
      );
      this.getHourTrendData(
        this.hourTrendDate,
        city,
        this.queryInfor.deviceType,
        district,
        province,
        this.queryInfor.scene
      );
      this.getMonthYearTrendData(
        this.trendDate[0],
        this.chartType,
        city,
        this.queryInfor.deviceType,
        district,
        this.trendDate[1],
        province,
        this.queryInfor.scene
      );
      this.getDeviceTop10Data(
        this.onLineDataTime[0],
        city,
        this.queryInfor.deviceType,
        district,
        this.onLineDataTime[1],
        province,
        this.queryInfor.scene
      );
      this.getSceneTop10Data(
        this.sceneDataTime[0],
        city,
        this.queryInfor.deviceType,
        district,
        this.sceneDataTime[1],
        province,
        this.queryInfor.scene
      );
      this.getTableData(
        "getSceneTop10DetailList",
        "sceneDataTime",
        "sceneTableObj"
      );
      this.getTableData(
        "getOnLineDetailList",
        "onLineDataTime",
        "onLineTableObj"
      );
    },
    exportData(num) {
      this.$message.success(`导出中，请稍等`);
      let { province, city, district } = this.getParams();
      if (num == 1) {
        //TOP10城市在线设备量
        this.pjUrl(
          this.onLineDataTime[0],
          city,
          this.queryInfor.deviceType,
          district,
          this.onLineDataTime[1],
          "TOP10城市在线设备量",
          province,
          this.queryInfor.scene,
          "/adsOnlineDurationOverview/exportOnlineDevicesInCityTop10Detail"
        );
      } else {
        //TOP10行业在线设备量
        this.pjUrl(
          this.sceneDataTime[0],
          city,
          this.queryInfor.deviceType,
          district,
          this.sceneDataTime[1],
          "TOP10行业在线设备量",
          province,
          this.queryInfor.scene,
          "/adsOnlineDurationOverview/exportOnlineDevicesInSceneTop10Detail"
        );
      }
    },
    pjUrl(
      beginDate,
      city,
      deviceType,
      district,
      endDate,
      fileName,
      province,
      scene,
      url
    ) {
      beginDate = beginDate == undefined ? "" : beginDate;
      endDate = endDate == undefined ? "" : endDate;
      let finalUrl = `${url}?beginDate=${beginDate}&city=${city}&deviceType=${deviceType.join(
        ","
      )}&district=${district}&endDate=${endDate}&fileName=${fileName}&province=${province}&scene=${scene.join(
        ","
      )}`;
      userExport(finalUrl);
    },
    sceneTurnPage(val) {
      this.sceneTableObj.pageNo = val;
      this.getTableData(
        "getSceneTop10DetailList",
        "sceneDataTime",
        "sceneTableObj"
      );
    },
    sceneSizeChange(val) {
      this.sceneTableObj.pageSize = val;
      this.sceneTableObj.pageNo = 1;
      this.getTableData(
        "getSceneTop10DetailList",
        "sceneDataTime",
        "sceneTableObj"
      );
    },
    onLineTurnPage(val) {
      this.onLineTableObj.pageNo = val;
      this.getTableData(
        "getOnLineDetailList",
        "onLineDataTime",
        "onLineTableObj"
      );
    },
    onLineSizeChange(val) {
      this.onLineTableObj.pageSize = val;
      this.onLineTableObj.pageNo = 1;
      this.getTableData(
        "getOnLineDetailList",
        "onLineDataTime",
        "onLineTableObj"
      );
    },
    closeOpenSceneTable(val) {
      this.showOrHide(val, "showSceneDetail");
    },
    closeOpenOnLineTable(val) {
      this.showOrHide(val, "showOnLineDetail");
    },
    showOrHide(val, name) {
      if (val.length == 0) {
        this[name] = false;
      } else {
        this[name] = true;
      }
    },
    changeOnLineDataTime(val) {
      let { province, city, district } = this.getParams();
      this.getDeviceTop10Data(
        val[0],
        city,
        this.queryInfor.deviceType,
        district,
        val[1],
        province,
        this.queryInfor.scene
      );
    },
    changeSceneDataTime(val) {
      let { province, city, district } = this.getParams();
      this.getSceneTop10Data(
        val[0],
        city,
        this.queryInfor.deviceType,
        district,
        val[1],
        province,
        this.queryInfor.scene
      );
    },
    changeTrendDate(val) {
      // console.log(val);
      let { province, city, district } = this.getParams();
      this.getMonthYearTrendData(
        val[0],
        this.chartType,
        city,
        this.queryInfor.deviceType,
        district,
        val[1],
        province,
        this.queryInfor.scene
      );
    },
  },
  created() {
    this.trendDate = [getCurrentDate(30 * 24), getCurrentDate(1)];
    this.onLineDataTime = [getCurrentDate(30 * 24), getCurrentDate(1)];
    this.sceneDataTime = [getCurrentDate(30 * 24), getCurrentDate(1)];
    filterValue().then(({ data }) => {
      this.filterObj = data;
    });
    this.search();
  },
};
</script>

<style lang="scss">
.el-collapse {
  border-top: none;
  .el-collapse-item__header {
    border-bottom: none;
    .el-collapse-item__arrow {
      display: none;
    }
  }
  .el-collapse-item__wrap {
    border-bottom: none;
  }
}
div.operate_container {
  padding: 10px 20px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  > span {
    font-size: 14px;
    color: #0f79db;
    cursor: pointer;
  }
}
</style>
<style lang="scss" scoped>
.container {
  .export_Btns {
    width: 100px;
    background: #ffffff;
    border: 1px solid #2b5dea;
    border-radius: 3px;
    color: #2b5dea;
    font-size: 14px;
  }
  .oviewContainer {
    display: flex;
    margin-bottom: 10px;
    li {
      flex: 1;
      height: 132px;
      margin-right: 10px;
      background-color: #fff;
      font-size: 15px;
      padding: 20px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .title {
        color: rgba(0, 0, 0, 0.647058823529412);
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        .item {
          margin-top: 2px;
        }
      }
      .content {
        color: #3ba0ff;
      }
      .zb {
        color: rgba(0, 0, 0, 0.647058823529412);
        font-size: 13px;
      }
      .zbValue {
        color: #3ba0ff;
        font-size: 20px;
      }
    }
    li:last-child {
      margin-right: 0;
    }
  }
  .top10Container,
  .hourTrendContainer,
  .month_year_trend_container {
    background-color: #fff;
    margin-top: 10px;
  }
  .month_year_trend_container {
    padding-top: 20px;
    .tabs_date {
      display: flex;
      justify-content: space-between;
      padding-left: 20px;
      padding-right: 20px;
    }
    .tabs {
      display: flex;
      justify-content: center;
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
      li:last-child{
        border-left: none;
      }
      li.active {
        background-color: rgb(16, 142, 233);
        border-color: rgb(16, 142, 233);
        color: #fff;
      }
    }
  }
  .table_container {
    padding-top: 10px;
    background-color: #fff;
  }
}
</style>