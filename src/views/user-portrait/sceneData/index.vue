<template>
  <div class="container">
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
            <el-option label="全部设备" value=""></el-option>
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
          <multi-area ref="multiArea" methodName="option"></multi-area>
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
            <el-option label="全部行业" value=""></el-option>
            <el-option
              v-for="item in filterObj.scene"
              :label="item"
              :value="item"
              :key="item"
              >{{ item }}</el-option
            >
          </el-select>
        </el-form-item>
        <el-form-item label="时间:">
          <el-date-picker
            :default-value="currentData"
            v-model="queryInfor.dateRange"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search()">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="reset()">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="barContainer">
      <bar-chart
        title="行业流量"
        id="chart1"
        :series="trafficDataY"
        :colorList="trafficColorList"
        :xData="trafficDataX"
        yUnit="PV"
        v-if="trafficDataY.length > 0"
      >
      </bar-chart>
      <my-table
        :tableObj="trafficTableObj"
        @userExport="exportFlow()"
        @turnPage="trafficTurnPage"
        @sizeChange="trafficSizeChange"
      ></my-table>
    </div>
    <div class="barContainer scene_device_container">
      <bar-chart
        title="行业设备量"
        id="chart2"
        :showPercent="false"
        yUnit="台"
        :series="sceneDeviceDataY"
        :colorList="sceneDeviceColorList"
        :xData="sceneDeviceDataX"
        :legend="sceneLegendData"
        v-if="sceneDeviceDataY.length > 0"
      >
      </bar-chart>
      <my-table
        :tableObj="sceneTableObj"
        @userExport="exportDevice()"
        @turnPage="deviceTurnPage"
        @sizeChange="deviceSizeChange"
      ></my-table>
    </div>
  </div>
</template>

