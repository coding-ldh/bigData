<template>
  <div :class="'bar' + index" style="width: 60%; height: 300px"></div>
</template>

<script>
import echarts from "echarts";
import ChartMixins from "./mixins/chart-mixins"
export default {
  mixins: [ChartMixins],
  props: {
    index: {
      type: Number,
      default: 0
    },
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
  name: "ReBar",
  data() {
    return {
      echartInstance: null
    };
  },
  methods: {
    initechartInstance() {
      const echartDom = document.querySelector(".bar" + this.index);
      if (!echartDom) return;
      this.echartInstance = echarts.init(echartDom);
      this.echartInstance.clear();
      this.echartInstance.setOption({
        color: this.colorList,
        legend: {
          data: this.legend
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: "0",
          right: "4%",
          bottom: "3%",
          containLabel: true
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
            data: this.xData
          }
        ],
        yAxis: [
          {
            type: "value",
            axisTick: {
              show: false
            },
            axisLine: {
              show: false
            },
            splitLine: {
              //网格线
              lineStyle: {
                color: ["#F9F9F9"],
                width: 1,
                type: "solid"
              }
            },
            axisLabel: {
              interval: "auto",
              formatter: "{value} %",
              show: false
            }
          }
        ],
        series: this.series
      });
    }
  },
  created() {
    this.$nextTick(() => {
      this.initechartInstance();
      this.resize(this.echartInstance)
    });
  },
  beforeDestroy() {
    this.destroy(this.echartInstance);
  },
  watch: {
    series: {
      immediate: true,
      handler: function(val) {
        this.$nextTick(() => {
          this.initechartInstance();
        });
      }
    }
  },
};
</script>

<style scoped></style>
