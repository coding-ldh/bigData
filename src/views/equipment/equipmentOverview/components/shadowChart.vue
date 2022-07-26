<template>
  <div class="myChart_container">
    <div class="title_time_container">
      <div class="title">{{ title }}</div>
      <div>{{ timeTip }}<slot></slot></div>
    </div>
    <div
      :style="{ width: '96%', height: '280px' }"
      :id="this.id"
      class="chart"
    ></div>
  </div>
</template>

<script>
import echarts from "echarts";
export default {
  props: {
    id: String,
    title: String,
    chartData: Array,
    colors: Array,
    timeTip: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      timer: null,
      myChart: null,
      option: {
        tooltip: {
          // 鼠标移动图上显示数据
          trigger: "item"
        },
        grid: {
          top: "0%",
          left: "3%",
          bottom: "0%",
          containLabel: true // 距离包含坐标轴上的文字
        },
        colors: this.colors, // 整体颜色
        yAxis: {
          offset: 10, //文字与y轴的偏移量
          axisLine: {
            //y轴线
            show: false
          },
          axisTick: {
            //y轴刻度线
            show: false
          },
          splitLine: {
            //网格线
            show: false
          }
          // data: ['其他','广告资源置换',"已销售设备量", "租赁设备量", "试用设备量"],
        },
        xAxis: {
          max: "dataMax",
          splitLine: {
            show: false
          },
          // show:false,
          axisLine: {
            //y轴
            show: false
          },
          axisTick: {
            //y轴刻度线
            show: false
          },
          splitLine: {
            //网格线
            show: false
          }
        },
        series: [
          {
            type: "bar",
            color: this.colors,
            label: {
              show: true,
              position: "right"
            },
            barWidth: "30"
          }
        ]
      }
    };
  },
  watch: {
    chartData: {
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
      this.option.yAxis.data = this.chartData.map(item => {
        return item.name;
      });
      this.option.series[0].data = this.chartData;
      let myChart = echarts.init(document.getElementById(this.id));
      // 绘制图表
      myChart.setOption(this.option);
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
  .title_time_container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-right: 30px;
  }
  .title {
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
    margin-top: 40px;
  }
}
</style>
