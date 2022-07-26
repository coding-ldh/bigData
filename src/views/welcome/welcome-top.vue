<template>
  <el-row :gutter="24" class="top" style="margin-bottom: 20px">
    <wel-card
      :md="8"
      :lg="8"
      :xl="8"
      title="广告数据"
      redirect="user-portrait/trafficPortrait"
    >
      <template #content>
        <el-skeleton animated :rows="4" :loading="loading">
          <div class="welcome_advert">
            <div class="yDay_traffic">
              <div class="title">昨日人流量(次)</div>
              <div class="count">{{ yDayTraffic }}</div>
              <div class="compare_yDay">
                <span>
                  较前日
                </span>
                <svg-icon
                  :icon-class="compareTraffic > 0 ? 'welcome4' : 'welcome5'"
                />
                <span> {{ compareTraffic }}% </span>
              </div>
            </div>
            <div class="yDay_exposure">
              <div class="title">昨日曝光量(次)</div>
              <div class="count">{{ yDayExposure }}</div>
              <div class="compare_yDay">
                <span>
                  较前日
                </span>
                <svg-icon
                  :icon-class="compareExposure > 0 ? 'welcome4' : 'welcome5'"
                />
                <span> {{ compareExposure }}% </span>
              </div>
            </div>
          </div>
        </el-skeleton>
      </template>
    </wel-card>
    <wel-card
      :md="12"
      :lg="12"
      :xl="12"
      title="实时人流量"
      redirect="user-portrait/liveData"
    >
      <template #content>
        <el-skeleton animated :rows="4" :loading="loading">
          <div style="display: flex;justify-content: space-between">
            <div
              class="welcome_flex welcome_live"
              style="justify-content: start"
            >
              <div class="live_traffic">
                <div class="title">实时人流量(次)</div>
                <div class="count" v-if="aliveTrafficStart">
                  <count-to
                    :start-val="aliveTrafficStart"
                    :end-val="aliveTrafficEnd"
                    :duration="duration"
                    :easingFn="easingFn"
                    class="card-panel-num"
                  />
                </div>
                <div class="compare_yDay">
                  <span>
                    较昨日
                  </span>
                  <svg-icon
                    :icon-class="
                      compareAliveTraffic > 0 ? 'welcome4' : 'welcome5'
                    "
                  />
                  <span> {{ compareAliveTraffic }}% </span>
                </div>
              </div>
            </div>
            <line-chart
              id="chart10"
              title="趋势图"
              :legendData="trendLegendData"
              :formatter="formatter"
              :series="trendChartYData"
              :trendXData="trendXData"
              :colorList="trendColorList"
              :height="trafficHeight"
              :grid="grid"
              :text="text"
              :tipFormatter="tipFormatter"
              :tipPadding="tipPadding"
              v-if="trendChartYData.length > 0"
            ></line-chart>
          </div>
        </el-skeleton>
      </template>
    </wel-card>
    <wel-card :md="4" :lg="4" :xl="4" title="测温数据" redirect="cw/cw">
      <template #content>
        <el-skeleton animated :rows="4" :loading="loading">
          <div class="welcome_flex">
            <div class="yDay_temperature">
              <div class="title">昨日测温量(次)</div>
              <div class="count">{{ yDayTemperature }}</div>
              <div class="compare_yDay">
                <span>
                  较前日
                </span>
                <svg-icon
                  :icon-class="compareTemperature > 0 ? 'welcome4' : 'welcome5'"
                />
                <span> {{ compareTemperature }}% </span>
              </div>
            </div>
          </div>
        </el-skeleton>
      </template>
    </wel-card>
  </el-row>
</template>

