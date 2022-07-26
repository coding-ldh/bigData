<template>
  <div class="content">
    <el-table :data="adverPlanList" stripe style="width: 100%">
      <el-table-column
        type="selection"
        fixed="left"
        width="55"
      ></el-table-column>
      <el-table-column
        label="计划ID"
        prop="planId"
        align="center"
        width="115"
      ></el-table-column>
      <el-table-column label="计划名称" prop="planName"></el-table-column>
      <el-table-column
        label="已拉取设备量/总量"
        prop="pullVsPlanDevice"
        align="center"
      ></el-table-column>
      <el-table-column
        label="累计播放次数"
        prop="playCumulative"
        align="center"
        width="110"
      ></el-table-column>
      <el-table-column
        label="播放开始时间"
        prop="planBegin"
        align="center"
        width="150"
      ></el-table-column>
      <el-table-column
        label="播放结束时间"
        prop="planEnd"
        align="center"
        width="150"
      ></el-table-column>
      <el-table-column
        label="累计人流量"
        width="100"
        prop="trafficCumulative"
        align="center"
      ></el-table-column>
      <el-table-column
        label="累计转化量"
        width="100"
        prop="conversionCumulative"
        align="center"
      ></el-table-column>
      <el-table-column label="男女比例(%)" width="100" align="center">
        <template slot-scope="scope"
          >{{ scope.row.maleProportion }} /
          {{ scope.row.femaleProportion }}</template
        >
      </el-table-column>
      <el-table-column
        label="18-34岁占比(%)"
        prop="age1834Proportion"
        align="center"
        width="130"
      ></el-table-column>
      <el-table-column
        label="订单编号"
        prop="orderId"
        align="center"
        width="95"
      ></el-table-column>
      <el-table-column
        label="投放状态"
        prop="status"
        align="center"
      ></el-table-column>
      <el-table-column label="操作" width="100" fixed="right" align="center">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            @click="goDetailPage(scope.row.planId)"
            >投放详情</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  props: {
    adverPlanList: { type: Array, default: [] },
  },
  data() {
    return {};
  },
  methods: {
    goDetailPage(val) {
      this.$emit("Detail", val);
    },
  },
};
</script>

<style lang="scss" scoped>
// .content {
//   flex: 1;
//   display: flex;
//   flex-direction: column;
//   background-color: #fff;
//   padding-bottom: 20px;
// }
</style>
