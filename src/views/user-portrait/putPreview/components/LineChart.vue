<template>
  <div class="myChart_container">
    <div class="table">
      <span
        @click="selectTable(index)"
        :class="isSelect == index ? 'active' : ''"
        v-for="(table, index) in title"
        :key="index"
      >
        {{ table }}
      </span>
    </div>
    <div style="position: absolute; top: 45px; color: #666666; font-size: 14px">
      {{ Yunit }}
    </div>
    <div
      :style="{
        marginTop: '20px',
        width: '100%',
        height: '500px',
      }"
      :id="id"
    ></div>
  </div>
</template>

<script>
import echarts from "echarts";
export default {
  props: {
    id: String,
    Yunit: String,
    title: Array,
    colorList: Array,
    XData: { type: Array, default: [] },
    legend: { type: Array, default: [] },
    series: Array,
    noMerge: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      // timer: null,
      isSelect: 0,
      myChart: null,
      option: {
        color: this.colorList,
        legend: {
          icon: "circle",
          itemHeight: 8,
          itemWidth: 8,
          itemGap: 20,
          textStyle: {
            fontSize: 12,
            color: "#666666",
            padding: [0, 0, -2, 0],
          },
          right: 0,
          data: this.legend,
        },
        grid: {
          top: "10%",
          left: "0",
          right: "1%",
          bottom: "5%",
          containLabel: true,
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            lineStyle: {
              color: "#CCCCCC",
            },
            z: -1,
            type: "line", // 默认为直线，可选为：'line' | 'shadow'
          },
          textStyle: {
            color: "#fff",
          },
          backgroundColor: "rgba(33, 41, 71, 0.9)",
          padding: [15, 25, 15, 25],
          confine: true,
          formatter: (params) => {
            let reVal = `<div style="margin-bottom:10px;">${params[0].name}</div>`;
            let str = '<span style=" border:2px solid #fff ;';
            for (let i = 0; i < params.length; i++) {
              reVal += `<div style="display:flex; padding:5px 0;  justify-content: space-between;">
                          <div style="color:#9599A7;">
                            ${str + params[i].marker.slice(13, 999)}
                            ${params[i].seriesName}(台)
                          </div>
                          <div style="padding-left:15px;font-weight:600;">
                            ${params[i].value}
                          </div>
                        </div>`;
            }
            return reVal;
          },
        },
        xAxis: {
          axisTick: {
            show: true,
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: "#EDEDED",
            },
          },
          axisLabel: {
            show: true,
            textStyle: { fontSize: 13, color: "#999" },
          },
          type: "category",
          offset: 5,
        },
        yAxis: {
          type: "value",
          axisLine: {
            show: false,
            lineStyle: {
              color: "#999",
            },
          },
          axisTick: { show: false },
          axisLabel: {
            show: true,
            interval: "auto",
            formatter: "{value}",
          },
          splitLine: {
            lineStyle: {
              color: ["#F2F2F2"],
              width: 1,
              type: "dashed",
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
    selectTable(index) {
      this.isSelect = index;
      this.$emit("isSelect", index);
    },
    drawChart() {
      this.option.series = this.series;
      this.option.xAxis.data = this.XData;
      this.option.legend.data = this.legend;
      this.myChart = echarts.init(document.getElementById(this.id));
      // // 绘制图表
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
  font-family: "PingFang SC-Bold";
  position: relative;
  border-bottom: 1px dashed rgb(221, 221, 221);
  .table {
    span {
      cursor: pointer;
      color: #666666;
      font-size: 16px;
      margin: 0 15px;
      padding: 5px 0px;
      text-align: center;
    }
    :first-child {
      padding-left: 0px;
      margin-left: 0;
    }
    .active {
      color: #1f5dea;
      border-bottom: 2px solid #1f5dea;
    }
  }
}
</style>
