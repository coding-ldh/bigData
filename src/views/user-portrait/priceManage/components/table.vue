<template>
  <div class="content">
    <el-table :data="adPriceList" stripe style="width: 100%">
      <el-table-column type="selection" fixed="left" width="55" />
      <el-table-column label="设备编号" width="140" prop="mid" align="center" />
      <el-table-column
        label="设备类型"
        width="110"
        prop="deviceType"
        align="center"
      />
      <el-table-column
        label="硬件类型"
        width="110"
        prop="fireware"
        align="center"
      />
      <el-table-column label="售卖类型" prop="sellMode" align="center">
        <template slot-scope="scope">{{
          scope.row.sellMode ? scope.row.sellMode : "未分类"
        }}</template>
      </el-table-column>
      <el-table-column
        label="项目名称"
        width="100"
        prop="projectName"
        align="center"
      />
      <el-table-column
        label="版本号"
        width="100"
        prop="version"
        align="center"
      />
      <el-table-column
        label="昨日在线时长"
        prop="onlineDt"
        width="125"
        align="center"
        v-if="adPriceList"
      >
        <template slot-scope="scope">{{ scope.row.onlineDt }}小时</template>
      </el-table-column>
      <el-table-column
        label="最近7日在线时长"
        prop="online7Dt"
        width="145"
        align="center"
        v-if="adPriceList"
      >
        <template slot-scope="scope">{{
          CurrentTime(scope.row.online7Dt * 60 * 60 * 1000, 7)
        }}</template>
      </el-table-column>
      <el-table-column
        label="最近30日在线时长"
        prop="online30Dt"
        width="155"
        align="center"
        v-if="adPriceList"
      >
        <template slot-scope="scope">{{
          CurrentTime(scope.row.online30Dt * 60 * 60 * 1000, 30)
        }}</template>
      </el-table-column>
      <el-table-column
        label="日均观看时长"
        prop="watchAvg"
        width="150"
        align="center"
        v-if="adPriceList"
      >
        <template slot-scope="scope">{{
          CurrentTime(scope.row.watchAvg)
        }}</template>
      </el-table-column>
      <el-table-column
        label="场景"
        prop="projectType"
        width="80"
        align="center"
      />
      <el-table-column
        label="是否允许投放商业广告"
        prop="isAdverAllow"
        width="160"
        align="center"
      />
      <el-table-column
        label="是否有订单"
        prop="isOrder"
        width="100"
        align="center"
      />
      <el-table-column
        label="项目地址"
        prop="projectAddr"
        width="200"
        align="center"
      />
      <el-table-column
        label="设备地址"
        prop="customerAddr"
        width="220"
        align="center"
      />
      <el-table-column label="行业" prop="projectScene" align="center" />
      <el-table-column label="屏幕大小" prop="screenSize" align="center" />
      <el-table-column
        label="剩余广告位"
        prop="usedPicture"
        width="90"
        align="center"
      />
      <el-table-column label="日均流量" prop="avgTraffic" align="center" />
      <el-table-column
        label="观看2s以上"
        prop="watch"
        width="100"
        align="center"
      />
      <el-table-column
        label="男性占比(%)"
        prop="avgMaleProportion"
        width="100"
        align="center"
      />
      <el-table-column
        label="女性占比(%)"
        prop="avgFemaleProportion"
        width="100"
        align="center"
      />
      <el-table-column
        label="18-34岁占比(%)"
        width="130"
        prop="avgAge1834Proportion"
        align="center"
      />
      <el-table-column label="售价" prop="price" align="center" />
      <el-table-column
        v-for="(item, index) in adPriceList[0]
          ? adPriceList[0].eachDayTraffic
          : []"
        :key="index"
        :label="`${index}(当日流量)`"
        align="center"
        width="95"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.eachDayTraffic[index] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="190" align="center">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            @click="goDetail(scope.row.mid, 'detailPage', '1')"
            >大屏投放详情</el-button
          >
          <el-button
            type="text"
            size="small"
            @click="goDetail(scope.row.mid, 'flowDetail')"
            >流量画像</el-button
          >
          <el-button
            type="text"
            size="small"
            @click="goDetail(scope.row.mid, 'detailPage', '2')"
            >小屏投放详情</el-button
          >
          <el-button
            type="text"
            size="small"
            @click="goDetail(scope.row.mid, 'onLineTime', scope.row)"
            >在线时长</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <pagination
      :total="adPriceTotal"
      :current-page="pageInfor.pageNo"
      @pageChange="pageChange"
      @sizeChange="sizeChange"
    />
  </div>
</template>

<script>
import pagination from "@/components/Pagination/index.vue";
import { getCurrentTime } from "@/utils/tool";
export default {
  components: {
    pagination,
  },
  props: {
    adPriceList: {
      type: Array,
    },
    pageInfor: {
      type: Object,
    },
    adPriceTotal: {
      type: Number,
    },
  },
  data() {
    return {
      // mid: "", // 点击跳转流量画像详情需要的设备编号
    };
  },
  created() {},
  methods: {
    CurrentTime(data, index) {
      if ([7, 30].indexOf(index) != -1) {
        if (data == 0) {
          return `0秒`;
        } else {
          return getCurrentTime(data / 1000, "min");
        }
      } else {
        return getCurrentTime(data / 1000);
      }
    },
    goDetail(mid, name, item = {}) {
      let data = {
        mid: mid,
        showDetailName: name,
        currentItem: item,
        showDetailPage: true,
      };
      this.$emit("GoDetail", data);
    },

    pageChange(val) {
      this.pageInfor.pageNo = val;
      this.$emit("ChangePageNo", val);
    },
    sizeChange(val) {
      this.pageInfor.pageSize = val;
      this.$emit("ChangePageSize", val);
    },
  },
};
</script>

<style lang="scss" scoped>
.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #fff;
}
.el-button--small {
  margin: 0 10px;
}
</style>
