<template>
  <li v-loading="loading">
    <circle-chart
      id="chart1"
      title="单台设备日均流量分布区间"
      :chartData="dailyFlowData"
      v-if="dailyFlowData.length != 0"
      :colors="chartOneColors"
    ></circle-chart>
  </li>
</template>

<script>
import CircleChart from "@/components/Charts/CircleChart";
export default {
  props: {
    adsOverviewList: {
      type: Array,
    },
  },
  components: { CircleChart },
  data() {
    return {
      loading: false,
      dailyFlowData: [],
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
      this.setDailyFlowData();
    },
    setDailyFlowData() {
      const len = this.adsOverviewList.length;
      const targetArr = this.adsOverviewList
        .reduce((pre, cur) => {
          return pre.length > 0
            ? [
                pre[0] + cur.trafficTo500Counts,
                pre[1] + cur.trafficTo1000Counts,
                pre[2] + cur.trafficTo3000Counts,
                pre[3] + cur.trafficTo5000Counts,
                pre[4] + cur.trafficTo8000Counts,
                pre[5] + cur.trafficTo10000Counts,
                pre[6] + cur.trafficToXCounts,
              ]
            : [
                cur.trafficTo500Counts,
                cur.trafficTo1000Counts,
                cur.trafficTo3000Counts,
                cur.trafficTo5000Counts,
                cur.trafficTo8000Counts,
                cur.trafficTo10000Counts,
                cur.trafficToXCounts,
              ];
        }, [])
        .map((item) => Math.round(item / len));
      const targetName = [
        "0-500次",
        "500次-1000次",
        "1000次-3000次",
        "3000次-5000次",
        "5000次-8000次",
        "8000次-10000次",
        "10000次以上",
      ];
      this.dailyFlowData = targetName.map((item, index) => {
        return {
          name: item,
          value: targetArr[index],
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
</style>