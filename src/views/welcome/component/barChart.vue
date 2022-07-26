<template>
  <div class="myChart_container">
    <div :style="{ width: '100%', height: '370px' }" :id="id"></div>
  </div>
</template>

<script>
import echarts from "echarts";
export default {
  props: {
    id: String,
    series: Array,
    colorList: {
      type: Array,
      default: () => ["#3BA0FF", "#F2637B"],
    },
    legend: {
      type: Array,
      default: [],
    },
    xData: {
      type: Array,
      default: [],
    },
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
          left: "0",
          right: "0%",
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
            let string = '<span style="border:2px solid #fff ;';
            return `
              <div>${params[0].axisValue}<div>
              <div style="padding:4px 0 15px 0;">
                ${string + params[0].marker.slice(13, 999)}
                <span style="color:#AFB2BD">
                 ${params[0].seriesName}
                </span>
                &nbsp;&nbsp;${params[0].data}
              </div>
              <div>
                ${string + params[1].marker.slice(13, 999)}
                <span style="color:#AFB2BD">
                  ${params[1].seriesName}
                </span>
                &nbsp;&nbsp;${params[1].data}
              </div>
              `;
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
            textStyle: { fontSize: 13, color: "#999" },
          },
          data: this.xData,
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
}
</style>
