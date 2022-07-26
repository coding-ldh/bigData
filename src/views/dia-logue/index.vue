<template>
  <div class="container">
    <div class="board_title">设备城市分布</div>
    <div class="top_5">
      <img :src="require('../../assets/images/Top5.png')" alt="" />
    </div>
    <div class="line"></div>
    <bar-chart
      id="chart20"
      :showPercent="false"
      :series="cityDataY"
      :colorList="cityColorList"
      :xData="cityDataX"
      v-if="cityDataY.length > 0"
    >
    </bar-chart>
  </div>
</template>

<script>
import BarChart from "./components/barChart.vue";
import { getNewDeviceOfCity } from "@/api/kanbang";
export default {
  components: {
    BarChart,
  },
  data() {
    return {
      timer: null,
      cityColorList: ["#107CFC"],
      cityDataX: [],
      cityDataY: [],
    };
  },
  async created() {
    await this.initData()
    // console.log(this.cityDataY, this.cityDataX)
  },
  mounted() {
    if (this.timer) {
      window.clearInterval(this.timer)
    } else {
      this.timer = setInterval(() => {
        this.initData()
      }, 1000*60*60);
    }
  },
  methods: {
    async initData() {
      const { data } = await getNewDeviceOfCity();
      this.cityDataX = []
      this.cityDataY = []
      const targetData = data.slice(0, 5);
      const cityDataYArr = [];
      targetData.forEach((item) => {
        this.cityDataX.push(item.name);
        cityDataYArr.push(item.value);
      });
      this.cityDataY.push({
        barGap: 0,
        barWidth: 56,
        data: cityDataYArr,
        name: "已投放设备量(门岗和乐乐)",
        type: "bar",
        itemStyle: {
          normal: {
            barBorderRadius: [50, 50, 0, 0],
          },
        },
      });
    }
  },
  destroyed() {
    window.clearInterval(this.timer);
  },
};
</script>

<style lang="scss" scoped>
.container {
  position: relative;
  ::-webkit-scrollbar {
    display: none;
  }
  .top_5 {
    position: absolute;
    right: 67px;
    top: 80px;
  }
  .line {
    width: 1756px;
    margin: 0 auto;
    background: linear-gradient(44deg, #0093ff 0%, rgba(0, 147, 255, 0) 100%);
    height: 6px;
    margin-bottom: 56px;
  }
  font-family: "Source Han Sans CN", sans-serif;
  .board_title {
    font-size: 80px;
    font-weight: 500;
    margin: 0 82px;
    color: #fff;
    margin-top: 82px;
    margin-bottom: 38px;
  }
  position: relative;
  width: 100%;
  height: 1080px;
  background-image: url("../../assets/images/bg.png");
}
</style>>
