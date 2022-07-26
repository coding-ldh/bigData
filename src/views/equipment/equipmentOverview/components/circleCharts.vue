<template>
  <div class="myChart_container">
    <div class="title_time_container">
      <div class="title">{{ title }}</div>
      <div>{{ timeTip }}<slot></slot></div>
    </div>
    <div :id="this.id" class="chart"></div>
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
      default: "",
    },
    barGraphic: Array,
    total: Number,
  },
  data() {
    return {
      timer: null,
      myChart: null,
      option: {
        tooltip: {
          trigger: "item",
        },
        color: this.colors,
        legend: {
          orient: "vertical",
          right: "3%",
          icon: "circle",
          top: "10%",
          itemGap: 14,
          formatter: (name) => {
            let nameStr;
            let percent;
            let value;
            let total = 0;
            let index = 0;
            let AddRate = [];
            for (let i = 0; i < this.chartData.length; i++) {
              total += parseInt(this.chartData[i].value);
              if (this.chartData[i].name == name) {
                nameStr = name;
                value = this.chartData[i].value;
              }
            }
            // 0数据直接返回
            if (total == 0) {
              return `${nameStr}  | ${0}%`;
            }
            // 大于一个数据对第二个进行填充100%操作
            if (this.chartData.length >= 2) {
              index = this.chartData.length - 1;
              // 寻找当前是否为最后一个数据
              if (this.chartData[index].name == nameStr) {
                //是
                for (let i = 0; i < this.chartData.length - 1; i++) {
                  AddRate[i] = (
                    (this.chartData[i].value / total) *
                    100
                  ).toFixed(2);
                }
                percent = AddRate.reduce((a, b) => {
                  return Number(a) + Number(b);
                });
                return `${nameStr} | ${value}台  | ${(
                  Math.round((100 - percent) * 10) / 10
                ).toFixed(1)}%`;
              } else {
                //否
                percent =
                  total == 0 ? 0 : Math.round((value / total) * 1000) / 10;
                return `${nameStr} | ${value}台  | ${percent.toFixed(1)}%`;
              }
            } else {
              //  一个数据直接展示
              percent =
                total == 0 ? 0 : Math.round((value / total) * 1000) / 10;
              return `${nameStr} | ${value}台  | ${percent.toFixed(1)}%`;
            }
          },
        },
        // graphic: {},
        series: [
          {
            type: "pie",
            radius: ["100%", "70%"],
            center: ["50%", "50%"],
            itemStyle: {
              borderRadius: 10,
              borderColor: "#fff",
              borderWidth: 2,
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
    chartData: {
      immediate: true,
      handler: function (val) {
        this.$nextTick(() => {
          this.drawChart();
        });
      },
    },
    total: {
      immediate: true,
      handler: function (val) {},
    },
  },
  methods: {
    drawChart() {
      this.option.series[0].data = this.chartData;
      if (this.barGraphic) {
        // 圆图中间文字
        this.option.graphic = this.barGraphic;
      }
      // console.log(this.option.graphic)
      let myChart = echarts.init(document.getElementById(this.id));
      // 绘制图表
      myChart.setOption(this.option);
    },
    resizeChart() {
      this.timer ? clearTimeout(this.timer) : "";
      this.timer = setTimeout(() => {
        this.myChart.resize();
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
    height: 280px;
    margin-top: 50px;
    margin-left: -50%;
  }
}
</style>
