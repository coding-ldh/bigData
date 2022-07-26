<template>
  <div style="display: flex">
    <el-select
      v-model="queryInfor.period"
      placeholder="请选择"
      @change="changePeriod"
    >
      <el-option
        v-for="item in periodList"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      >
      </el-option>
    </el-select>
    <div class="dateRange_container">
      选择日期：
      <el-date-picker
        :default-value="currentData"
        v-model="queryInfor.dateRange"
        type="daterange"
        range-separator="～"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd"
        :disabled="queryInfor.period != -1"
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
    showOneDay: {
      type: Boolean,
      default: true,
    },
    showYesterday: {
      type: Boolean,
      default: true,
    },
    defaultTime: {
      type: Number,
      default: 0,
    },
    resetIndex: Boolean,
  },
  data() {
    return {
      currentData: "",
      queryInfor: {
        period: 30,
        dateRange: [],
      },
      periodList: [
        { label: "最近30天", value: 30 },
        // { label: "最近7天", value: 7 },
        // { label: "今天", value: 1 },
        { label: "自定义", value: -1 },
      ],
      pickerOptions: {
        disabledDate: (time) => {
          // console.log(time)
          return (
            time.getTime() >
              new Date(getCurrentDate(this.defaultTime)).getTime() ||
            time.getTime() < new Date("2021-04-14").getTime()
          );
        },
      },
    };
  },
  watch: {
    "queryInfor.period": {
      immediate: true,
      handler: function (val) {
        if (val != -1) {
          val = val == 1 ? 0 : val - 1;
          this.queryInfor.dateRange = [
            getCurrentDate(val * 24),
            getCurrentDate(this.defaultTime),
          ];
        } else {
          this.queryInfor.dateRange = [];
        }
      },
    },
    resetIndex: {
      handler: function (news, olds) {
        this.queryInfor.period = 30;
      },
    },
  },
  methods: {
    changePeriod(val) {
      if (val != -1) {
        this.$emit("childChangePeriod", val);
      }
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
    if (!this.showOneDay) {
      this.periodList = [
        { label: "最近30天", value: 30 },
        // { label: "最近7天", value: 7 },
        { label: "自定义", value: -1 },
      ];
    }
    if (!this.showYesterday) {
      this.periodList = this.periodList.filter((item) => item.value != 1);
    }
  },
  mounted() {
    this.initCurrentDate();
  },
};
</script>

<style lang="scss" scoped>
.dateRange_container {
  color: #333333;
  font-size: 14px;
  margin-left: 10px;
  display: flex;
  align-items: center;
}
</style>
