<template>
  <div class="myChart_container">
    <div
      :ref="id"
      class="com-chart"
      :style="{ width: '100%', height: '260px' }"
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
    trendXData: Array,
    colorList: Array,
    formatter: {
      type: String,
      default: "{value}",
    },
    legendData: {
      default: () => [],
    },
  },
  mounted() {
    this.drawChart();
    window.addEventListener("resize", () => {
      this.myChart.resize()
    })
  },
  data() {
    return {
      myChart: null,
      option: {
        title: {
          text: "设备广告投放趋势图",
          textStyle: {
            fontSize: 24,
            color: "rgba(255,255,255,0.68)",
            fontWeight: "500",
          },
        },
        color: this.colorList,
        legend: {
          data: [],
          itemHeight: 12,
          itemWidth: 12,
          textStyle: {
            fontSize: "12px",
            color: "rgba(255,255,255,0.46)",
            fontWeight: "400",
          },
          icon: "roundRect",
          right: "0%"
        },
        tooltip: {
          trigger: "axis",
        },
        grid: {
          left: "2%",
          bottom: "0%",
          right: "0%",
          containLabel: true, // 距离包含坐标轴上的文字
        },
        xAxis: {
          type: "category",
          data: [],
          axisTick: {
            show: false,
          },
          axisLabel: {
            color: "rgba(255,255,255,0.46)",
          },
          axisLine: {
            show: false,
          },
        },
        yAxis: {
          type: "value",
          axisTick: {
            show: false,
          },
          axisLine: {
            lineStyle: {
              color: "rgba(255,255,255,0.46)",
              // symbol: "none",
            },
            show: false,
          },
          axisLabel: {
            formatter: "",
          },
          splitLine: {
            //网格线
            lineStyle: {
              color: ["rgb(255, 255, 255, 0.08)"],
              width: 1,
              type: "solid",
            },
          },
          min: 'dataMin'
        },
        series: [
          
        ],
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
      deep: true,
    },
  },
  methods: {
    drawChart() {
      this.option.series = this.series;
      this.option.xAxis.data = this.trendXData;
      this.option.legend.data = this.legendData;

      this.option.yAxis.axisLabel.formatter = this.formatter;
      this.myChart = echarts.init(this.$refs[this.id]);
      // 绘制图表
      this.myChart.setOption(this.option);
    },
  },
};
</script>

<style lang="scss" scoped>
.myChart_container {
  width: 100%;
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