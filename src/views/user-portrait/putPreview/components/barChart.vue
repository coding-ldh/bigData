<template>
  <div class="myChart_container">
    <div class="titles">{{ title }}</div>
    <div :style="{ width: '100%', height: '370px' }" :id="id"></div>
  </div>
</template>

<script>
import echarts from "echarts";
export default {
  props: {
    id: String,
    title: String,
    series: Array,
    colorList: {
      type: Array,
      default: () => ["#3BA0FF", "#F2637B"],
    },
    legend: { type: Array, default: [] },
    xData: { type: Array, default: [] },
    left: { type: String, default: "0%" },
    right: { type: String, default: "0%" },
  },
  data() {
    return {
      // timer: null,
      myChart: null,
      option: {
        color: this.colorList,
        legend: {
          icon: "circle",
          itemHeight: 6,
          itemWidth: 6,
          itemGap: 25,
          textStyle: {
            fontSize: 12,
            color: "#666666",
            padding: [0, 0, -2, 0],
          },
          right: 0,
          data: this.legend,
        },
        grid: {
          left: this.left,
          right: this.right,
          bottom: "0%",
          containLabel: true,
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
          },
          textStyle: {
            color: "#fff",
          },
          backgroundColor: "rgba(33, 41, 71, 0.9)",
          padding: [15, 25, 15, 25],
          confine: true,
          formatter: (params) => {
            let reVal = `<div style="margin-bottom:10px;">${params[0].name}</div>`;
            let str = '<span style=" border:2px solid #fff ;';
            for (let i = 0; i < params.length; i++) {
              reVal += `<div style="display:flex; padding:5px 0;  justify-content: space-between;">
                          <div style="color:#9599A7;">
                            ${str + params[i].marker.slice(13, 999)}
                            ${params[i].seriesName}(台)
                          </div>
                          <div style="padding-left:15px;font-weight:600;">
                            ${params[i].value}
                          </div>
                        </div>`;
            }
            return reVal;
          },
        },
        xAxis: {
          type: "category",
          axisLine: {
            lineStyle: {
              color: "#EDEDED",
            },
          },
          axisLabel: {
            show: true,
            interval: 0,
            textStyle: { fontSize: 13, color: "#999" },
          },
        },
        yAxis: {
          type: "value",
          axisLine: {
            show: false,
            lineStyle: {
              color: "#999",
            },
          },
          axisTick: { show: false },
          axisLabel: {
            show: true,
            interval: "auto",
            formatter: "{value}",
          },
          splitLine: {
            lineStyle: {
              color: ["#F2F2F2"],
              width: 1,
              type: "dashed",
            },
          },
        },
        series: [],
      },
    };
  },
  watch: {
    series: {
      immediate: true,
      handler: function (val) {
        this.$nextTick(() => {
          this.drawChart();
        });
      },
    },
  },
  methods: {
    drawChart() {
      this.option.series = this.series;
      this.option.xAxis.data = this.xData;
      this.myChart = echarts.init(document.getElementById(this.id));
      this.myChart.setOption(this.option);
    },
    resizeChart() {
      this.timer ? clearTimeout(this.timer) : "";
      this.timer = setTimeout(() => {
        this.$nextTick((_) => {
          this.myChart.resize();
        });
      }, 500);
    },
  },
  mounted() {
    this.myChart = echarts.init(document.getElementById(this.id));
    window.addEventListener("resize", this.resizeChart);
  },
  destroyed() {
    // 离开页面清除监听
    window.removeEventListener("resize", this.resizeChart);
  },
};
</script>

<style lang="scss" scoped>
.myChart_container {
  width: 100%;
  padding-top: 20px;
  position: relative;
  .titles {
    position: absolute;
  }
}
</style>
