<template>
  <div class="container">
    <el-form :inline="true" :model="queryInfor" class="demo-form-inline">
      <div class="container_title">广告数据-实时数据</div>
      <el-form-item label="设备类型">
        <el-select
          v-model="queryInfor.deviceType"
          placeholder="请选择设备类型"
          multiple
          collapse-tags
          width="300"
        >
          <el-option
            v-for="item in deviceType"
            :key="item"
            :label="item"
            :value="item"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="行业">
        <el-select
          v-model="queryInfor.scene"
          placeholder="请选择行业"
          multiple
          clearable
          collapse-tags
        >
          <el-option
            v-for="item in scene"
            :key="item"
            :label="item"
            :value="item"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="地区">
        <my-area
          @fromChildArea="getAreaData"
          :provinceInfo="provinceInfo"
          ref="myAreaClear"
        ></my-area>
      </el-form-item>

      <el-form-item label="设备编号">
        <el-input
          v-model="queryInfor.id"
          placeholder="请输入设备编号"
        ></el-input>
      </el-form-item>
      <el-form-item label="项目名称">
        <el-select
          v-model="queryInfor.itemName"
          filterable
          remote
          reseve-keyword
          allow-create
          placeholder="输入项目名称"
          :remote-method="changeItem"
          clearable
          :loading="loading.vagueSearchLoading"
        >
          <el-option
            v-for="item in getItem"
            :key="item"
            :label="item"
            :value="item"
          ></el-option>
        </el-select>
      </el-form-item>
      <!-- 按钮 -->
      <el-form-item>
        <el-button
          type="primary"
          @click="search(1, false, true)"
          :disabled="this.loading.search"
          v-loading="this.loading.search"
          >查询</el-button
        >
      </el-form-item>
      <el-form-item>
        <el-button type="primary" plain @click="userReset">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="content">
      <div class="real_data_num">
        <p class="content_title">实时人流量 (次)</p>
        <div class="content_nav">
          <div class="content_nav_nowDay_PV">
            <p class="content_nav_nowDay_PV_all_day">
              今日总流量
              <span style="color: #1890ff">{{ AllTimeData }}</span>
            </p>
            <count-to
              :start-val="cacheAllPv"
              :end-val="AllPv"
              :duration="clearTimeOut"
              :easingFn="easingFn"
              class="card-panel-num"
            />
          </div>
          <div class="content_nav_nowDay_PV">
            <p class="content_nav_nowDay_PV_now">
              今日
              <span style="color: #1890ff">{{ currentTime }}</span>
              人流量增量统计
            </p>
            <count-to
              :start-val="cacheNowPv"
              :end-val="nowPv"
              :duration="clearTimeOut"
              :easingFn="easingFn"
              class="card-panel-num"
            />
          </div>
        </div>
      </div>
      <line-charts
        v-loading="loading.lineLoading"
        id="chart1"
        title="实时人流量趋势图"
        ref="myLineChart"
        :series="seriesData"
        :colorList="ColorList"
        :trendXData="lineChartsTimeData"
      >
        <div>
          <el-radio v-model="radioNum" :label="1" @change="radioChange(1)"
            >上周同期</el-radio
          >
          <el-radio v-model="radioNum" :label="2" @change="radioChange(2)"
            >昨日</el-radio
          >
        </div>
      </line-charts>
    </div>
  </div>
</template>

<script>
import { reset, cacheParamList } from "@/utils/tool.js";
import MyArea from "./components/Area.vue";
import LineCharts from "./components/LineCharts.vue";
import {
  getRealTimeInfoList,
  getRealTimeTraffic,
  getParamItem,
} from "@/api/userPortrait";
import CountTo from "vue-count-to";

