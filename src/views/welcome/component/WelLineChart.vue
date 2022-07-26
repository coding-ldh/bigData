<template>
  <div class="myChart_container">
    <div
      :ref="this.id"
      class="com-chart"
      :style="{ width: '100%', height: height + 'px' }"
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
    height: Number,
    min: Number,
    formatter: Function,
    tipFormatter: Function,
    grid: Object,
    text: String,
    tipPadding: {
      type: Array,
      default: () => [15, 25, 15, 25]
    },
    legendData: {
      default: () => []
    }
  },
  mounted() {
    this.drawChart();
    window.addEventListener("resize", () => {
      this.myChart.resize();
    });
  },
  data() {
    return {
      myChart: null,
      option: {
        title: {
          text: "",
          textStyle: {
            fontSize: 12,
            color: "#666",
            fontWeight: "400"
          },
          top: "5%"
        },
        color: this.colorList,
        legend: {
          data: [],
          itemHeight: 12,
          itemWidth: 12,
          textStyle: {
            fontSize: "12px",
            color: "#666",
            fontWeight: "400"
          },
          icon: "roundRect",
          right: "0%",
          bottom: "0%",
          top: "5%"
        },
        tooltip: {
          trigger: "axis",
          textStyle: {
            color: "#fff",
          },
          formatter: '',
          backgroundColor: "rgba(33, 41, 71, 0.9)",
          className: "tooltip",
          padding: [15, 25, 15, 25],
          confine: true,
        },
        xAxis: {
          type: "category",
          data: [],
          axisTick: {
            show: false
          },
          axisLabel: {
            color: "#999",
            fontSize: 12,
            interval:6,
            showMinLabel: true,
            showMaxLabel: true,
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: "#EDEDED",
              width: 1
            }
          },
          boundaryGap: false
        },
        yAxis: {
          type: "value",
          axisTick: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: "#999"
              // symbol: "none",
            },
            show: false
          },
          axisLabel: {
            showMinLabel: true,
          },
          splitLine: {
            //网格线
            lineStyle: {
              color: ["#E9E9E9"],
              width: 1,
              type: "dotted"
            }
          },
          offset: 2
        },
        series: []
      }
    };
  },
  watch: {
    series: {
      immediate: true,
      handler: function(val) {
        this.$nextTick(() => {
          this.drawChart();
        });
      },
      deep: true
    }
  },
  methods: {
    drawChart() {
      this.option.series = this.series;
      this.option.grid = this.grid
      this.option.xAxis.data = this.trendXData;
      this.option.legend.data = this.legendData;
      this.option.yAxis.axisLabel.formatter = this.formatter;
      this.option.yAxis.min = this.min;
      this.option.title.text = this.text;
      this.option.tooltip.formatter = this.tipFormatter;
      this.option.tooltip.padding = this.tipPadding;
      this.myChart = echarts.init(this.$refs[this.id]);
      // 绘制图表
      this.myChart.setOption(this.option);
    }
  }
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
