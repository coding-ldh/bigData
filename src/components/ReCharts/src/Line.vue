<template>
  <div class="myChart_container">
    <slot></slot>
    <div :class="'line' + index" style="width: 100%; height: 380px"></div>
  </div>
</template>

<script>
import echarts from "echarts";
import ChartMixins from "./mixins/chart-mixins"
export default {
  mixins: [ChartMixins],
  props: {
    series: Array,
    trendXData: Array,
    colorList: Array,
    formatter: {
      type: String,
      default: "{value}"
    },
    index: {
      type: Number,
      default: 0
    },
    legendData: {
      default: () => []
    }
  },
  name: "ReLine",
  data() {
    return {
      echartInstance: null
    };
  },
  methods: {
    initechartInstance() {
      const echartDom = document.querySelector(".line" + this.index);
      if (!echartDom) return;
      // @ts-ignore
      this.echartInstance = echarts.init(echartDom);
      this.echartInstance.clear(); //清除旧画布 重新渲染

      this.echartInstance.setOption({
        color: this.colorList,
        legend: this.legendData,
        tooltip: {
          trigger: "axis"
        },
        grid: {
          left: 0,
          right: 0,
          containLabel: true
        },
        xAxis: {
          type: "category",
          data: this.trendXData,
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          }
        },
        yAxis: {
          type: "value",
          scale: true,
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          },
          axisLabel: {
            formatter: this.formatter
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
      handler: function() {
        this.$nextTick(() => {
          this.initechartInstance();
        });
      }
    }
  },
};
</script>

<style scoped lang="scss">
.myChart_container {
  width: 100%;
}
</style>