<script>
import BarChart from "@/components/Charts/BarChart";
import MyTable from "./components/MyTable.vue";
import MultiArea from "@/components/MultiArea";
import {
  getBarChartSeriesObj,
  userExport,
  getCurrentDate,
} from "@/utils/tool.js";
import {
  sceneTrafficInSceneTop10,
  sceneEquipmentQuantityInSceneTop10,
  sceneTrafficInSceneTop10Detail,
  sceneEquipmentQuantityInSceneTop10Detail,
  filterValue,
} from "@/api/sceneData";
export default {
  components: {
    BarChart,
    MyTable,
    MultiArea,
  },
  data() {
    return {
      currentData: "",
      queryInfor: {
        deviceType: [],
        scene: [],
        dateRange: [],
      },
      cacheQueryInfor: {},
      filterObj: {},
      /******行业流量 */
      trafficDataY: [],
      trafficDataX: [],
      trafficColorList: ["#3BA0FF"],
      trafficTableObj: {
        header: [],
        list: [],
        total: 0,
        pageNo: 1,
        pageSize: 10,
      },
      /*******行业设备量 */
      sceneDeviceDataY: [],
      sceneDeviceDataX: [],
      sceneDeviceColorList: ["#3BA0FF", "#3AFFA2"],
      sceneLegendData: ["激活设备总数", "流量上报的设备量"],
      sceneTableObj: {
        header: [],
        list: [],
        total: 0,
        pageNo: 1,
        pageSize: 10,
      },
    };
  },
  watch: {
    "queryInfor.deviceType": {
      handler(newVal) {
        const allSelect = newVal.includes("");
        if (allSelect) {
          this.queryInfor.deviceType = this.filterObj.deviceType;
        }
      },
      immediate: true,
    },
    "queryInfor.scene": {
      handler(newVal) {
        const allSelect = newVal.includes("");
        if (allSelect) {
          this.queryInfor.scene = this.filterObj.scene;
        }
      },
      immediate: true,
    },
  },
  created() {
    this.initTimeValue();
    this.search();
    filterValue().then(({ data }) => {
      this.filterObj = data;
    });
  },
  methods: {
    initTimeValue() {
      const time1 = getCurrentDate(30 * 24);
      const time2 = getCurrentDate(1 * 24);
      // console.log(time1, time2);
      this.queryInfor.dateRange = [time1, time2];
    },
    //获取参数
    getParamVal() {
      let province = "",
        city = [],
        district = "";
      let { deviceType, scene, dateRange } = this.queryInfor;
      if (this.$refs.multiArea != undefined) {
        province = this.$refs.multiArea.queryInfor.province;
        city = this.$refs.multiArea.queryInfor.city;
        district = this.$refs.multiArea.queryInfor.district;
      }
      return { deviceType, scene, dateRange, province, city, district };
    },
    getTrafficData() {
      let { deviceType, scene, dateRange, province, city, district } =
        this.getParamVal();
      sceneTrafficInSceneTop10({
        beginDate: dateRange[0],
        city: city.join(","),
        deviceType: deviceType.join(","),
        district,
        endDate: dateRange[1],
        province,
        scene: scene.join(","),
      }).then(({ data }) => {
        let yArr = [];
        this.trafficDataX = [];
        data.map((item) => {
          yArr.push(item.pv);
          this.trafficDataX.push(item.name);
        });
        let obj = getBarChartSeriesObj("行业流量", yArr);
        this.trafficDataY = [obj];
      });
    },
    getTrafficTableData() {
      let { deviceType, scene, dateRange, province, city, district } =
        this.getParamVal();
      sceneTrafficInSceneTop10Detail({
        beginDate: dateRange[0],
        city: city.join(","),
        deviceType: deviceType.join(","),
        district,
        endDate: dateRange[1],
        pageNo: this.trafficTableObj.pageNo,
        pageSize: this.trafficTableObj.pageSize,
        province,
        scene: scene.join(","),
      }).then(({ data }) => {
        this.trafficTableObj.list = data.data.list;
        this.trafficTableObj.header = data.head;
        this.trafficTableObj.total = data.data.total;
      });
    },
    getSceneDeviceData() {
      let { deviceType, scene, dateRange, province, city, district } =
        this.getParamVal();
      sceneEquipmentQuantityInSceneTop10({
        beginDate: dateRange[0],
        city: city.join(","),
        deviceType: deviceType.join(","),
        district,
        endDate: dateRange[1],
        province,
        scene: scene.join(","),
      }).then(({ data }) => {
        let activeDeviceTotalArr = [];
        let pvDeviceTotalArr = [];
        this.sceneDeviceDataX = [];
        data.map((item) => {
          this.sceneDeviceDataX.push(item.name);
          activeDeviceTotalArr.push(item.activeDeviceTotalNum);
          pvDeviceTotalArr.push(item.pvDeviceTotalNum);
        });
        let obj1 = getBarChartSeriesObj("激活设备总数", activeDeviceTotalArr);
        let obj2 = getBarChartSeriesObj("流量上报的设备量", pvDeviceTotalArr);
        this.sceneDeviceDataY = [obj1, obj2];
      });
    },
    getSceneTableData() {
      let { deviceType, scene, dateRange, province, city, district } =
        this.getParamVal();
      sceneEquipmentQuantityInSceneTop10Detail({
        beginDate: dateRange[0],
        city: city.join(","),
        deviceType: deviceType.join(","),
        district,
        endDate: dateRange[1],
        pageNo: this.sceneTableObj.pageNo,
        pageSize: this.sceneTableObj.pageSize,
        province,
        scene: scene.join(","),
      }).then(({ data }) => {
        this.sceneTableObj.list = data.data.list;
        this.sceneTableObj.header = data.head;
        this.sceneTableObj.total = data.data.total;
      });
    },
    //导出行业流量明细
    exportFlow() {
      this.$message.success(`导出中，请稍等`);
      let { deviceType, scene, dateRange, province, city, district } =
        this.getParamVal();
      let beginDate = dateRange.length == 0 ? "" : dateRange[0];
      let endDate = dateRange.length == 0 ? "" : dateRange[1];
      let finalUrl = `/sceneOverview/exportSceneTrafficInSceneTop10Detail?beginDate=${beginDate}&city=${city.join(
        ","
      )}&deviceType=${deviceType.join(
        ","
      )}&district=${district}&endDate=${endDate}&fileName=行业流量明细&province=${province}&scene=${scene.join(
        ","
      )}`;
      userExport(finalUrl);
    },
    //导出行业设备量
    exportDevice() {
      this.$message.success(`导出中，请稍等`);
      let { deviceType, scene, dateRange, province, city, district } =
        this.getParamVal();
      let beginDate = dateRange.length == 0 ? "" : dateRange[0];
      let endDate = dateRange.length == 0 ? "" : dateRange[1];
      let finalUrl = `/sceneOverview/exportSceneEquipmentQuantityInSceneTop10Detail?beginDate=${beginDate}&city=${city.join(
        ","
      )}&deviceType=${deviceType.join(
        ","
      )}&district=${district}&endDate=${endDate}&fileName=行业设备量明细&province=${province}&scene=${scene.join(
        ","
      )}`;
      userExport(finalUrl);
    },
    trafficTurnPage(val) {
      this.trafficTableObj.pageNo = val;
      this.getTrafficTableData();
    },
    trafficSizeChange(val) {
      this.trafficTableObj.pageSize = val;
      this.getTrafficTableData();
    },
    deviceTurnPage(val) {
      this.sceneTableObj.pageNo = val;
      this.getSceneTableData();
    },
    deviceSizeChange(val) {
      this.sceneTableObj.pageSize = val;
      this.getSceneTableData();
    },
    search() {
      this.getTrafficData();
      this.getSceneDeviceData();
      this.getTrafficTableData();
      this.getSceneTableData();
    },
    //重置
    reset() {
      this.queryInfor.dateRange = [];
      this.queryInfor.deviceType = [];
      this.queryInfor.scene = [];
      this.$nextTick(() => {
        this.$refs.multiArea.queryInfor.city = [];
        this.$refs.multiArea.queryInfor.district = "";
        this.$refs.multiArea.queryInfor.province = "";
      });
      this.search();
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
  },
  mounted() {
    this.initCurrentDate();
  },
};
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  .barContainer {
    background-color: #fff;
    margin-top: 10px;
  }
}
</style>
