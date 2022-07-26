<template>
  <li class="first" v-loading="loading">
    <circle-chart
      id="chart2"
      title="场景类别设备占比"
      :chartData="sceneChartData"
      v-if="sceneChartData.length != 0"
      :colors="chartOneColors"
    ></circle-chart>
  </li>
</template>

<script>
import CircleChart from "./component/CircleChart";
import { getGroupIndustry } from "@/api/userPortrait";

export default {
  props: {
    params: {
      type: Object,
    },
  },
  components: { CircleChart },
  data() {
    return {
      loading: false,
      sceneChartData: [],
      chartOneColors: [
        "#3BA0FF",
        "#36CBCB",
        "#4DCB73",
        "#FAD337",
        "#F2637B",
        "#975FE4",
        "#FFA15A",
      ],
    };
  },
  methods: {
    init() {
      this.loading = true;
      this.getIndustry(this.params);
    },
    async getIndustry(params) {
      const { data } = await getGroupIndustry(params);
      // console.log(data);
      let groupIndustry = [];
      groupIndustry = data;
      this.sceneChartData = groupIndustry.map((item) => {
        return {
          name: item.projectIndustry,
          value: item.midCounts,
          trafficCounts:item.trafficCounts,
        };
      });
      this.loading = false;
    },
  },
  mounted() {
    // this.init();
  },
};
</script>
<style lang="scss" scoped>
.first {
  margin-right: 11px;
  padding-bottom: 20px;
}
</style>