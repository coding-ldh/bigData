<template>
  <div class="container" v-if="!showThirdPage">
    <div class="basic_infor_container">
      <user-back title="计划信息" @userBack="back()"></user-back>
      <ul>
        <li>计划ID：{{ baseInfor.planId }}</li>
        <li>计划名称：{{ baseInfor.planName }}</li>
        <li>计划投放状态：{{ baseInfor.status }}</li>
        <li>订单编号{{ baseInfor.orderId }}</li>
        <li>投放广告位：{{ baseInfor.planAdslot }}</li>
        <li>累计曝光量：{{ baseInfor.trafficCumulative }}</li>
        <li>累计转化：{{ baseInfor.conversionCumulative }}</li>
        <li>累计播放次数：{{ baseInfor.playCumulative }}</li>
        <li>
          男女比例：{{ baseInfor.maleProportion }}% /
          {{ baseInfor.femaleProportion }}%
        </li>
        <li>18-34岁占比：{{ Math.round(baseInfor.age1834Proportion) }}%</li>
        <li>投放时间：{{ baseInfor.planPeriod }}</li>
        <li>已拉取设备量/投放设备总量：{{ baseInfor.pullVsPlanDevice }}</li>
        <li></li>
        <li></li>
        <li>
          <el-button
            plain
            @click="exportDeviceData()"
            class="el-button--primary"
            >导出设备曝光数据</el-button
          >
        </li>
      </ul>
    </div>
    <div class="trendChart_container maginTop10">
      <line-chart
        id="trendChartId"
        title="趋势图"
        :series="trendSeries"
        :colorList="trendColorList"
        :trendXData="trendXData"
        :formatter="formatter"
      >
        <div class="query">
          <el-form
            :inline="true"
            :model="basicQueryInfor"
            class="demo-form-inline"
          >
            <el-form-item>
              <el-date-picker
                v-model="basicQueryInfor.time"
                value-format="yyyy-MM-dd"
                type="daterange"
                range-separator="~"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="pickerOptions"
                @change="changeTime"
              ></el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-radio
                v-model="basicQueryInfor.currentTrend"
                :label="0"
                :value="0"
                @change="trendTypeChange"
                >素材播放次数</el-radio
              >
              <el-radio
                v-model="basicQueryInfor.currentTrend"
                :label="1"
                :value="1"
                @change="trendTypeChange"
                >曝光量</el-radio
              >
              <el-radio
                v-model="basicQueryInfor.currentTrend"
                :label="2"
                :value="2"
                @change="trendTypeChange"
                >拉取设备量</el-radio
              >
            </el-form-item>
          </el-form>
        </div>
      </line-chart>
    </div>
    <ul class="age_sex_scene_device maginTop10">
      <li class="first">
        <bar-chart
          title="年龄占比"
          yUnit="%"
          id="chart1"
          :xData="ageCharX"
          :series="ageSeries"
          v-if="ageSeries.length != 0"
        ></bar-chart>
        <div class="tips_no_data" v-else>年龄占比暂未拉取</div>
      </li>
      <li>
        <circle-chart
          id="chart2"
          title="性别占比"
          Unit="人次"
          :chartData="sexChartData"
          v-if="sexChartData.length != 0"
          :colors="sexChartColors"
        ></circle-chart>
        <div class="tips_no_data" v-else>性别占比暂未拉取</div>
      </li>
    </ul>
    <ul class="age_sex_scene_device maginTop10">
      <li>
        <circle-chart
          id="chart3"
          title="场景类别曝光量占比"
          :chartData="exposureData"
          v-if="exposureData.length != 0"
          :colors="exposureChartColors"
        >
          <!-- <i
            class="el-icon-right"
            @click="goImportScenePage(exposureData, '曝光量')"
          ></i>-->
        </circle-chart>
        <div class="tips_no_data" v-else>场景类别曝光量占比为零</div>
      </li>
      <li>
        <circle-chart
          id="chart4"
          title="场景类别拉取设备占比"
          :chartData="deviceData"
          v-if="deviceData.length != 0"
          :colors="exposureChartColors"
        >
          <i
            class="el-icon-right"
            @click="goImportScenePage(exposureData, deviceData)"
          >
            <!-- exposureData, deviceData -->
          </i>
        </circle-chart>
        <div class="tips_no_data" v-else>场景类别拉取设备占比为零</div>
      </li>
    </ul>
    <div class="table_container maginTop10">
      <div class="text_operate_container">
        投放效果明细
        <el-button plain @click="exportPlanDtList()">导出Excel</el-button>
      </div>
      <el-table :data="planDtList" stripe style="width: 100%">
        <el-table-column
          label="日期"
          prop="planDt"
          width="100"
          align="center"
        ></el-table-column>
        <el-table-column
          label="拉取设备量/投放设备量"
          prop="pullDevices"
          width="100"
          align="center"
        >
          <template slot-scope="scope">
            {{ scope.row.pullDevices }}/{{ scope.row.planDevices }}
          </template>
        </el-table-column>
        <el-table-column
          label="累计观看时长"
          prop="watchTime"
          width="130"
          align="center"
        ></el-table-column>
        <el-table-column
          label="播放时长"
          prop="planPlayTime"
          width="130"
          align="center"
        ></el-table-column>
        <el-table-column
          label="播放次数"
          prop="planPlayNumber"
          align="center"
        ></el-table-column>
        <el-table-column label="曝光量" prop="planExposure"></el-table-column>
        <el-table-column
          label="男性占比(%)"
          width="100"
          align="center"
          prop="maleProportion"
        ></el-table-column>
        <el-table-column
          label="女性占比(%)"
          width="100"
          align="center"
          prop="femaleProportion"
        ></el-table-column>
        <el-table-column
          label="0-17岁占比(%)"
          prop="age17Proportion"
          width="120"
          align="center"
        ></el-table-column>
        <el-table-column
          label="18-24岁占比(%)"
          prop="age1824Proportion"
          width="130"
          align="center"
        ></el-table-column>
        <el-table-column
          label="25-34岁占比(%)"
          prop="age2534Proportion"
          width="130"
          align="center"
        ></el-table-column>
        <el-table-column
          label="35-44岁占比(%)"
          prop="age3544Proportion"
          width="130"
          align="center"
        ></el-table-column>
        <el-table-column
          label="45-54岁占比(%)"
          prop="age4554Proportion"
          width="130"
          align="center"
        ></el-table-column>
        <el-table-column
          label="55岁以上占比(%)"
          prop="age55Proportion"
          width="130"
          align="center"
        ></el-table-column>
      </el-table>
      <pagination
        :total="planDtListTotal"
        @pageChange="planDtPageChange"
        @sizeChange="planDtSizeChange"
      ></pagination>
    </div>
    <div class="table_container maginTop10">
      <div class="text_operate_container">
        广告素材列表
        <el-button plain @click="exportMateria()">导出Excel</el-button>
      </div>
      <div class="imgLoupe">
        <img v-show="imgShow" class="imgAndvideo" src="" alt="" />
        <video
          v-show="!imgShow"
          class="imgAndvideo"
          autoplay="autoplay"
          loop="loop"
          muted
          controls
          alt=""
        />
      </div>
      <el-table :data="materialList" stripe style="width: 100%">
        <el-table-column
          label="日期"
          prop="dt"
          width="100"
          align="center"
        ></el-table-column>
        <el-table-column
          label="素材名称"
          prop="materialName"
          align="center"
        ></el-table-column>
        <el-table-column label="缩略图" align="center">
          <template slot-scope="scope">
            <img
              :src="scope.row.thumbnail"
              alt
              style="width: 40px; height: 71px"
              @mouseenter="imgEnter($event, scope.row.thumbnail, 'img')"
              @mouseleave="imgLeave()"
              @error="imgError($event, scope.row.thumbnail)"
            />
            <video
              alt
              style="display: none; width: 40px; height: 71px"
              @mouseenter="imgEnter($event, scope.row.thumbnail, 'video')"
              @mouseleave="imgLeave()"
              @error="videoError($event)"
            />
            <img style="display: none; width: 40px; height: 71px" />
          </template>
        </el-table-column>
        <el-table-column
          label="累计观看时长"
          prop="watchCumulative"
          width="130"
          align="center"
        ></el-table-column>
        <el-table-column
          label="累计播放时长"
          prop="playTime"
          width="130"
          align="center"
        ></el-table-column>
        <el-table-column
          label="累计播放次数"
          prop="playCumulative"
          width="120"
          align="center"
        ></el-table-column>
        <el-table-column
          label="累计曝光量"
          prop="trafficCumulative"
          width="90"
          align="center"
        ></el-table-column>
        <!-- <el-table-column /// 弃用
          label="累计转化量"
          prop="conversionCumulative"
          width="120"
        ></el-table-column>-->
        <el-table-column
          label="男性占比(%)"
          prop="maleProportion"
          align="center"
          width="100"
        ></el-table-column>
        <el-table-column
          label="女性占比(%)"
          prop="femaleProportion"
          align="center"
          width="100"
        ></el-table-column>
        <el-table-column
          label="0-17岁占比(%)"
          prop="age17Proportion"
          align="center"
          width="128"
        ></el-table-column>
        <el-table-column
          label="18-24岁占比(%)"
          prop="age1824Proportion"
          align="center"
          width="128"
        ></el-table-column>
        <el-table-column
          label="25-34岁占比(%)"
          prop="age2534Proportion"
          align="center"
          width="128"
        ></el-table-column>
        <el-table-column
          label="35-44岁占比(%)"
          prop="age3544Proportion"
          align="center"
          width="128"
        ></el-table-column>
        <el-table-column
          label="45-54岁占比(%)"
          prop="age4554Proportion"
          align="center"
          width="128"
        ></el-table-column>
        <el-table-column
          label="55岁以上占比(%)"
          prop="age55Proportion"
          align="center"
          width="128"
        ></el-table-column>
      </el-table>
      <pagination
        :total="materialTotal"
        @pageChange="materialPageChange"
        @sizeChange="materialSizeChange"
      ></pagination>
    </div>
  </div>
  <import-scene
    v-else
    :thirdPageData="thirdPageData"
    :exposureList="exposureList"
    :deviceDataList="deviceDataList"
    :exposureAndDeviceData="exposureAndDeviceData"
    :planId="planId"
    :baseInfor="baseInfor"
    :formType="formType"
    @back="showThirdPage = !showThirdPage"
  ></import-scene>