<script>
import LineChart from "./component/WelLineChart.vue";
import WelCard from "./component/WelCard.vue";
import {
  getAds,
  getAliveTraffic,
  getTemperature
} from "@/api/welcome/index.js";
import { getRealTimeTraffic } from "@/api/userPortrait/index.js";
import { splitNumber } from "@/utils";
import CountTo from "vue-count-to";
export default {
  components: {
    LineChart,
    CountTo,
    WelCard
  },
  props: ["loading"],
  data() {
    return {
      timer: null,
      trendXData: [],
      grid: {
        left: "2%",
        bottom: "0%",
        right: "1%",
        top: "30%",
        containLabel: true
      },
      text: "PV单位(千万)",
      tipPadding: [10, 15, 10, 15],
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
        "24:00"
      ],
      trafficHeight: 140,
      trendLegendData: ["今日数据", "上周同期"],
      trendColorList: ["#36CBCB", "#3BA0FF"],
      yDayTraffic: "",
      yDayExposure: "",
      yDayTemperature: "",
      compareTraffic: "",
      compareExposure: "",
      compareTemperature: "",
      aliveTraffic: "",
      compareAliveTraffic: "",
      duration: 60000,
      aliveTrafficStart: 0,
      aliveTrafficEnd: 0,
      trendChartYData: []
    };
  },
  created() {
    this.initData();
  },
  mounted() {
    if (this.timer) {
      window.clearInterval(this.timer);
    } else {
      this.timer = setInterval(async () => {
        await this.setAliveTraffic();
        if (this.aliveTraffic >= this.aliveTrafficEnd) {
          this.aliveTrafficStart = this.aliveTrafficEnd;
          this.aliveTrafficEnd = this.aliveTraffic;
        }
      }, this.duration);
    }
  },
  destroyed() {
    window.clearInterval(this.timer);
  },
  methods: {
    formatter(val) {
      if (val <= 1) {
        return val;
      } else if (val <= 10000) {
        return val;
      } else {
        return val / 10000000;
      }
    },
    async initData() {
      this.setAds();
      this.setTemperature();
      this.setChartData();
      await this.setAliveTraffic();
      if (this.aliveTraffic > 1000) {
        this.aliveTrafficStart = this.aliveTraffic - 1000;
        this.aliveTrafficEnd = this.aliveTraffic;
      }
    },
    async setAds() {
      const { data } = await getAds();
      const {
        personFlowYD,
        exposureYD,
        compareExposureBYRate,
        comparePersonFlowBYRate
      } = data;
      this.yDayTraffic = splitNumber(personFlowYD, 3);
      this.yDayExposure = splitNumber(exposureYD, 3);
      this.compareTraffic = comparePersonFlowBYRate;
      this.compareExposure = compareExposureBYRate;
    },
    async setAliveTraffic() {
      const { data } = await getAliveTraffic();
      const { personFlowReal, comparePersonFlowYDRate } = data;
      this.aliveTraffic = personFlowReal;
      this.compareAliveTraffic = comparePersonFlowYDRate;
    },
    async setTemperature() {
      const { data } = await getTemperature();
      const { compareYesterdayRate, temperatureCountYD } = data;
      this.yDayTemperature = splitNumber(temperatureCountYD, 3);
      this.compareTemperature = compareYesterdayRate;
    },
    async setChartData() {
      this.trendXData = this.lineChartsTimeData.map((item, index) => {
        if (index === 0) {
          return { value: item, textStyle: { align: "left" } };
        } else if (index + 1 === this.lineChartsTimeData.length) {
          return { value: item, textStyle: { align: "right" } };
        } else {
          return { value: item, textStyle: { align: "center" } };
        }
      });
      const { data } = await getRealTimeTraffic({ dtType: 1 });
      let aliveData = data.adsDataRealTime.map(({ trafficSum }) => trafficSum);
      if (aliveData.pop()) {
        aliveData = [data.yesterdayHr[0].trafficSum, ...aliveData];
      }
      let alternativeData = data.alternativeTraffic.map(
        ({ trafficSum }) => trafficSum
      );
      alternativeData = [
        data.alternativeYesterdayHr[0].trafficSum,
        ...alternativeData
      ];
      this.trendChartYData = [];
      this.trendChartYData.push({
        name: "今日数据",
        type: "line",
        data: aliveData,
        smooth: true,
        areaStyle: {
          color: {
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            type: "linear",
            global: false,
            colorStops: [
              {
                offset: 0,
                color: "rgba(106,222,172,0.8)"
              },
              {
                offset: 1,
                color: "rgba(106,222,172,0.1)"
              }
            ]
          }
        }
      });
      this.trendChartYData.push({
        name: "上周同期",
        type: "line",
        data: alternativeData,
        smooth: true
      });
    },
    easingFn(t, b, c, d) {
      let y = (c * t) / d + b; //此方法为匀速
      return y;
    },
    tipFormatter(params) {
      let str =
        '<span style="font-weight: 300;display: block;">' +
        params[0].axisValue +
        "</span>";
      params.forEach(item => {
        str +=
          '<div style="display: flex;align-items: center;"><span style="display:inline-block;margin-right:10px;border-radius:50%;width:10px;height:10px;left:5px;background-color:' +
          item.color +
          '"></span>' +
          '<span style="font-weight: 300;margin-right: 5px;">' +
          item.seriesName +
          "</span>" +
          '<pan style="font-weight: 500;display: flex;">' +
          item.data +
          "</pan></div>";
      });
      return str;
    }
  }
};
</script>

<style lang="scss" scoped>
.top {
  height: 240px;
}
</style>
