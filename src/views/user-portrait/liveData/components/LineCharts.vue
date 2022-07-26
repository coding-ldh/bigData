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
          show: true, // top标签显隐
          icon: "rect"
        },
        tooltip: {
          trigger: "axis"
        },
        grid: {
          left: "1%",
          right: "2%",
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
          },
          axisLabel:{
            interval:0 // 展示刻度
          },
        },
        yAxis: {
          name:'PV流量',
          type: "value",
          nameTextStyle:{
            padding:[0,0,5,0],
          },
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          },
          axisLabel: {
            formatter(val) {
              if (val <= 1) {
                return val
              } else if (val <= 10000) {
                return val
              } else {
                return `${val / 10000000}千万`
              }

            }
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
        showSymbol: true,
        symbolSize: 5,
        series: [
          {
            name: "",
            type: "line",
            // stack: "Total", // 控制是否叠加
            smooth: false, // 控制折现是否圆滑
            lineStyle: {
              // 折现样式
              width: 1,
              fontSize: 20,
              color: "#F9F9F9"
            },
            showSymbol: true,
            symbolSize: 8,
            areaStyle: {
              opacity: 1,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 1,
                  color: "#F9F9F9"
                }
              ])
            },
            data: []
          }
        ]
      }
    };
  },
  watch: {
    series: {
      immediate: true,
      handler: function () {
        this.$nextTick(() => {
          // console.log("changed");
          this.series.length == 0 ? "" : this.drawChart();
        });
      }
    }
  },
  methods: {
    renderReset() {
      this.myChart.clear();
    },
    drawChart() {
      // console.log(this.series,'-----------')
      this.option.series = []
      this.option.series[0] =
      {
        name: this.series[0].name,
        type: "line",
        smooth: true,
        // stack: "Total", // 控制是否叠加
        lineStyle: {  // 折现样式
          width: 1,
          fontSize: 20,
          color:
            this.colorList[2]
        },
        areaStyle: {
          opacity: 0.6,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 1,
              color:
                this.colorList[0]
            }
          ])
        },
        data: this.series[0].data
      };
      this.option.series[1] = {
        name: this.series[1].name,
        type: "line",
        smooth: true,
        // stack: "Total", // 控制是否叠加
        lineStyle: {
          // 折现样式
          width: 1,
          fontSize: 20,
          color:
            this.colorList[3]
        },
        areaStyle: {
          opacity: 0.6,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 1,
              color:
                this.colorList[1]
            }
          ])
        },
        data: this.series[1].data
      };
      // console.log(this.option.series)
      this.option.xAxis.data = this.trendXData;
      // this.option.yAxis.axisLabel.formatter = this.formatter;
      this.myChart = echarts.init(document.getElementById(this.id));
      // 绘制图表
      this.myChart.setOption(this.option, false);
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
  // flex: 1;
  width: 100%;
  padding-top: 20px;
  padding-left: 30px;
  .top_container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-right: 30px;
    .title {
      color: #333;
      font-weight: bold;
      font-size: 14px;
    }
  }
}
</style>
