<template>
  <div class="container">
    <!-- <div class="map com-container"><China /></div> -->
    <div class="board_main">
      <div class="board_header">灵机云屏 · 广告平台</div>
      <div class="map">
        <China id="map1" :handleMapData="handleMap" />
      </div>
      <div class="board_content">
        <div class="board_left el-row">
          <div class="el-col el-col-24">
            <div class="top_box box">
              <div class="board_title">广告利用率</div>
              <div class="el-row com-container">
                <div class="el-col el-col-12">
                  <circle-chart
                    id="chart2"
                    :chartData="deviceChartData"
                    v-if="deviceChartData.length != 0"
                    :colors="deviceColors"
                    title="设备利用率"
                  ></circle-chart>
                </div>
                <div class="el-col el-col-12">
                  <circle-chart
                    id="chart15"
                    :chartData="adsChartData"
                    v-if="adsChartData.length != 0"
                    :colors="adsColors"
                    title="广告位利用率"
                  ></circle-chart>
                </div>
              </div>
            </div>
            <div class="traffic_box box">
              <div class="board_title">广告曝光数据分析</div>
              <div class="el-row d-flex com-container">
                <div class="el-col el-col-12 com-container">
                  <circle-chart
                    id="chart6"
                    :chartData="peopleChartData"
                    v-if="peopleChartData.length != 0"
                    :colors="peopleColors"
                    title="男女比例占比"
                  ></circle-chart>
                </div>
                <div class="el-col el-col-12 com-container">
                  <bar-graph
                    id="chart33"
                    :showPercent="false"
                    :series="ageDataY"
                    :colorList="ageColorList"
                    :xData="ageDataX"
                    v-if="sceneDeviceDataY.length > 0"
                  >
                  </bar-graph>
                </div>
              </div>
            </div>
            <div class="scence_box box">
              <div class="board_title">场景投放</div>
              <div class="el-row com-container">
                <bar-chart
                  id="chart9"
                  :showPercent="false"
                  :series="sceneDeviceDataY"
                  :colorList="sceneDeviceColorList"
                  :xData="sceneDeviceDataX"
                  :legend="sceneLegendData"
                  v-if="sceneDeviceDataY.length > 0"
                >
                </bar-chart>
              </div>
            </div>
          </div>
        </div>
        <div class="board_center">
          <div class="data_info el-row d-flex">
            <div class="device_adv_count box d-flex">
              <span class="icon">
                <svg-icon icon-class="ad" />
              </span>
              <div class="content">
                <div class="count">
                  <span>{{ alreadyMidCountsDay }}</span
                  >台
                </div>
                <div class="device_type">已投广告设备量<br />(门岗和乐乐)</div>
              </div>
            </div>
            <div class="device_all box d-flex">
              <span class="icon">
                <svg-icon icon-class="device" />
              </span>
              <div class="content">
                <div class="count">
                  <span>{{ allMidCountsDay }}</span
                  >台
                </div>
                <div class="device_type">设备总量<br />(门岗和乐乐)</div>
              </div>
            </div>
            <div class="traffic_num box d-flex">
              <span class="icon">
                <svg-icon icon-class="traffic" />
              </span>
              <div class="content">
                <div class="count">
                  <span>{{ Math.floor(trafficCount / 10000) }}</span
                  >万次
                </div>
                <div class="device_type">昨日人流量</div>
              </div>
            </div>
          </div>
          <div class="box_flex"></div>
          <div class="adv_trend box">
            <!-- <div class="board_title">设备广告投放趋势图</div> -->

            <line-chart
              id="chart22"
              title="趋势图"
              :legendData="trendLegendData"
              :series="trendChartYData"
              :trendXData="trendXData"
              :colorList="trendColorList"
              v-if="trendChartYData.length > 0"
            >
            </line-chart>
          </div>
        </div>
        <div class="board_right box">
          <div class="board_title">城市设备投放情况</div>
          <div class="serving_top10">
            <ul class="top10_list">
              <li
                v-for="(item, index) in top10_list"
                :key="index"
                class="d-flex top10_item"
                :class="{
                  top10_item0: index === 0,
                  top10_item1: index === 1,
                  top10_item2: index === 2
                }"
              >
                <div class="city_name">
                  <span>{{ index + 1 }}</span
                  >{{ item.projectCity }}
                </div>
                <div class="throw_info">
                  <div class="already_throw_count">
                    总量：<span>{{ item.allMidCounts }}台</span>
                  </div>
                  <div class="avalid_throw_count">
                    已投：<span>{{ item.alreadyMidCounts }}台</span>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CircleChart from "./components/circleChart.vue";
