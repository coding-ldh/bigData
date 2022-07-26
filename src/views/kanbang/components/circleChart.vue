<template>
  <div class="myChart_container">
    <div :style="{ width: '100%', height: '230px' }" :id="id"></div>
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
      default: ""
    }
  },
  data() {
    return {
      myChart: null,
      option: {
        tooltip: {
          trigger: "item"
        },
        color: this.colors,
        legend: {
          itemHeight: 12,
          itemWidth: 12,
          bottom: "0%",
          left: "center",
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
            percent = total == 0 ? 0 : ((value / total) * 100).toFixed();
            return `${nameStr}  |  {one|${percent}%}`;
          },
          textStyle: {
            color: "rgba(255,255,255,0.46)",
            fontWeight: "400",
            fontSize: 12,
            rich: {
              one: {
                opacity: 1,
                color: "rgba(255, 255, 255, 0.9);",
                fontSize: 14
              }
            }
          }
        },
        series: [
          {
            type: "pie",
            avoidLabelOverlap: false,
            hoverAnimation: true,
            center: ["50%", "40%"],
            labelLine: {
              show: false // 隐藏指示线
            },
            polar: {
              center: ["50%", "40%"], //圆环-图形位置
              radius: "100%" //图形大小 值可设置超过100%
            },
            radius: ["60%", "80%"],
            label: {
              show: true,
              position: "center",
              formatter: this.title,
              color: "rgba(255,255,255,0.68)",
              fontSize: 16
            },
            labelLine: {
              show: false
            },
            itemStyle: {
              // normal: {
              //   borderRadius: 30,
              //   borderWidth: 2,
              //   borderColor: '#fff',
              // },
            },
            data: []
          }
        ]
      }
    };
  },
  mounted() {
    window.addEventListener("resize", () => {
      this.myChart.resize();
    });
  },
  watch: {
    chartData: {
      immediate: true,
      handler: function(val) {
        this.$nextTick(() => {
          this.drawChart();
        });
      }
    }
  },
  methods: {
    drawChart() {
      this.option.series[0].data = this.chartData;
      this.myChart = echarts.init(document.getElementById(this.id));
      // 绘制图表
      this.myChart.setOption(this.option);
    }
  }
};
</script>

<style lang="scss" scoped>
.myChart_container {
  width: 100%;
  height: 100%;
}
</style>
