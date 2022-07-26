<template>
  <div class="myChart_container">
    <div class="title_time_container" v-if="show">
      <div class="title">{{ title }}</div>
      <div>{{ timeTip }}<slot></slot></div>
    </div>
    <div
      :style="{ marginLeft: marginLeft, height: '360px' }"
      :id="id"
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
    series: Array,
    colors: Array,
    show: { type: Boolean, default: true },
    timeTip: { type: String, default: "" },
    Unit: { type: String, default: "" },
    itemGap: { type: Number, default: 50 },
    legendTop: { type: String, default: "7%" },
    legendLeft: { type: String, default: "0%" },
    legendPadding: { type: Array, default: () => [0, 0, 0, 0] },
    marginLeft: { type: String, default: "-58%" },
  },
  data() {
    return {
      timer: null,
      myChart: null,
      option: {
        tooltip: {
          trigger: "item",
          textStyle: { color: "#fff" },
          backgroundColor: "rgba(33, 41, 71, 0.9)",
          className: "tooltip",
          padding: [15, 25, 15, 25],
          confine: true,
          position: function (point) {
            return { left: point[0], top: point[1] - 90 };
          },
        },
        color: this.colors,
        legend: {
          padding: this.legendPadding,
          top: this.legendTop,
          right: "3%",
          left: this.legendLeft,
          orient: "vertical",
          icon: "circle",
          itemGap: this.itemGap,
          textStyle: { fontWeight: "400", fontSize: 16, color: "#666" },
          itemWidth: 12,
          itemHeight: 12,
          formatter: (name) => {
            return ` ` + name;
          },
        },
        graphic: [
          // bar圆图中间文字
          {
            type: "text",
            left: "center",
            top: "47%",
            style: {
              text: "设备总量(台)",
              textAlign: "center",
              fill: "rgba(102, 102, 102, 1)",
              width: 30,
              height: 30,
              fontSize: 12,
            },
          },
          {
            type: "text",
            left: "center",
            top: "40%",
            style: {
              text: "",
              textAlign: "center",
              fill: "rgba(51, 51, 51, 1)",
              width: 30,
              height: 30,
              fontSize: 22,
            },
          },
        ],
        series: [
          {
            type: "pie",
            radius: ["52%", "65%"],
            center: ["50%", "44%"],
            itemStyle: {
              borderRadius: 15,
              borderColor: "#fff",
              borderWidth: 3,
            },
            label: {
              show: false,
              position: "center",
            },
            labelLine: {
              show: true,
            },
            data: [],
          },
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
    },
  },
  methods: {
    drawChart() {
      // 绘制图表
      let myChart = echarts.init(document.getElementById(this.id));
      let total = 0;
      for (let i = 0; i < this.series.length; i++) {
        total += this.series[i].value;
      }
      this.option.graphic[1].style.text = total;
      this.option.series[0].data = this.series;
      let that = this;
      this.option.tooltip.formatter = (params) => {
        let string =
          '<span style="border:2px solid #fff ;' + params.marker.slice(13, 999);
        let total = 0;
        for (let i = 0; i < that.series.length; i++) {
          total += parseInt(that.series[i].value);
        }
        let relVal = "";
        relVal +=
          string +
          `<span style="color:#A7ABB7;">${params.data.name}(台)</span>` +
          "&nbsp;&nbsp;&nbsp;&nbsp;" +
          params.data.value +
          that.Unit +
          `<span style="color:#fff">( ${
            Math.round((params.data.value * 1000) / total) / 10
          }% )</span>`;
        return relVal;
      };
      myChart.setOption(this.option);
    },
    resizeChart() {
      this.timer ? clearTimeout(this.timer) : "";
      this.timer = setTimeout(() => {
        this.myChart.resize();
        let myChart = echarts.init(document.getElementById(this.id));
        document.getElementById(this.id).firstElementChild.style.width = "100%";
        myChart.setOption(this.option);
      }, 500);
    },
  },
  mounted() {
    this.myChart = echarts.init(document.getElementById(this.id));
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
  // padding-top: 20px;
  // padding-left: 30px;
  .title_time_container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-right: 30px;
  }
  .title {
    height: 55px;
    line-height: 40px;
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
    margin: 0 auto;
    // margin-top: 5%;
  }
}
</style>
