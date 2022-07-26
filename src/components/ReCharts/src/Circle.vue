<template>
  <div :class="'circle' + index" style="width: 100%; height: 32vh"></div>
</template>

<script>
import echarts from "echarts";
import ChartMixins from "./mixins/chart-mixins"
export default {
  mixins: [ChartMixins],
  props: {
    unit: String,
    chartData: Array,
    colors: Array,
    index: {
      type: Number,
      default: 0
    }
  },
  name: "ReCircle",
  data() {
    return {
      echartInstance: null
    };
  },
  methods: {
    initechartInstance() {
      const echartDom = document.querySelector(".circle" + this.index);
      if (!echartDom) return;
      // @ts-ignore
      this.echartInstance = echarts.init(echartDom);
      this.echartInstance.clear(); //清除旧画布 重新渲染

      this.echartInstance.setOption({
        tooltip: {
          trigger: "item"
        },
        grid: {
          left: "0%",
          containLabel: true
        },
        color: this.colors,
        legend: {
          orient: "vertical",
          right: "right",
          icon: "circle",
          itemGap: 14,
          formatter: name => {
            let nameStr;
            let percent;
            let value;
            let rank;
            let total = 0;
            for (let i = 0; i < this.chartData.length; i++) {
              total += parseInt(this.chartData[i].value);
              if (this.chartData[i].name == name) {
                nameStr = name;
                value = this.chartData[i].value;
                rank = i + 1;
              }
            }
            percent = total == 0 ? 0 : Math.round((value / total) * 1000) / 10;
            return `${nameStr} | ${value}${this.unit} | ${percent}%`;
          }
        },
        series: [
          {
            type: "pie",
            radius: ["100%", "70%"],
            center: ["26%", "50%"],
            itemStyle: {
              borderRadius: 10,
              borderColor: "#fff",
              borderWidth: 2
            },
            label: {
              show: false,
              position: "center"
            },
            labelLine: {
              show: true
            },
            data: this.chartData
          }
        ]
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
    chartData: {
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
