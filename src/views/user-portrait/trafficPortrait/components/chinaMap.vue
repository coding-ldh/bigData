<template>
  <ul class="chart_container">
    <li class="first">
      <div class="title">地域设备分布</div>
      <div id="china_map"></div>
    </li>
    <top-10
      :tableData="rankList"
      :propLableArr="top10PropLable"
      title="城市设备量排名"
    ></top-10>
  </ul>
</template>

<script>
import Top10 from "@/components/Top10";
import echarts from "echarts";
import "echarts/map/js/china.js";
import { getNewDeviceOfCity, getNewDeviceOfProvince } from "@/api/userPortrait";

export default {
  components: { Top10 },
  data() {
    return {
      options: {
        tooltip: {
          trigger: "item",
          padding: 8,
          borderWidth: 1,
          borderColor: "#409eff",
          backgroundColor: "rgba(255,255,255,0.7)",
          textStyle: {
            color: "#000000",
            fontSize: 13,
          },
          formatter: (params) => {
            if (isNaN(params.value)) {
              params.value = 0;
            }
            var res = `${params.name}: ${params.value}`;
            return res;
          },
        },
        visualMap: {
          show: true,
          showLabel: true,
          min: 0,
          max: 100,
          left: 20,
          text: ["高", "低"], // 文本，默认为数值文本
          inRange: {
            color: ["#4cc9f0", "#4361ee", "#480ca8", "#b5179e", "#f72585"],
          },
        },
        geo: {
          map: "china",
          center: [110, 25],
          zoom: 1,
          top: 120,
          itemStyle: {
            normal: {
              borderColor: "rgba(0, 0, 0, 0.2)",
            },
            emphasis: {
              shadowOffsetX: 0,
              shadowOffsetY: 0,
              borderWidth: 0,
            },
          },
        },
        series: [
          {
            type: "map",
            geoIndex: 0,
            data: [],
          },
        ],
      },
      rankList: [],
      top10PropLable: [
        { label: "城市名", prop: "name" },
        { label: "设备数", prop: "value" },
      ],
      timer: null,
      Chart: null,
    };
  },
  methods: {
    init() {
      this.getDeviceOfProvince();
      this.getDeviceOfCity();
    },
    async getDeviceOfProvince() {
      const { data } = await getNewDeviceOfProvince();
      let max, min;
      data.forEach((item) => {
        !max || max < item.value ? (max = item.value) : "";
        !min || min > item.value ? (min = item.value) : "";
      });
      this.options.series[0].data = data;
      this.options.visualMap.max = max;
      this.options.visualMap.min = min;
      this.initEchartMap();
    },
    initEchartMap() {
      let mapDiv = document.getElementById("china_map");
      let myChart = echarts.init(mapDiv);
      myChart.setOption(this.options);
      this.Chart = myChart;
      window.addEventListener("resize", this.resizeChart);
    },
    async getDeviceOfCity() {
      const { data } = await getNewDeviceOfCity();
      this.rankList = data.splice(0, 10);
    },
    resizeChart() {
      this.timer ? clearTimeout(this.timer) : "";
      this.timer = setTimeout(() => {
        this.Chart.resize();
      }, 500);
    },
  },
  mounted() {
    // this.init();
  },
  destroyed() {
    // 离开页面清除监听
    window.removeEventListener("resize", this.resizeChart);
  },
};
</script>
<style lang="scss" scoped>
#china_map {
  height: 400px;
  margin-top: 30px;
}
.chart_container {
  display: flex;
  li {
    flex: 1;
    background-color: #fff;
    margin-top: 10px;
    .title {
      color: #333333;
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 21px;
      padding-left: 30px;
      padding-top: 20px;
    }
  }
  li.first {
    margin-right: 11px;
  }
}
</style>