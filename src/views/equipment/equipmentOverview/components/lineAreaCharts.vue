<template>
  <div class="myChart_container">
    <div class="top_container">
      <div class="title">{{ title }}</div>
      <slot></slot>
    </div>
    <div :style="{ width: '100%', height: '400px' }" :id="this.id"></div>
  </div>
</template>

<script>
import echarts from "echarts";
export default {
  props: {
    id: String,
    title: String,
    series: Array,
    trendXData: Array,
    colorList: Array,
    formatter: {
      type: String,
      default: "{value}"
    },
    legendData: {
      default: () => []
    }
  },
  data() {
    return {
      timer: null,
      myChart: null,
      option: {
        color: this.colorList,
        legend: {
          data: []
        },
        tooltip: {
          trigger: "axis"
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: {
          type: "category",
          data: [],
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          }
        },
        yAxis: {
          type: "value",
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          },
          axisLabel: {
            formatter: ""
          },
          splitLine: {
            //网格线
            lineStyle: {
              color: ["#F9F9F9"],
              width: 1,
              type: "solid"
            }
          }
        },
        series: {
          name: "",
          type: "line",
          stack: "Total",
          smooth: true,
          lineStyle: {
            width: 2,
            color: "#8edee8"
          },
          showSymbol: false,
          areaStyle: {
            opacity: 0.8,
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: "#dff6f8"
              },
              {
                offset: 1,
                color: "#dff6f8"
              }
            ])
          },
          emphasis: {
            focus: "series"
          },
          data: []
        }
      }
    };
  },
  watch: {
    series: {
      immediate: true,
      handler: function() {
        this.$nextTick(() => {
          this.drawChart();
        });
      }
    }
  },
  methods: {
    drawChart() {
      this.option.series.name = this.series[0].name;
      this.option.series.type = this.series[0].type;
      this.option.series.data = this.series[0].data;
      this.option.xAxis.data = this.trendXData;
      Array.isArray(this.legendData)
        ? (this.option.legend.data = this.legendData)
        : (this.option.legend = this.legendData);
      this.option.yAxis.axisLabel.formatter = this.formatter;
      this.myChart = echarts.init(document.getElementById(this.id));
      // 绘制图表
      this.myChart.setOption(this.option);
    },
    resizeChart() {
      this.timer ? clearTimeout(this.timer) : "";
      this.timer = setTimeout(() => {
        this.myChart.resize();
      }, 500);
    }
  },
  mounted() {
    this.myChart = echarts.init(document.getElementById(this.id));
    window.addEventListener("resize", this.resizeChart);
  },
  destroyed() {
    // 离开页面清除监听
    window.removeEventListener("resize", this.resizeChart);
  }
};
</script>

<style lang="scss" scoped>
.myChart_container {
  width: 100%;
  padding-top: 20px;
  padding-left: 30px;
  .top_container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-right: 60px;
    .title {
      color: #333;
      font-weight: bold;
      font-size: 16px;
    }
  }
}
</style>
