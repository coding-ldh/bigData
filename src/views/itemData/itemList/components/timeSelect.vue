<template>
  <div style="display: inline-block; padding-right: 15px">
    <div class="dateRange_container">
      <!-- 选择日期： -->
      <el-date-picker
        :default-value="currentData"
        v-model="queryInfor.dateRange"
        type="daterange"
        range-separator="~"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        @change="changeDateRange"
        :picker-options="pickerOptions"
      ></el-date-picker>
      <span class="position_params_params" title="选择日期">选择日期： </span>
    </div>
  </div>
</template>

<script>
import { getCurrentDate } from "@/utils/tool.js";
export default {
  data() {
    return {
      currentData: "",
      queryInfor: {
        dateRange: [],
      },
      pickerOptions: {
        disabledDate: (time) => {
          return (
            time.getTime() > new Date(getCurrentDate(1)).getTime() ||
            time.getTime() < new Date("2019-01-01").getTime()
          );
        },
      },
    };
  },
  methods: {
    changeDateRange(val) {
      this.$emit("childChangeDateRange", val);
    },
    initCurrentDate() {
      let date = new Date();
      let y = date.getFullYear();
      let m = date.getMonth();
      if (m == 0) {
        y -= 1;
        m = 12;
      }
      this.currentData = `${y}-${m}`;
      // this.queryInfor.dateRange = [getCurrentDate(30 * 24), getCurrentDate(1)];
    },
    reset() {
      this.queryInfor.dateRange = ["", ""];
    },
  },
  mounted() {
    this.initCurrentDate();
    this.$emit("childChangeDateRange", (this.queryInfor.dateRange = ["", ""]));
  },
};
</script>

<style lang="scss" scoped>
.dateRange_container {
  position: relative;
  // display: inline-block;
  color: #333333;
  font-size: 14px;
  // margin-left: 10px;
  display: flex;
  align-items: center;
}
::v-deep .dateRange_container:hover .position_params_params {
  color: #008ff5;
}
</style>
