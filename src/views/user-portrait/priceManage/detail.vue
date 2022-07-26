<template>
  <div class="container">
    <div class="basic_infor_container">
      <user-back @userBack="useBack()"></user-back>
      <ul v-if="baseInfor != null">
        <li>设备编号：{{ baseInfor.mid }}</li>
        <li>剩余广告位：{{ baseInfor.usedPicture }}</li>
        <li>
          男女比例：{{ baseInfor.avgMaleProportion }}% /
          {{ baseInfor.avgFemaleProportion }}%
        </li>
        <li>18-34岁占比：{{ baseInfor.avgAge1834Proportion }}%</li>
        <li>日均流量：{{ baseInfor.avgTraffic }}</li>
        <li>观看2s以上人流量：{{ baseInfor.watch }}</li>
        <li>设备类型：{{ baseInfor.deviceType }}</li>
        <li>行业：{{ baseInfor.projectScene }}</li>
        <li>是否有订单：{{ baseInfor.isOrder }}</li>
        <li>项目地址：{{ baseInfor.projectAddr }}</li>
        <li>日均观看时长：{{ baseInfor.watchAvg }}</li>
      </ul>
    </div>
    <div class="ads_material_container">
      <p style="">广告素材列表</p>
      <el-form :inline="true" :model="queryInfor" class="demo-form-inline">
        <el-form-item label="素材名称">
          <el-input
            v-model="queryInfor.resourceName"
            placeholder="请输入素材名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="投放计划名称">
          <el-input
            placeholder="请输入投放计划名称"
            v-model="queryInfor.planName"
          ></el-input>
        </el-form-item>
        <el-form-item label="投放计划状态">
          <el-select v-model="queryInfor.planState">
            <el-option
              v-for="item in planStateList"
              :key="item"
              :value="item"
              :label="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getList()">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" plain @click="userReset">重置</el-button>
        </el-form-item>
      </el-form>
      <div class="imgLoupe">
        <img v-show="imgShow" class="imgAndvideo" src="" alt="" />
        <video
          v-show="!imgShow"
          class="imgAndvideo"
          autoplay="autoplay"
          loop="loop"
          muted
          controls
          src=""
          alt=""
        />
      </div>
      <el-table
        :data="advMaterialList"
        stripe
        style="width: 100%"
        v-loading="loading"
      >
        <el-table-column
          prop="resourceName"
          label="素材名称"
          width="120"
          align="center"
        ></el-table-column>
        <el-table-column label="缩略图" align="center" width="150">
          <template slot-scope="scope">
            <img
              :src="scope.row.resourceUrl"
              alt
              style="width: 40px; height: 71px"
              @mouseenter="imgEnter($event, scope.row.resourceUrl, 'img')"
              @mouseleave="imgLeave()"
              @error="imgError($event, scope.row.resourceUrl)"
            />
            <video
              alt
              style="display: none; width: 40px; height: 71px"
              @mouseenter="imgEnter($event, scope.row.resourceUrl, 'video')"
              @mouseleave="imgLeave()"
              @error="videoError($event)"
            />
            <img style="display: none; width: 40px; height: 71px" />
          </template>
        </el-table-column>
        <el-table-column
          prop="planDuring"
          label="播放时间段"
          width="300"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="planName"
          label="所属计划"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="planState"
          width="90"
          label="计划状态"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="planDaysVsCumulate"
          label="已播天数/总投放天数"
          width="160"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="playCountsCumulate"
          label="当前累计播放次数"
          width="140"
          align="center"
        ></el-table-column>
        <el-table-column
          label="当前累计播放时长"
          width="140"
          align="center"
          prop="playTimeCumulate"
        ></el-table-column>
        <el-table-column
          prop="exposureCountsVsCumulate"
          label="昨日流量/累计流量"
          width="140"
          align="center"
        ></el-table-column>
        <!-- <el-table-column
          prop="conversionConutsVsCumulate"
          label="昨日转化/累计转化量"
          align="center"
        >
        </el-table-column>-->
      </el-table>
      <pagination
        :total="advMaterialTotal"
        @pageChange="pageChange"
        @sizeChange="sizeChange"
      ></pagination>
    </div>
  </div>
</template>

<script>
import pagination from "@/components/Pagination/index.vue";
import { reset } from "@/utils/tool.js";
import UserBack from "@/components/UserBack";
import { getAdvMaterialList, advMaterialBaseInfo } from "@/api/userPortrait";
import ImgLoupe from "@/components/ImgLoupe/ImgLoupe.vue";
import { MillisecondToDate } from "@/utils/tool.js";
export default {
  mixins: [ImgLoupe],
  components: {
    pagination,
    UserBack,
  },
  props: {
    show: Boolean,
    mid: String,
    currentItem: String,
  },
  data() {
    return {
      loading: false,
      advMaterialList: [],
      advMaterialTotal: 1,
      queryInfor: {
        planName: "",
        resourceName: "",
        planState: "",
      },
      planStateList: ["投放中", "暂停中", "未开始", "已结束", "已取消"],
      pageInfor: {
        pageNo: "",
        pageSize: "",
      },
      baseInfor: null,
      screen: "1",
    };
  },
  methods: {
    useBack() {
      this.$emit("back");
    },
    userReset() {
      reset(this.queryInfor);
      this.getList();
    },
    async getList(pageNo = 1, pageSize = 10) {
      this.loading = true;
      const { data } = await getAdvMaterialList({
        pageNo,
        pageSize,
        mid: this.mid,
        resourceName: this.queryInfor.resourceName,
        planName: this.queryInfor.planName,
        screen: this.screen,
        planState: this.queryInfor.planState,
      });
      this.advMaterialList = data.records;
      this.advMaterialTotal = data.total;
      this.loading = false;
    },
    pageChange(val) {
      this.pageInfor.pageNo = val;
      this.getList(val, this.pageInfor.pageSize);
    },
    sizeChange(val) {
      this.pageInfor.pageSize = val;
      this.getList(this.queryInfor.pageNo, val);
    },
    getBaseInfor() {
      advMaterialBaseInfo({ mid: this.mid }).then(({ data }) => {
        this.baseInfor = data;
        let tempData = MillisecondToDate(data.watchAvg).toString();
        this.baseInfor.watchAvg = `${tempData.slice(0, 2)}小时${tempData.slice(
          3,
          5
        )}分钟${tempData.slice(6, 8)}秒`;
      });
    },
  },
  created() {
    this.screen = this.currentItem;
    this.getBaseInfor();
    this.getList();
  },
};
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  .ads_material_container {
    background-color: #fff;
    padding: 20px;
    margin-top: 10px;
    p {
      font-size: 16px;
      font-weight: 700;
      margin-bottom: 15px;
    }
    .imgLoupe {
      position: fixed;
      z-index: 999;
      top: 0;
      left: 50%;
      width: 0px;
      aspect-ratio: 9/16;
      height: 100%;
      opacity: 0;
      transition: all 0.3s;
      box-shadow: 0 0 10px 0 #4e4e4e;
      overflow: hidden;
      background: #fff;
      .imgAndvideo {
        position: absolute;
        min-height: 300px;
        width: 100%;
        height: 100%;
        top: 0;
      }
    }
  }
}
</style>