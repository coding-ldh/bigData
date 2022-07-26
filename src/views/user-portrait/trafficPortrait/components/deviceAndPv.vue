<template>
  <ul class="device_pV">
    <li class="first" v-loading="loading">
      <div v-if="overviewData != null">
        已激活设备数：
        <div class="count">{{ overviewData.devicesNumOfYesterday }}</div>
        <div
          class="result_container"
          :class="getTextColor(overviewData.devicesNumOffsetOfBeforeYesterday)"
        >
          <span class="compare_time">较前日</span>
          <span class="compare_value"
            >{{
              getCompareVal(
                overviewData.devicesNumOffsetOfBeforeYesterday,
                "device"
              )
            }}
            台</span
          >
          <i
            :class="getClass(overviewData.devicesNumOffsetOfBeforeYesterday)"
          ></i>
        </div>
      </div>
    </li>
    <li v-loading="loading">
      <div v-if="overviewData != null">
        日流量：
        <div class="count">
          {{ overviewData.trafficOfYesterday / 10000 }}万次
        </div>
        <div
          class="result_container"
          :class="getTextColor(overviewData.trafficOffsetOfBeforeYesterday)"
        >
          <span class="compare_time">较前日</span>
          <span class="compare_value"
            >{{
              getCompareVal(overviewData.trafficOffsetOfBeforeYesterday, "flow")
            }}
            万次</span
          >
          <i :class="getClass(overviewData.trafficOffsetOfBeforeYesterday)"></i>
        </div>
      </div>
    </li>
  </ul>
</template>

<script>
import { adsOverview } from "@/api/userPortrait";

export default {
  props: {
    params: {
      type: Object,
    },
  },
  data() {
    return { loading: false, overviewData: null };
  },
  methods: {
    getTextColor(val) {
      return val > 0 ? "up" : "down";
    },
    getCompareVal(val, type) {
      if (type == "device") {
        return val > 0 ? `+ ${val}` : `-${Math.abs(val)}`;
      } else {
        return val > 0 ? `+ ${val / 10000}` : `-${Math.abs(val) / 10000}`;
      }
    },
    getClass(val) {
      return val > 0 ? "el-icon-top" : "el-icon-bottom";
    },
    async init() {
      this.loading = true;
      const { data } = await adsOverview(this.params);
      this.overviewData = data;
      this.loading = false;
    },
  },
  mounted() {
    // this.init();
  },
};
</script>
<style lang="scss" scoped>
.device_pV {
  margin-top: 10px;
  display: flex;
  li {
    background-color: #fff;
    flex: 1;
    height: 150px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: #333;
    > div {
      text-align: left;
      font-size: 16px;
      .count {
        color: #3ba0ff;
        font-size: 20px;
        margin-bottom: 8px;
        margin-top: 13px;
      }
      .result_container {
        display: flex;
        align-items: center;
        .compare_time {
          font-size: 14px;
        }
        .compare_value {
          font-size: 12px;
          margin-left: 13px;
        }
      }
      .result_container.up {
        .compare_value,
        i {
          color: #ff4747;
        }
      }
      .result_container.down {
        .compare_value,
        i {
          color: #54dcae;
        }
      }
    }
  }
  li.first {
    margin-right: 11px;
  }
}
</style>