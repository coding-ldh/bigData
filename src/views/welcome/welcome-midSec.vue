<template>
  <el-row :gutter="24" class="bottom" style="margin-bottom: 20px">
    <wel-card
      :md="8"
      :lg="8"
      :xl="8"
      title="设备数据"
      redirect="equipment/onlineTime"
    >
      <template #content>
        <el-skeleton animated :rows="12" :loading="loading">
          <div class="welcome_device">
            <div class="device_item">
              <div class="device_info welcome_flex">
                <div class="device_icon">
                  <svg-icon icon-class="welcome1" />
                </div>
                <div class="info">
                  <div class="title">昨日累计激活设备量</div>
                  <div class="unit">单位：台</div>
                </div>
              </div>
              <div class="count">{{ deviceData.activeDeviceCountYD }}</div>
            </div>
            <div class="device_item">
              <div class="device_info welcome_flex">
                <div class="device_icon">
                  <svg-icon icon-class="welcome2" />
                </div>
                <div class="info">
                  <div class="title">昨日在线设备量</div>
                  <div class="unit">单位：台</div>
                </div>
              </div>
              <div class="count">{{ deviceData.onlineDeviceCountYD }}</div>
            </div>
            <div class="device_item">
              <div class="device_info welcome_flex">
                <div class="device_icon">
                  <svg-icon icon-class="welcome3" />
                </div>
                <div class="info">
                  <div class="title">昨日台均在线时长</div>
                  <div class="unit">单位：小时</div>
                </div>
              </div>
              <div class="count">{{ deviceData.onlineTimeAvgDeviceYD }}</div>
            </div>
          </div>
        </el-skeleton>
      </template>
    </wel-card>
    <wel-card
      :md="16"
      :lg="16"
      :xl="16"
      title="设备量趋势图"
      redirect="equipment/onlineTime"
    >
      <template #content>
        <el-skeleton animated :rows="12" :loading="loading">
          <line-chart
            id="chart30"
            title="趋势图"
            :legendData="trendLegendData"
            :series="trendChartYData"
            :trendXData="trendXData"
            :colorList="trendColorList"
            :height="deviceHeight"
            :grid="grid"
            :text="text"
            :tipFormatter="tipFormatter"
            :min="min"
            v-if="trendChartYData.length > 0"
          ></line-chart>
        </el-skeleton>
      </template>
    </wel-card>
  </el-row>
</template>

<script>
import LineChart from "./component/WelLineChart.vue";
import { getDevice, getDeviceTrend } from "@/api/welcome/index.js";
import WelCard from "./component/WelCard.vue";
export default {
  components: {
    LineChart,
    WelCard
  },
  props: ["loading"],
  data() {
    return {
      min: 30000,
      grid: {
        left: "1%",
        bottom: "0%",
        right: "1%",
        top: "20%",
        containLabel: true // 距离包含坐标轴上的文字
      },
      text: "单位：台",
      deviceHeight: 400,
      trendLegendData: ["激活设备量", "在线设备量"],
      trendColorList: ["#36CBCB", "#3BA0FF"],
      trendChartYData: [],
      trendXData: [],
      deviceData: {}
    };
  },
  created() {
    this.initData();
  },
  methods: {
    async initData() {
      this.setDeviceData();
      this.setDeviceTrend();
    },
    async setDeviceData() {
      const { data } = await getDevice();
      const {
        activeDeviceCountYD,
        onlineDeviceCountYD,
        onlineTimeAvgDeviceYD
      } = data;
      this.deviceData = {
        activeDeviceCountYD,
        onlineDeviceCountYD,
        onlineTimeAvgDeviceYD
      };
    },
    async setDeviceTrend() {
      const { data } = await getDeviceTrend();
      this.trendXData = data.date.map((item, index) => {
        if (index === 0) {
          return { value: item, textStyle: { align: "left" } };
        } else if (index + 1 === data.date.length) {
          return { value: item, textStyle: { align: "right" } };
        } else {
          return { value: item, textStyle: { align: "center" } };
        }
      });
      this.trendChartYData.push({
        name: "激活设备量",
        type: "line",
        data: data.data.dailyAliveArr,
        smooth: true,
        lineStyle: {
          color: {
            colorStops: [
              {
                offset: 0,
                color: "#fff"
              },
              {
                offset: 0.5,
                color: "#52CCA3"
              },
              {
                offset: 1,
                color: "#52CCA3"
              }
            ]
          }
        }
      });
      this.trendChartYData.push({
        name: "在线设备量",
        type: "line",
        data: data.data.dailyOnlineArr,
        smooth: true,
        lineStyle: {
          color: {
            colorStops: [
              {
                offset: 0,
                color: "#fff"
              },
              {
                offset: 0.5,
                color: "#6699FF"
              },
              {
                offset: 1,
                color: "#1890FF"
              }
            ]
          }
        }
      });
    },
    tipFormatter(params) {
      let str =
        '<span style="font-weight: 300;margin-bottom: 16px;display: block;">' +
        params[0].axisValue +
        "</span>";
      params.forEach(item => {
        str +=
          '<div style="display: flex;align-items: center;margin-bottom:16px"><span style="display:inline-block;margin-right:10px;border-radius:50%;width:10px;height:10px;left:5px;background-color:' +
          item.color +
          '"></span>' +
          '<span style="font-weight: 300;margin-right: 32px;">' +
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
.bottom {
  height: 500px;
}
</style>