export default {
  components: { MyArea, LineCharts, CountTo },
  data() {
    return {
      // param
      queryInfor: {
        id: "",
        deviceType: [],
        scene: [],
        itemName: "",
        area: ["", ""],
      },
      // paramList
      deviceType: [],
      scene: [],
      provinceInfo: [],
      getItem: [],
      // control
      radioNum: 1,
      timer: null,
      clearTimeOut: 60000, // 一分钟调一次接口
      loading: {
        lineLoading: false,
        vagueSearchLoading: false,
        search: false,
      },
      ColorList: [
        "#108ee9", // 上周同期颜色
        "#97e7eb", // 当日数据颜色
        "#a0b5ff", // 上周同期-线段颜色
        "#a9faff", // 当日数据-线段颜色
      ],
      // data
      seriesData: [],
      lineChartsTimeData: [
        "00:00",
        "01:00",
        "02:00",
        "03:00",
        "04:00",
        "05:00",
        "06:00",
        "07:00",
        "08:00",
        "09:00",
        "10:00",
        "11:00",
        "12:00",
        "13:00",
        "14:00",
        "15:00",
        "16:00",
        "17:00",
        "18:00",
        "19:00",
        "20:00",
        "21:00",
        "22:00",
        "23:00",
        "24:00",
      ],
      lastWeek: {
        name: "上周同期",
        type: "line",
        data: [],
      },
      nowDay: {
        name: "今日",
        type: "line",
        data: [],
      },
      AllPv: 0,
      cacheAllPv: 0,
      nowPv: 0,
      cacheNowPv: 0,
      currentTime: "",
      AllTimeData: "",
    };
  },
  methods: {
    initData() {
      this.initArea();
      this.initTimer();
      this.search(this.radioNum);
    },
    async initArea() {
      let { data } = await getRealTimeInfoList();
      this.deviceType = data.deviceTypeInfo;
      this.scene = data.industryInfo;
      this.provinceInfo = data.provinceInfo;
    },
    initTimer() {
      this.timer = setInterval(() => {
        this.search(this.radioNum);
      }, this.clearTimeOut);
      let date = new Date();
      let y = date.getFullYear();
      let m = date.getMonth() + 1;
      let d = date.getDate();
      this.AllTimeData = `${y}-${m}-${d}`;
    },
    userReset() {
      reset(this.queryInfor);
      this.radioNum = 1;
      this.$refs.myAreaClear.reset();
      this.search(1, false, true);
    },
    getAreaData(val) {
      this.queryInfor.area[0] = val[0];
      this.queryInfor.area[1] = val[1];
    },
    radioChange(val) {
      // this.radioNum = val;
      this.search(val, true);
    },
    changeItem(val) {
      this.loading.vagueSearchLoading = true;
      getParamItem({ projectName: val }).then((data) => {
        this.loading.vagueSearchLoading = false;
        this.getItem = data;
      });
    },
    easingFn(t, b, c, d) {
      let y = (c * t) / d + b; //此方法为匀速
      return y;
    },
    async search(val, fromRadio, search) {
      if (search || fromRadio) {
        this.AllPv = 0;
        this.cacheAllPv = 0;
        this.nowPv = 0;
        this.cacheNowPv = 0;
      }
      search ? (this.loading.lineLoading = true) : "";
      fromRadio ? (this.loading.lineLoading = true) : "";
      this.radioNum = search ? 1 : this.radioNum;
      this.lastWeek.name = val == 1 ? "上周同期" : "昨日";
      this.seriesData.length = 0;
      this.lastWeek.data = new Array(24).fill("");
      this.nowDay.data = new Array(24).fill("");
      let { id, deviceType, scene, area, itemName } = this.queryInfor;
      scene = scene.join(",");
      deviceType = deviceType.join(",");
      let { data } = await getRealTimeTraffic({
        province: area[0] == "" ? null : area[0],
        city: area[1] == "" ? null : area[1],
        dtType: val,
        industry: scene == "" ? null : scene,
        mid: id == "" ? null : id,
        projectName: itemName == "" ? null : itemName,
        value: deviceType == "" ? null : deviceType,
      });
      this.cacheNowPv = this.nowPv; // 初始化缓存流量数据用于滚动更新
      this.cacheAllPv = this.AllPv;
      this.AllPv = 0; // 总人流量初始化
      // 1.存储最后一个数据 2.减少1长度
      this.nowPv =
        data.adsDataRealTime.length > 0
          ? data.adsDataRealTime.pop()
          : this.nowPv;
      this.nowPv = !this.nowPv ? 0 : this.nowPv.trafficSum;
      // 根据日期填充数据;
      data.alternativeTraffic.map((data) => {
        this.lastWeek.data[data.hr] = data.trafficSum;
      });
      data.adsDataRealTime.map((data) => {
        this.nowDay.data[data.hr] = data.trafficSum;
        // 总人流量填充数据1
        this.AllPv += data.trafficSum;
      });
      // 填充前一天00:00点数据
      this.lastWeek.data[0] =
        data.alternativeYesterdayHr.length == 0
          ? ""
          : data.alternativeYesterdayHr[0].trafficSum;
      this.nowDay.data[0] =
        data.yesterdayHr.length == 0 ? "" : data.yesterdayHr[0].trafficSum;
      // 当前时间人流量提示
      let dateH = new Date().getHours();
      let dateM = new Date().getMinutes();
      dateM = dateM < 10 ? `0${dateM}` : dateM;
      dateH = dateH == 23 ? 0 : dateH;
      this.currentTime = `${dateH}:00 至 ${dateH}:${dateM}`;
      // 总人流量填充数据2
      this.AllPv += this.nowPv;
      this.AllPv = !this.AllPv ? 0 : this.AllPv;
      if (this.AllPv == 0) {
        this.cacheAllPv = 0;
        this.cacheNowPv = 0;
        this.nowPv = 0;
      }
      if (this.cacheNowPv == 0) {
        if (this.nowPv > 1000) {
          this.cacheNowPv = this.nowPv - 1000;
        } else {
          this.cacheNowPv = this.nowPv;
        }
      }
      if (this.cacheAllPv == 0) {
        if (this.AllPv > 1000) {
          this.cacheAllPv = this.AllPv - 1000;
        } else {
          this.cacheAllPv = this.AllPv;
        }
      }
      // echarts渲染
      this.seriesData.push(this.lastWeek);
      this.seriesData.push(this.nowDay);
      // loading状态重置
      this.loading.lineLoading = false;
    },
  },
  created() {},
  mounted() {
    this.initData();
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
  margin-bottom: 400px;
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
  .content {
    // display: flex;
    margin-top: 10px;
    background: #fff;
    .real_data_num {
      // flex: 1;
      // display: flex;
      padding: 20px 30px 30px 30px;
      width: 100%;
      .content_title {
        font-size: 18px;
        padding: 0px 0px 25px 0px;
      }
      .card-panel-num {
        padding: 20px 0px;
        align-items: center;
        justify-content: center;
        font-size: 1.6vw;
        color: #1f5dea;
        font-family: "PingFangHK-Medium PingFangHK;", sans-serif;
      }
      .content_nav {
        display: flex;
        .content_nav_nowDay_PV {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          .content_nav_nowDay_PV_all_day {
            font-weight: 700;
          }
          .content_nav_nowDay_PV_now {
            font-weight: 700;
          }
        }
      }
    }
  }
}
</style>