import BarChart from "./components/barChart.vue";
import LineChart from "./components/lineChart.vue";
import China from "@/components/ReChina";
import BarGraph from "./components/barGraph.vue";
import { getOverviewRate, getSceneRate, getCityRate, getMapInfo } from "@/api/kanbang";
export default {
  components: {
    CircleChart,
    BarChart,
    China,
    LineChart,
    BarGraph
  },
  data() {
    return {
      timer: null,
      handleMap: getMapInfo,
      deviceChartData: [],
      adsChartData: [],
      peopleChartData: [],
      deviceColors: ["#2FDD91", "#3361ED"],
      adsColors: ["#FFEC7B", "#682FEA"],
      peopleColors: ["#107CFC", "#FF625F"],
      sceneDeviceDataX: ["购物", "办公场所", "酒店住宿", "写字楼物业", "购物"],
      sceneDeviceDataY: [],
      sceneDeviceColorList: ["#6ADEAC", "#3361ED"],
      ageColorList: ["rgba(255,255,255,0.20)"],
      sceneLegendData: ["已投放设备量(门岗和乐乐)", "设备总量(门岗和乐乐)"],
      trendChartYData: [],
      trendLegendData: ["已投放设备量(门岗和乐乐)", "设备总量(门岗和乐乐)"],
      trendXData: [],
      trendColorList: ["#3BA0FF", "#36CBCB"],
      ageDataX: ["0-18岁", "18-34岁", "35-54岁", "55岁以上"],
      ageDataY: [],
      availableMidCount: "",
      allMidCountsDay: "",
      alreadyMidCountsDay: "",
      trafficCount: "",
      top10_list: []
    };
  },
  created() {
    this.getOverviewRateData();
    this.getSceneRateData();
    this.getCityRateData();
  },
  mounted() {
    // const appMain = document.querySelector(".app-main");
    // this.$nextTick(() => {
    //   appMain.style.padding = 0;
    // });
    if (this.timer) {
      window.clearInterval(this.timer);
    } else {
      this.timer = setInterval(() => {
        this.getOverviewRateData();
        this.getSceneRateData();
        this.getCityRateData();
      }, 1000 * 60 * 60);
    }
  },
  methods: {
    async getOverviewRateData() {
      const { data } = await getOverviewRate();
      const {
        allMidCountsDay,
        alreadyMidCountsDay,
        availableMidCountsDay,
        alreadyAdsRate,
        trafficCountsDay,
        allPeopleCounts,
        maleRate,
        femaleRate,
        to18Rate,
        to35Rate,
        alreadyMidRate,
        to55Rate,
        to100Rate
      } = data.yesterdayData;
      this.availableMidCountsDay = availableMidCountsDay;
      this.alreadyMidCountsDay = alreadyMidCountsDay;
      this.allMidCountsDay = allMidCountsDay;
      this.trafficCount = trafficCountsDay;
      this.deviceChartData = [];
      this.deviceChartData.push({
        name: "已投放设备",
        value: alreadyMidRate
      });
      this.deviceChartData.push({
        name: "未投放设备",
        value: 100 - alreadyMidRate
      });
      this.adsChartData = [];
      this.adsChartData.push({
        name: "已投放广告位",
        value: alreadyAdsRate
      });
      this.adsChartData.push({
        name: "未投放广告位",
        value: 100 - alreadyAdsRate
      });
      const maleValue = allPeopleCounts * maleRate,
        femaleValue = allPeopleCounts * femaleRate;
      this.peopleChartData = [];
      this.peopleChartData.push({
        name: "男性",
        value: maleValue
      });
      this.peopleChartData.push({
        name: "女性",
        value: femaleValue
      });
      const weekData = data.weekData.sort((a, b) => {
        return (new Date(a.dt) - new Date(b.dt))
      });
      this.trendXData = weekData.map(item => item.dt);
      const allMidCountsArr = weekData.map(item => item.allMidCountsDay);
      const alreadyMidCountsArr = weekData.map(
        item => item.alreadyMidCountsDay
      );
      this.trendChartYData = [];
      this.trendChartYData.push({
        name: "设备总量(门岗和乐乐)",
        type: "line",
        data: allMidCountsArr,
        areaStyle: {
          color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: "rgba(51,97,237,0.8)"
            },
            {
              offset: 1,
              color: "rgba(51,97,237,0.1)"
            }
          ])
        }
      });
      this.trendChartYData.push({
        name: "已投放设备量(门岗和乐乐)",
        type: "line",
        data: alreadyMidCountsArr,
        areaStyle: {
          color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: "rgba(106,222,172,0.8)"
            },
            {
              offset: 1,
              color: "rgba(106,222,172,0.1)"
            }
          ])
        }
      });
      const ageData = [to18Rate, to35Rate, to55Rate, to100Rate];
      this.ageDataY = [];
      this.ageDataY.push({
        name: "年龄分布",
        type: "bar",
        barWidth: 25,
        data: ageData,
        showBackground: true,
        backgroundStyle: {
          color: "rgba(255,255,255,0.08)",
          borderRadius: [0, 15, 15, 0]
        },
        itemStyle: {
          normal: {
            barBorderRadius: [0, 15, 15, 0],
            label: {
              show: true, //开启显示
              position: "right", //在上方显示
              textStyle: {
                //数值样式
                color: "rgba(255,255,255,0.90)",
                fontSize: 12
              },
              formatter: "{c}%"
            }
          }
        }
      });
    },
    async getSceneRateData() {
      const { data } = await getSceneRate();
      this.sceneDeviceDataX = data.map(item => item.projectIndustry);
      const alreadyMidCountsArr = data.map(item => item.alreadyMidCounts);
      const allMidCountsArr = data.map(item => item.allMidCounts);
      this.sceneDeviceDataY = [];
      this.sceneDeviceDataY.push({
        barGap: 0,
        barWidth: 10,
        data: alreadyMidCountsArr,
        name: "已投放设备量(门岗和乐乐)",
        type: "bar",
        itemStyle: {
          normal: {
            barBorderRadius: [10, 10, 0, 0]
          }
        }
      });
      this.sceneDeviceDataY.push({
        barGap: "20%",
        barWidth: 10,
        data: allMidCountsArr,
        name: "设备总量(门岗和乐乐)",
        type: "bar",
        itemStyle: {
          normal: {
            barBorderRadius: [10, 10, 0, 0]
          }
        }
      });
    },
    async getCityRateData() {
      const { data } = await getCityRate();
      this.top10_list = data;
    }
  },
  destroyed() {
    window.clearInterval(this.timer);
  }
};
</script>