</template>

<script>
import BarChart from "@/components/Charts/BarChart";
import CircleChart from "@/components/Charts/CircleChart";
import LineChart from "@/components/Charts/LineChart";
import {
  getBarChartSeriesObj,
  getLineChartSeriesObj,
  userExport,
  getCurrentDate,
  getCurrentTime,
} from "@/utils/tool.js";
import pagination from "@/components/Pagination/index.vue";
import ImportScene from "./importScene.vue";
import UserBack from "@/components/UserBack";
import {
  adsAdverPlanDtList,
  planDetailBaseInfor,
  adverPlanMaterialList,
  planDetailAge,
  planDetailSex,
  proportionOfPlanExposureScene,
  proportionOfPlanDevicesScene,
  dataOfPlanPlayNumAndExposureAndDevices,
} from "@/api/userPortrait";
import ImgLoupe from "@/components/ImgLoupe/ImgLoupe.vue";
export default {
  mixins: [ImgLoupe],
  props: {
    planId: String,
  },
  components: {
    BarChart,
    CircleChart,
    LineChart,
    pagination,
    ImportScene,
    UserBack,
  },
  data() {
    return {
      planDtList: [],
      materialList: [],
      planDtListTotal: 0,
      materialTotal: 0,
      beginDate: "",
      endDate: "",
      formType: "",
      formatter: "{value}次",
      thirdPageData: [],
      showThirdPage: false,
      basicQueryInfor: {
        currentTrend: 0,
        time: [],
      },
      exposureList: "",
      deviceDataList: "",
      exposureAndDeviceData: [],
      trendXData: [],
      trendSeries: [],
      trendColorList: ["#2B5DEA"],
      baseInfor: {},
      sexChartColors: ["#F2637B", "#3BA0FF"],
      exposureChartColors: [
        "#3BA0FF",
        "#36CBCB",
        "#4DCB73",
        "#FAD337",
        "#F2637B",
        "#975FE4",
      ],
      deviceData: [],
      exposureData: [],
      ageCharX: [
        "18岁以下",
        "18-24岁",
        "25-34岁",
        "35-44岁",
        "45-54岁",
        "55岁以上",
      ],
      ageSeries: [],
      sexChartData: [],
      planDtListPageInfor: {
        pageNo: 1,
        pageSize: 10,
      },
      materialPageInfor: {
        pageNo: 1,
        pageSize: 10,
      },
      pickerOptions: {
        disabledDate: (time) => {
          let arr = this.baseInfor.planPeriod.split("--");
          const startTime = arr[0].split(" ")[0];
          const endTime = arr[1].split(" ")[1];
          const finalStartTime = getCurrentDate(24, startTime);
          return (
            time.getTime() > new Date(endTime).getTime() ||
            time.getTime() < new Date(finalStartTime).getTime()
          );
        },
      },
    };
  },
  created() {
    this.getBaseInfor();
    this.getAdverPlanMaterialList();
    this.getAgeData();
    this.getSexData();
    this.getExposureData();
    this.getDeviceData();
    this.getAdsAdverPlanDtList();
  },
  watch: {
    baseInfor: {
      handler: function (newVal) {
        if (JSON.stringify(newVal) != "{}") {
          if (newVal.planPlayTime) {
            let arr = newVal.planPlayTime.split("--");
            this.basicQueryInfor.time = [
              arr[0].split(" ")[0],
              arr[1].split(" ")[1],
            ];
            this.getTrendData(arr[0].split(" ")[0], arr[1].split(" ")[1], 0);
          }
        }
      },
      immediate: true,
    },
  },
  methods: {
    back() {
      this.$emit("back");
    },
    getBaseInfor() {
      planDetailBaseInfor({ planId: this.planId }).then(({ data }) => {
        if (data == null) {
          this.baseInfor = {};
        } else {
          const targetData = data;
          this.baseInfor = {
            ...targetData,
            pullVsPlanDevice: `${targetData.pullDevices}/${targetData.planDevices}`,
          };
          // console.log(this.baseInfor);
          this.getBeginAndEndDate();
          if (this.basicQueryInfor.time.length <= 0) {
            this.basicQueryInfor.time = [this.beginDate, this.endDate];
            this.getTrendData(
              this.basicQueryInfor.time[0],
              this.basicQueryInfor.time[1],
              this.basicQueryInfor.currentTrend
            );
          }
        }
      });
    },
    getAgeData() {
      planDetailAge({ planId: this.planId }).then(({ data }) => {
        this.ageSeries = [];
        const manDataArr = data.man.map((item) => Math.round(item));
        const manDataObj = getBarChartSeriesObj("男", manDataArr);
        this.ageSeries.push(manDataObj);
        const womanDataArr = data.woman.map((item) => Math.round(item));
        const womanDataObj = getBarChartSeriesObj("女", womanDataArr);
        this.ageSeries.push(womanDataObj);
        // console.log(this.ageSeries);
        // 产品说要隐藏0数据
        this.ageSeries = this.ageSeries.filter((item) => {
          let total = 0;
          for (let i = 0; i < item.data.length; i++) {
            total += item.data[i];
          }
          return total != 0;
        });
      });
    },
    async getAdsAdverPlanDtList() {
      const { data } = await adsAdverPlanDtList({
        planId: this.planId,
        pageNo: this.planDtListPageInfor.pageNo,
        pageSize: this.planDtListPageInfor.pageSize,
      });
      for (let i = 0; i < data.records.length; i++) {
        data.records[i].watchTime =
          data.records.length != 0
            ? getCurrentTime(data.records[i].watchTime / 1000)
            : "";
        data.records[i].planPlayTime =
          data.records.length != 0
            ? getCurrentTime(data.records[i].planPlayTime)
            : "";
      }
      // console.log(data.records);
      this.planDtList = data.records;
      this.planDtListTotal = data.total;
    },
    getSexData() {
      planDetailSex({ planId: this.planId }).then(({ data }) => {
        // console.log(data);
        // 产品说要隐藏0数据
        this.sexChartData = data.filter((item) => item.value != 0);
      });
    },
    async getAdverPlanMaterialList() {
      const { data } = await adverPlanMaterialList({
        planId: this.planId,
        pageNo: this.materialPageInfor.pageNo,
        pageSize: this.materialPageInfor.pageSize,
      });
      for (let i = 0; i < data.records.length; i++) {
        data.records[i].watchCumulative =
          data.records.length != 0
            ? getCurrentTime(data.records[i].watchCumulative / 1000)
            : "";
        data.records[i].playTime =
          data.records.length != 0
            ? getCurrentTime(data.records[i].playTime)
            : "";
      }
      this.materialList = data.records;
      this.materialTotal = data.total;
    },
    getExposureData() {
      proportionOfPlanExposureScene({ planId: this.planId }).then(
        ({ data }) => {
          // console.log(data);
          // 产品说要隐藏0数据
          this.exposureData = data.filter((item) => item.value != 0);
        }
      );
    },
    getTrendData(beginDate, endDate, type) {
      dataOfPlanPlayNumAndExposureAndDevices({
        planId: this.planId,
        beginDate,
        endDate,
      }).then(({ data }) => {
        this.trendSeries = [];
        this.trendXData = data.date;
        let obj = null;
        if (type == 0) {
          obj = getLineChartSeriesObj("素材播放次数", data.data.planPlayNumArr);
        } else if (type == 1) {
          obj = getLineChartSeriesObj("曝光量", data.data.planExposureArr);
        } else {
          obj = getLineChartSeriesObj("拉取设备量", data.data.planDevicesArr);
        }
        this.trendSeries.push(obj);
      });
    },
    getDeviceData() {
      proportionOfPlanDevicesScene({ planId: this.planId }).then(({ data }) => {
        // 产品说要隐藏0数据
        this.deviceData = data.filter((item) => item.value != 0);
      });
    },
    planDtPageChange(val) {
      this.planDtListPageInfor.pageNo = val;
      this.getAdsAdverPlanDtList();
    },
    planDtSizeChange(val) {
      this.planDtListPageInfor.pageSize = val;
      this.getAdsAdverPlanDtList();
    },
    changeTime(val) {
      this.getTrendData(val[0], val[1], this.basicQueryInfor.currentTrend);
      this.basicQueryInfor.time = val;
    },
    trendTypeChange(val) {
      val == 0
        ? (this.formatter = "{value}次")
        : val == 1
        ? (this.formatter = "{value}次")
        : (this.formatter = "{value}台");
      this.basicQueryInfor.currentTrend = val;
      this.getTrendData(
        this.basicQueryInfor.time[0],
        this.basicQueryInfor.time[1],
        val
      );
    },
    materialPageChange(val) {
      this.materialPageInfor.pageNo = val;
      this.getAdverPlanMaterialList();
    },
    materialSizeChange(val) {
      this.materialPageInfor.pageSize = val;
      this.getAdverPlanMaterialList();
    },
    exportPlanDtList() {
      this.$message.success(`导出中，请稍等`);
      let url = `/adverReleasePlanDetail/adsAdverPlanDtList/export?planId=${this.planId}&fileName=投放效果明细`;
      userExport(url);
    },
    exportMateria() {
      this.$message.success(`导出中，请稍等`);
      let url = `/adverReleasePlanDetail/adverPlanMaterialList/export?planId=${this.planId}&fileName=广告素材列表`;
      userExport(url);
    },
    exportDeviceData() {
      this.$message.success(`导出中，请稍等`);
      let date = new Date();
      let time = `${date.getFullYear()}-${
        date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1
      }-${date.getDate() < 10 ? "0" + date.getDate() : date.getDate()}`;
      let url = `/adverReleasePlanDetail/adsAdverPlayTimesCount/export?&beginDate=${this.beginDate}&endDate=${this.endDate}&planId=${this.planId}&fileName=${this.baseInfor.planName}-${time}`;
      userExport(url);
    },
    goImportScenePage(exposureData, deviceData) {
      this.exposureList = exposureData;
      this.deviceDataList = deviceData; // 设备数
      // console.log(this.exposureList)
      // this.thirdPageData = list;
      this.showThirdPage = true;
      // this.formType = formType;
    },
    getBeginAndEndDate() {
      const formatDate = function (date) {
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        m = m < 10 ? "0" + m : m;
        var d = date.getDate();
        d = d < 10 ? "0" + d : d;
        return y + "-" + m + "-" + d;
      };
      const dateArr = this.baseInfor.planPeriod.split(" -- ");
      this.beginDate = formatDate(new Date(dateArr[0]));
      const end = new Date(dateArr[1]);
      const current = getCurrentDate(1);
      const currentDate = new Date(current);
      end.getTime() > currentDate.getTime()
        ? (this.endDate = current)
        : (this.endDate = formatDate(end));
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  .trendChart_container {
    background-color: #fff;
    .query {
      color: #333;
      font-size: 16px;
      font-weight: bold;
      padding-left: 30px;
      .demo-form-inline {
        margin-bottom: 20px;
      }
    }
  }
  .age_sex_scene_device {
    display: flex;
    li {
      flex: 1;
      height: 420px;
      background-color: #fff;
    }
    .first {
      margin-right: 11px;
    }
    .tips_no_data {
      line-height: 420px;
      text-align: center;
      font-size: 18px;
      color: rgb(199, 199, 199);
      user-select: none;
    }
  }
  .table_container {
    padding: 30px;
    background-color: #fff;
    .imgLoupe {
      position: fixed;
      z-index: 999;
      top: 0;
      left: 50%;
      width: 0px;
      aspect-ratio: 9/16;
      height: 100%;
      opacity: 0;
      transition: all 0.3s;
      box-shadow: 0 0 10px 0 #4e4e4e;
      overflow: hidden;
      background: #fff;
      .imgAndvideo {
        position: absolute;
        min-height: 300px;
        width: 100%;
        height: 100%;
        top: 0;
      }
    }
    .text_operate_container {
      color: #333;
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 15px;
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>
