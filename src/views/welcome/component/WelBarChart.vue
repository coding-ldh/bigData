<template>
  <div class="myChart_container">
    <div
      :id="this.id"
      class="com-chart"
      :style="{ width: '285px', height: '100px' }"
    ></div>
  </div>
</template>

<script>
import echarts from "echarts";
export default {
  props: {
    id: String,
    title: String,
    series: Array,
    xData: Array,
    yUnit: {
      type: String,
      default: ""
    },
    timeTip: {
      type: String,
      default: ""
    },
    colorList: {
      type: Array,
      default: () => ["#3BA0FF", "#F2637B"]
    },
    legend: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      myChart: null,
      option: {
        grid: {
          left: "5%",
          right: "5%",
          bottom: "0%",
          top: "10%",
          containLabel: true // 距离包含坐标轴上的文字
        },
        color: this.colorList,
        legend: {
          itemHeight: 12,
          itemWidth: 12,
          data: this.legend,
          icon: "roundRect",
          align: "auto",
          // align: "right",
          bottom: "0%"
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          },
          confine: true,
        },
        xAxis: [
          {
            type: "category",
            axisTick: {
              show: false
            },
            axisLine: {
              show: false
            },
            axisLabel: {
              color: "#999",
              fontSize: 12,
              interval: 6,
              showMinLabel: true,
              showMaxLabel: true
            },
            data: this.xData
            // offset: 10
          }
        ],
        yAxis: [
          {
            type: "value",
            axisTick: {
              show: false
            },
            splitLine: {
              //网格线
              lineStyle: {
                color: ["rgb(255, 255, 255, 0.08)"],
                width: 1,
                type: "solid"
              }
            },
            axisLabel: {
              show: true,
              interval: "auto",
              formatter: "{value} %",
              show: false,
              fontSize: 12
            },
            axisLine: {
              lineStyle: {
                color: "rgba(255,255,255,0.46)",
                symbol: "none"
              },
              show: false
            }
          }
        ],
        series: []
      }
    };
  },
  mounted() {
    window.addEventListener("resize", () => {
      this.myChart.resize();
    });
  },
  watch: {
    series: {
      immediate: true,
      handler: function(val) {
        this.$nextTick(() => {
          this.drawChart();
        });
      }
    }
  },
  methods: {
    drawChart() {
      this.option.yAxis[0].axisLabel.formatter = `{value}${this.yUnit}`;
      this.option.xAxis[0].data = this.xData;
      this.option.series = this.series;
      this.option.legend.data = this.legend;
      this.myChart = echarts.init(document.getElementById(this.id));
      // 绘制图表
      this.myChart.setOption(this.option);
    }
  }
};
</script>

<style lang="scss" scoped>
.myChart_container {
  width: 100%;
  height: 100%;
  .title_time_container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-right: 30px;
  }
  .chart {
    margin-top: 60px;
  }
}
</style>
