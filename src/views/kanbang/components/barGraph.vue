<template>
  <div class="myChart_container">
    <div :style="{ width: '100%', height: '230px' }" :id="id"></div>
  </div>
</template>

<script>
export default {
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
      myChart: null,
      option: {
        title: {
          text: "年龄分布",
          textStyle: {
            fontSize: 14,
            color: "rgba(255,255,255,0.68)",
            fontWeight: "500",
          },
          top: "10%",
          left: "0%"
        },
        grid: {
          top: "20%",
          left: "3%",
          bottom: "0%",
          containLabel: true, // 距离包含坐标轴上的文字
        },
        color: this.colorList,
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
          },
        },
        xAxis: [
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
              show: false,
            },
            axisLabel: {
              show: false,
            },
            axisLine: {
              show: false,
            },
            max: 100,
          },
        ],
        yAxis: [
          {
            type: "category",
            axisTick: {
              show: false,
            },
            axisLine: {
              show: false,
            },
            axisLabel: {
              color: "rgba(255,255,255,0.46)",
              fontSize: 12,
            },
            splitLine: { show: false },
            data: this.xData,
          },
        ],
        series: [],
      },
    };
  },
  mounted() {
    window.addEventListener("resize", () => {
      this.myChart.resize()
    })
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
      this.myChart = this.$echarts.init(document.getElementById(this.id));
      // 绘制图表
      this.myChart.setOption(this.option);
    },
  },
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