<template>
  <div style="display: flex">
    <div class="dateRange_container">
      选择日期：
      <el-date-picker
        :default-value="currentData"
        v-model="queryInfor.dateRange"
        type="daterange"
        range-separator="～"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        @change="changeDateRange"
        :picker-options="pickerOptions"
      >
      </el-date-picker>
    </div>
  </div>
</template>

<script>
import { getCurrentDate } from "@/utils/tool.js";
export default {
  props: {
    // showOneDay: {
    //   type: Boolean,
    //   default: true
    // },
    // showYesterday: {
    //   type: Boolean,
    //   default: true
    // },
    resetIndex: Boolean,
  },
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
            time.getTime() < new Date("2021-04-14").getTime()
          );
        },
      },
    };
  },
  watch: {
    resetIndex: {
      handler: function (news, olds) {
        this.queryInfor.dateRange = [];
      },
    },
  },
  methods: {
    reset() {
      this.queryInfor.dateRange = [getCurrentDate(30 * 24), getCurrentDate(1)];
    },
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
    },
  },
  created() {
    this.queryInfor.dateRange = [getCurrentDate(1 * 24), getCurrentDate(1)];
  },
  mounted() {
    this.initCurrentDate();
    this.$emit("childChangeDateRange", this.queryInfor.dateRange);
  },
};
</script>

<style lang="scss" scoped>
.dateRange_container {
  color: #333333;
  font-size: 14px;
  // margin-left: 10px;
  display: flex;
  align-items: center;
}
</style>
