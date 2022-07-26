<template>
  <div class="myChart_container">
    <div
      class="top_container"
      :style="`justify-content:${flex_title_justify_content}`"
    >
      <div class="title">{{ title }}</div>
      <slot></slot>
    </div>
    <div :style="{ width: '100%', height: '400px' }" :id="id"></div>
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
    noMerge: {
      type: Boolean,
      default: false,
    },
    formatter: {
      type: String,
      default: "{value}",
    },
    legendData: {
      default: () => [],
    },
    flex_title_justify_content: {
      type: String,
      default: "space-between",
    },
  },
  data() {
    return {
      timer: null,
      myChart: null,
      option: {
        color: this.colorList,
        legend: {
          data: [],
        },
        tooltip: {
          trigger: "axis",
        },
        grid: {
          top: "10%",
          left: 0,
          right: "3%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          data: [],
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
          },
          offset: 5,
        },
        yAxis: {
          type: "value",
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
          },
          axisLabel: {
            formatter: "",
          },
          splitLine: {
            //网格线
            lineStyle: {
              color: ["#F9F9F9"],
              width: 1,
              type: "solid",
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
      handler: function () {
        this.$nextTick(() => {
          this.drawChart();
        });
      },
    },
  },
  methods: {
    drawChart() {
      this.option.color = this.colorList;
      this.option.series = this.series;
      this.option.xAxis.data = this.trendXData;
      Array.isArray(this.legendData)
        ? (this.option.legend.data = this.legendData)
        : (this.option.legend = this.legendData);
      this.option.yAxis.axisLabel.formatter = this.formatter;
      this.myChart = echarts.init(document.getElementById(this.id));
      // 绘制图表
      this.myChart.setOption(this.option, this.noMerge);
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
  .top_container {
    display: flex;
    align-items: center;
    padding-right: 60px;
    .title {
      color: #333;
      font-weight: bold;
      font-size: 16px;
    }
  }
  .flex-between {
    justify-content: space-between;
  }
}
</style>
