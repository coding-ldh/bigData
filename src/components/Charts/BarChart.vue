<template>
  <div class="myChart_container">
    <div class="title_time_container">
      <div class="title">{{ title }}</div>
      <slot></slot>
      <div v-if="timeTip != ''">{{ timeTip }}</div>
    </div>
    <div :style="{ width: '100%', height: '350px' }" :id="id"></div>
  </div>
</template>

<script>
import echarts from "echarts";
import resize from "./mixins/resize";
import { param } from "@/utils";
export default {
  mixins: [resize],
  props: {
    id: String,
    title: String,
    series: Array,
    xData: Array,
    yUnit: {
      type: String,
      default: "",
    },
    timeTip: {
      type: String,
      default: "",
    },
    colorList: {
      type: Array,
      default: () => ["#3BA0FF", "#F2637B"],
    },
    legend: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      timer: null,
      myChart: null,
      option: {
        color: this.colorList,
        legend: {
          data: this.legend,
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
          },
        },
        grid: {
          left: "0",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            axisTick: {
              show: false,
            },
            axisLine: {
              show: false,
            },
            data: this.xData,
          },
        ],
        yAxis: [
          {
            type: "value",
            axisTick: {
              show: false,
            },
            axisLine: {
              show: false,
            },
            splitLine: {
              //网格线
              lineStyle: {
                color: ["#F9F9F9"],
                width: 1,
                type: "solid",
              },
            },
            axisLabel: {
              show: true,
              interval: "auto",
              formatter: "{value} %",
              show: true,
            },
          },
        ],
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
      this.option.yAxis[0].axisLabel.formatter = `{value}${this.yUnit}`;
      this.option.xAxis[0].data = this.xData;
      this.option.series = this.series;
      this.option.legend.data = this.legend;
      let myChart = echarts.init(document.getElementById(this.id));
      // 为鼠标悬停展示 制作单位
      this.option.tooltip.formatter = (params) => {
        if (this.yUnit != "") {
          let relVal = params[0].name;
          for (let i = 0; i < params.length; i++) {
            relVal +=
              "<br/>" +
              params[i].marker +
              params[i].seriesName +
              ":" +
              params[i].value +
              this.yUnit;
          }
          return relVal;
        } else {
          let relVal = params[0].name;
          for (let i = 0; i < params.length; i++) {
            relVal +=
              "<br/>" +
              params[i].marker +
              params[i].seriesName +
              ":" +
              params[i].value;
          }
          return relVal;
        }
      };
      // 绘制图表
      myChart.setOption(this.option);
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
  padding-left: 30px;
  .title_time_container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-right: 30px;
    .title {
      font-size: 16px;
      color: #333;
      font-weight: bold;
    }
  }
  .chart {
    margin-top: 60px;
  }
}
</style>