<style lang="scss" scoped>
.container {
  ::-webkit-scrollbar {
    display: none;
  }
  font-family: "Source Han Sans CN", sans-serif;
  position: relative;
  width: 100%;
  background-image: url("../../assets/images/bg.png");
  .board_main {
    position: relative;
    overflow: auto;
    height: 1080px;
  }
  .d-flex {
    display: flex;
    align-items: center;
  }
  .map {
    width: 100%;
    height: calc(1080px - 94px);
  }
  .com-page {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  .board_title {
    font-size: 24px;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.68);
  }
  .board_header {
    background: url("../../assets/images/boardHeader.png");
    background-size: 100% 100%;
    width: 100%;
    text-align: center;
    font-size: 32px;
    padding: 28px 0;
    font-weight: 500;
    margin-bottom: 18px;
    color: rgba(255, 255, 255, 0.68);
  }
  .board_content {
    position: absolute;
    top: 110px;
    width: 100%;
    display: flex;
    justify-content: space-around;
    .board_left {
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .top_box,
      .traffic_box,
      .scence_box {
        width: 100%;
      }
    }
  }
  .board_left,
  .board_right {
    width: 25%;
  }
  .board_right {
    display: flex;
    flex-direction: column;
  }
  .board_center {
    flex-direction: column;
    display: flex;
    justify-content: space-between;
    width: 46%;
    .data_info {
      margin-right: -16px;
      > div {
        margin-right: 16px;
        margin-bottom: 0;
        flex: 1;
      }
    }
  }
  .board_right {
    .top10_item,
    .top10_item0,
    .top10_item1,
    .top10_item2 {
      display: flex;
      margin: 0 20px;
      padding: 0 24px;
      height: 10%;
      background: rgba(255, 255, 255, 0.03);
      justify-content: space-between;
      border-radius: 16px;
    }
    .top10_item0,
    .top10_item1,
    .top10_item2 {
      .throw_info {
        .already_throw_count {
          > span {
            color: #5781ff;
          }
        }
        .avalid_throw_count {
          > span {
            color: #6bdeac;
          }
        }
      }
    }
    .top10_item0 {
      margin: 0;
      background: rgba(255, 255, 255, 0.12);
    }
    .top10_item1 {
      background: rgba(255, 255, 255, 0.09);
      margin: 0 10px;
    }
    .top10_item2 {
      background: rgba(255, 255, 255, 0.06);
    }
    .board_title {
      margin-bottom: 48px;
    }
    .serving_top10 {
      height: 100%;
    }
    .top10_list {
      height: 100%;
      .city_name {
        color: rgba(255, 255, 255, 0.68);
        font-size: 24px;
        > span {
          color: rgba(255, 255, 255, 0.22);
          margin-right: 33px;
        }
      }
      .already_throw_count,
      .avalid_throw_count {
        font-size: 16px;
        color: rgba(255, 255, 255, 0.24);
        > span {
          color: rgba(255, 255, 255, 0.68);
        }
      }
    }
  }
  .icon {
    margin-right: 12px;
    > svg {
      height: 62px;
      width: 62px;
    }
  }
  .content {
    font-size: 12px;
    font-weight: 400;
    color: rgba(255, 255, 255, 0.46);
    .count {
      color: rgba(255, 255, 255, 0.9);
      > span {
        font-size: 26px;
      }
      margin-bottom: 8px;
    }
  }
  .box {
    background: rgba(255, 255, 255, 0.03);
    opacity: 0.9;
    box-shadow: inset 0px 0px 30px 0px rgba(255, 255, 255, 0.04);
    border-radius: 18px;
    border: 2px solid rgba(255, 255, 255, 0.07);
    padding: 24px 24px 16px;
    margin-bottom: 18px;
  }
}
</style>
