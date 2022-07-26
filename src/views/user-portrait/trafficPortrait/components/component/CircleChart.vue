<template>
  <div class="myChart_container">
    <div class="title_time_container">
      <div class="title">{{ title }}</div>
      <div>{{ timeTip }}<slot></slot></div>
    </div>
    <div
      :style="{ width: '96%', height: '280px' }"
      :id="id"
      class="chart"
    ></div>
  </div>
</template>

<script>
import echarts from "echarts";
// import { param } from "@/utils";
export default {
  props: {
    id: String,
    title: String,
    chartData: Array,
    colors: Array,
    timeTip: {
      type: String,
      default: "",
    },
    right: { type: String, default: "10%" },
    Unit: {
      type: String,
      default: "false",
    },
  },
  data() {
    return {
      timer: null,
      myChart: null,
      option: {
        tooltip: {
          trigger: "item",
        },
        color: this.colors,
        legend: {
          // top: "10%",
          right: this.right,
          orient: "vertical",
          icon: "circle",
          itemGap: 14,
          formatter: (name) => {
            let nameStr;
            let percent;
            let value;
            let total = 0;
            let index = 0;
            let AddRate = [];
            let trafficCounts = 0;
            for (let i = 0; i < this.chartData.length; i++) {
              total += parseInt(this.chartData[i].value);
              if (this.chartData[i].name == name) {
                nameStr = name;
                value = this.chartData[i].value;
                trafficCounts = this.chartData[i].trafficCounts;
              }
            }
            // 0数据直接返回
            if (total == 0) {
              return `${nameStr}  | ${0}%`;
            }
            // 大于一个数据对第二个进行填充100%操作
            if (this.chartData.length >= 2) {
              index = this.chartData.length - 1;
              if (this.chartData[index].name == nameStr) {
                for (let i = 0; i < this.chartData.length - 1; i++) {
                  AddRate[i] =
                    Math.round((this.chartData[i].value / total) * 1000) / 10;
                }
                percent = AddRate.reduce((a, b) => {
                  return a + b;
                });
                return `${nameStr}  | ${value}台(${
                  Math.round((100 - percent) * 10) / 10
                }%) | ${trafficCounts}人次`;
              } else {
                percent =
                  total == 0 ? 0 : Math.round((value / total) * 1000) / 10;
                return `${nameStr}  | ${value}台(${percent}%) | ${trafficCounts}人次`;
              }
            } else {
              //  一个数据直接展示
              percent =
                total == 0 ? 0 : Math.round((value / total) * 1000) / 10;
              return `${nameStr}  | ${value}台(${percent}%) | ${trafficCounts}人次`;
            }
          },
        },
        series: [
          {
            type: "pie",
            radius: ["100%", "70%"],
            center: ["26%", "50%"],
            itemStyle: {
              borderRadius: 10,
              borderColor: "#fff",
              borderWidth: 2,
            },
            label: {
              show: false,
              position: "center",
            },
            labelLine: {
              show: true,
            },
            data: [],
          },
        ],
      },
    };
  },
  watch: {
    chartData: {
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
      // 绘制图表
      let width = document.getElementById(this.id).offsetWidth;
      let myChart = echarts.init(document.getElementById(this.id));
      this.option.tooltip.formatter = (params) => {
        let total = 0;
        for (let i = 0; i < this.chartData.length; i++) {
          total += parseInt(this.chartData[i].value);
        }
        let relVal = "";
        relVal +=
          `${params.marker}${params.data.name}: ${params.data.value}台` +
          `<span style="color:#f3a348">( ${
            Math.round((params.data.value / total) * 1000) / 10
          }% )</span>，${params.data.trafficCounts}人次`;
        return relVal;
      };
      if (width < 575) {
        this.option.series[0].data = this.chartData;
        this.option.legend.right = "0%";
        this.option.series[0].radius = ["50%", "70%"];
        myChart.setOption(this.option);
      } else {
        this.option.series[0].data = this.chartData;
        myChart.setOption(this.option);
      }
    },
    resizeChart() {
      this.timer ? clearTimeout(this.timer) : "";
      this.timer = setTimeout(() => {
        this.$nextTick((_) => {
          let width = document.getElementById(this.id).offsetWidth;
          // console.log(width);
          if (width < 575) {
            this.option.legend.right = "0%";
            this.option.series[0].radius = ["50%", "70%"];
            let myChart = echarts.init(document.getElementById(this.id));
            myChart.setOption(this.option);
          } else {
            this.option.legend.right = "10%";
            this.option.series[0].radius = ["100%", "70%"];
            let myChart = echarts.init(document.getElementById(this.id));
            myChart.setOption(this.option);
          }
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
  }
  .title {
    height: 40px;
    line-height: 40px;
    font-size: 16px;
    color: #333;
    font-weight: bold;
    display: flex;
    justify-content: space-between;
    padding-right: 50px;
  }
  i {
    font-weight: normal;
    cursor: pointer;
    font-size: 30px;
    font-weight: bolder;
  }
  .chart {
    margin-top: 5%;
  }
}
</style>
