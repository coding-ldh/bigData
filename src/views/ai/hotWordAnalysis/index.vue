<template>
  <!-- <ad-detail
    :planId="planId"
    v-if="$store.state.settings.showDetailPage"
  ></ad-detail>-->
  <!-- v-else -->
  <div class="container">
    <el-form :inline="true" :model="queryInfor" class="demo-form-inline">
      <div class="container_title">语义-热词分析</div>
      <el-form-item label="设备id">
        <el-input
          v-model="queryInfor.planId"
          placeholder="请输入设备id"
        ></el-input>
      </el-form-item>
      <div style="display: inline-block; margin: 0px 10px 0px;">
        <el-form-item>
          <time-select
            @childChangePeriod="changePeriod"
            @childChangeDateRange="changeDateRange"
            :resetIndex="resetIndex"
          ></time-select>
        </el-form-item>
      </div>
      <el-form-item label="行业">
        <el-select v-model="queryInfor.sceen" placeholder="请选择">
          <el-option
            v-for="item in sceen"
            :key="item"
            :label="item"
            :value="item"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="地区">
        <my-area @fromChildArea="getAreaData" ref="myAreaClear"></my-area>
      </el-form-item>
      <el-form-item label="设备类型">
        <el-select v-model="queryInfor.planType" placeholder="请选择">
          <el-option
            v-for="item in planType"
            :key="item"
            :label="item"
            :value="item"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="选择子公司">
        <el-select v-model="queryInfor.subsidiary" placeholder="请选择">
          <el-option
            v-for="item in subsidiary"
            :key="item"
            :label="item"
            :value="item"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="项目">
        <el-select
          v-model="queryInfor.item"
          filterable
          remote
          reseve-keyword
          allow-create
          placeholder="输入项目"
          :remote-method="changeItem"
          clearable
        >
          <el-option
            v-loading="itemLoading"
            v-for="item in getItem"
            :key="item"
            :label="item"
            :value="item"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="saveParamList(), search()"
          >查询</el-button
        >
      </el-form-item>
      <el-form-item>
        <el-button type="primary" plain @click="userReset">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="key_content">
      <div class="key_word_cloud">
        <div class="word_cloud_analysis">关键词词云</div>
        <div class="analysis_svg" v-loading="cloudLoading">
          <key-word-cloud
            :colors="keyWOrdColor"
            :svgData="detailListAll"
            @duringClick="searchKey"
          ></key-word-cloud>
        </div>
      </div>
      <div class="key_word_search">
        <div class="dialog_search">对话搜索</div>
        <el-form>
          <el-form-item>
            <el-input
              clearable
              v-model="queryInfor.planName"
              placeholder="请输入查询信息"
              @change="searchKey()"
            ></el-input>
            <el-button type="primary" plain @click="searchKey()"
              >搜索</el-button
            >
          </el-form-item>
        </el-form>
        <div class="key_word_dialog_box">
          <div class="noDataShow" v-if="!dialogData.length">
            木有找到数据哦~
          </div>
          <ul v-else v-loading="detailLoading">
            <li
              v-for="(item, index) in dialogData"
              :key="index"
              :title="item.title"
              @click="detailCheck(item.title)"
            >
              <i class="iconfont icon-liaotian"></i>
              {{ item.header }}
              <span
                v-for="(word, sentenceIndex) in item.sentence"
                :key="sentenceIndex"
              >
                <span class="key_color">{{ item.keyWord }}</span>
                <span>{{ word.puzzle }}</span>
              </span>
              <p class="key_word_dialog_time">{{ item.time }}</p>
            </li>
          </ul>
        </div>
        <hot-pagination
          :current-page="pageInforSearch.pageNo"
          :total="searchTotal"
          @sizeChange="sizeChangeSearch"
          @pageChange="pageChangeSearch"
        ></hot-pagination>
      </div>
    </div>
    <div class="key_word_detail_data">
      <div class="key_word_detail_title">
        <div class="detail_tital">关键词详细数据</div>
        <el-form>
          <el-button type="primary" plain @click="exportData()"
            >导出数据</el-button
          >
        </el-form>
      </div>
      <div class="detail_list">
        <div class="detail_list_title">
          <span>排序</span>
          <span>关键词</span>
          <span>频次</span>
        </div>
        <ul v-loading="listLoading">
          <li v-for="(item, index) in detailList" :key="index">
            <span>{{ index + 1 }}</span>
            <span>{{ item.key }}</span>
            <span>{{ item.count }}</span>
          </li>
        </ul>
        <hot-pagination
          :current-page="pageInfor.pageNo"
          layout="total, sizes, prev, pager, next, jumper"
          :total="listTotal"
          :pager-count="9"
          @sizeChange="sizeChange"
          @pageChange="pageChange"
        ></hot-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import pagination from "@/components/Pagination/index.vue";
import { getCurrentDate, userExport, cacheParamList } from "@/utils/tool.js";
import { reset } from "@/utils/tool.js";
import TimeSelect from "./component/TimeSelect.vue";
import HotPagination from "./component/HotPagination";
import MyArea from "./component/Area";
import KeyWordCloud from "./component/KeyWordCloud.vue";
import {
  getHotWordList,
  getHotWordDetail,
  getParamList,
  getParamItem,
} from "@/api/ai/index.js";
export default {
  components: {
    pagination,
    TimeSelect,
    MyArea,
    HotPagination,
    KeyWordCloud,
  },
  data() {
    return {
      // 控制loading展示
      cloudLoading: false,
      listLoading: false,
      detailLoading: false,
      itemLoading: true,
      // 重置日期参数
      resetIndex: false,
      searchKeyWord: "", // 关键词cache
      queryInfor: {
        // 参数列表
        planId: "",
        startTime: "",
        endTime: "",
        sceen: [],
        area: ["", "", ""],
        planType: "",
        subsidiary: "",
        item: "",
        planName: "", // 搜索框参数
      },
      getItem: [], // item模糊查询cache
      cacheQueryInfor: {}, // 缓存参数，使用缓存数据在点击标签时获取数据
      Top10KeyWord: [],
      dialogData: [
        // {
        //   title: `设备号: "YHPR1151A00200SZGM0921000726\n类型: "智能访客机器人"\n省: "河北"\n市: "保定市"\n行业: "酒店住宿"\n项目: "汇元"\n子公司: "bdam2021"`,
        //   keyWord: "老板",
        //   header: "煤",
        //   sentence: [
        //     { puzzle: "心里苦啊" },
        //     { puzzle: "们心里有苦说不出" }
        //   ],
        //   time: "2000-01-01 00:00:01"
        // }
      ],
      detailListAll: [0],
      detailList: [
        // { key: "老板", count: 88888888 },
      ],
      sceen: ["全部", "政府"],
      planType: ["乐乐", "欢欢"],
      subsidiary: ["科卫机器人", "中智卫安"],
      pageInforSearch: {
        // search 页码与分页方式
        pageNo: 1,
        pageSize: 5,
      },
      searchTotal: 0,
      pageInfor: {
        // 页码与分页方式
        pageNo: 1,
        pageSize: 10,
      },
      listTotal: 100,
      keyWOrdColor: [
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
  computed: {},
  watch: {
    detailListAll: (news, old) => {
      // console.log(news,old)
    },
  },
  methods: {
    getAreaData(val) {
      this.queryInfor.area = val;
    },
    initParamList() {
      // 初始化参数列表
      getParamList().then((data) => {
        this.sceen = data.data.projectIndustryList;
        this.planType = data.data.deviceTypeList;
        this.subsidiary = data.data.projectUserList;
        this.search();
      });
    },
    saveParamList() {
      // 点击查询时 保存当前顶部参数
      this.cacheQueryInfor = cacheParamList(this.queryInfor);
    },
    userReset() {
      // 重置参数为空
      this.$refs.myAreaClear.reset();
      this.resetIndex = !this.resetIndex;
      reset(this.queryInfor);
      this.search();
    },
    sizeChangeSearch(val) {
      // 更改分页方式
      this.pageInforSearch.pageSize = val;
      this.pageInforSearch.pageNo = 1;
    },
    sizeChange(val) {},
    pageChangeSearch(val) {
      // 更改search页码
      this.pageInforSearch.pageNo = val;
      this.searchKey(
        this.pageInforSearch.pageNo,
        this.pageInforSearch.pageSize,
        true
      );
    },
    pageChange(val) {
      // 更改list页码
      this.pageInfor.pageNo = val;
      let index = val * 10;
      this.detailList = this.detailListAll.slice(index - 10, index);
    },
    search() {
      // 页面查询，联动搜索(detail)查询
      this.saveParamList();
      this.cloudLoading = true;
      this.detailLoading = true;
      this.listLoading = true;
      this.cacheQueryInfor = this.queryInfor;
      this.$set(this.pageInfor, "pageNo", 1);
      this.$set(this.pageInforSearch, "pageNo", 1);
      let {
        planId,
        startTime,
        endTime,
        sceen,
        area,
        planType,
        subsidiary,
        item,
      } = this.queryInfor;
      getHotWordList({
        deviceType: planType,
        endTime,
        mid: planId,
        projectCityList: area[1],
        projectIndustry: sceen,
        projectName: item,
        projectProvince: area[0],
        projectUser: subsidiary,
        startTime,
      }).then((data) => {
        if (data.data.length !== 0) {
          this.detailListAll = data.data;
          this.listTotal = Math.floor(data.data.length);
          this.detailList = data.data.slice(0, 10); // 分页处理
          this.Top10KeyWord = data.data.slice(0, 10); // 分页处理
          this.searchKeyWord = this.Top10KeyWord[0].key; // 展示十个关键字
          this.queryInfor.planName = data.data.slice(0, 1)[0].key; // 存关键字

          this.cloudLoading = false;
          this.listLoading = false;
          this.searchKey();
        } else {
          this.dialogData = [];
          this.Top10KeyWord = "";
          this.queryInfor.planName = "";
          this.detailListAll = [];
          this.detailList = [];
          this.cloudLoading = false;
          this.listLoading = false;
          this.searchTotal = 200;
        }
      });
    },
    searchKey(page = 1, pageSize = 5, cache, key) {
      // console.log(page,pageSize,cache,key)
      // 搜索(detail)查询
      if (!cache) {
        this.$set(this.pageInforSearch, "pageNo", 1);
      }
      if (key) {
        this.queryInfor.planName = key;
      }
      this.detailLoading = true;
      let {
        planId,
        startTime,
        endTime,
        sceen,
        area,
        planType,
        subsidiary,
        item,
        planName,
      } = cache ? this.cacheQueryInfor : this.queryInfor;

      getHotWordDetail({
        ciotText: planName,
        deviceType: planType,
        endTime,
        mid: planId,
        pageNo: page,
        pageSize,
        projectCityList: area[1],
        projectIndustry: sceen,
        projectName: item,
        porjectProvince: area[0],
        projectUser: subsidiary,
        startTime,
      }).then((data) => {
        this.searchTotal =
          data.data.total / 5 > 20 ? 200 : (data.data.total / 5) * 10;
        if (data.data.records.length != 0) {
          this.dialogData = [];
          let arr = data.data.records.map((item) => {
            return this.extractKey(
              item.ciotText,
              planName,
              item.timestamp,
              item
            );
          });
          this.dialogData = arr;
          this.detailLoading = false;
        } else {
          this.dialogData = [];
          this.detailLoading = false;
        }
      });
    },
    detailCheck(msg) {
      // 对话搜索，点击时复制信息
      // const h = this.$createElement;
      this.$notify.info({
        title: "详细信息",
        message: `${msg}`,
        duration: 5000,
        customClass: "Top_right_info_for_HotWord_detail",
      });
    },
    changeItem(val) {
      // 项目参数的模糊查询
      this.itemLoading = true;
      let {
        sceen,
        area,
        planType,
        subsidiary,
        item,
        // planName
      } = this.queryInfor;
      getParamItem({
        deviceType: planType,
        projectCity: area[1],
        porjectIndustry: sceen,
        projectName: val,
        porjectProvince: area[0],
        projectUser: subsidiary,
      }).then((data) => {
        this.getItem = data.data;
        this.itemLoading = false;
      });
    },
    changePeriod(val) {
      // 日期控件的选择日期
      if (val != -1) {
        this.queryInfor.startTime = getCurrentDate(val * 24);
        this.queryInfor.endTime = getCurrentDate(1);
      }
    },
    changeDateRange(val) {
      // 日期控件的自定义日期
      this.queryInfor.startTime = val[0];
      this.queryInfor.endTime = val[1] || "";
    },
    extractKey(string, key, time, item) {
      // 对话搜索详情数据，数据高亮处理
      // console.log(string, time);
      if (key.match(/^[ ]*$/) || key == "  " || !key) {
        // key 为空或空格，代表查询全部
        return { keyWord: "", sentence: [{ puzzle: string }], time: time };
      }
      let obj = {
        title:
          `类型：${item.deviceType}\n` +
          `地区：${item.projectProvince} ${item.projectCity} \n` +
          `行业：${item.projectIndustry}\n` +
          `项目：${item.projectName}\n` +
          `子公司：${item.projectUser}\n` +
          `设备号：${item.mid}\n`,
        keyWord: key,
        sentence: [],
        time: time,
      };
      let length = key.length;
      let strIndex = -1;
      strIndex = string.indexOf(key);
      // 头处理
      if (strIndex == 0) {
        // 如果key在头部 为header赋空
        obj.header = "";
        string = string.slice(strIndex + length); // 说只要做出来就行
        if (string.indexOf(key) != -1) {
          /*
          思路， 对string存在key  保存前一部分进puzzle  没有，则为puzzle赋空，最后返回
        */
          obj.sentence = this.extract(string, key, length);
        } else {
          obj.sentence = [{ puzzle: string }];
        }
      } else {
        obj.header = string.slice(0, strIndex); // key 不在头部 ，对header赋值 = 起始到key之前
        string = string.slice(strIndex + length); // 截取key之后的值使用
        if (string.indexOf(key) != -1) {
          obj.sentence = this.extract(string, key, length);
        } else {
          obj.sentence = [{ puzzle: string }];
        }
      }
      return obj;
    },
    extract(str, key, len) {
      // 对话详情数据，多关键字高亮处理
      let arr = [];
      while (str.indexOf(key) != 0 && str.indexOf(key) != -1) {
        let puzzle = { puzzle: "" };
        let strIndex = str.indexOf(key);
        puzzle.puzzle = str.slice(0, strIndex);
        str = str.slice(strIndex + len);
        arr.push(puzzle);
      }
      if (str.indexOf(key) == 0) {
        arr.push({ puzzle: "" });
      } else {
        arr.push({ puzzle: str });
      }
      return arr;
    },
    exportData() {
      // 导出功能
      this.$message.success(`导出中，请稍等`);
      let url =
        `/aiHotWord/export?` +
        `&fileName=关键词列表` +
        `&endTime=${this.cacheQueryInfor.endTime}` +
        `&startTime=${this.cacheQueryInfor.startTime}` +
        `&deviceType=${this.cacheQueryInfor.planType}` +
        `&mid=${this.cacheQueryInfor.planId}` +
        `&projectCityList=${this.cacheQueryInfor.area[0]}` +
        `&projectIndustry=${this.cacheQueryInfor.sceen}` +
        `&projectName=${this.cacheQueryInfor.item}` +
        `&projectProvince=${this.cacheQueryInfor.area[1]}` +
        `&projectUser=${this.cacheQueryInfor.subsidiary}`;
      userExport(url);
    },
  },
  created() {
    console.log("%c Hot Word!", "color:red ;font-size:1.5rem;");
  },

  mounted() {
    this.initParamList();
  },
};
</script>

<style lang="scss" scoped>
.container {
  .el-pagination {
    padding: 20px;
    text-align: center;
  }
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  .container_title {
    margin: 0px 20px 20px 0px;
    font-size: 20px;
    color: #333;
  }
  .el-form {
    background-color: #fff;
    padding: 20px;
    padding-bottom: 0;
    margin-bottom: 10px;
  }
  //   .el-date-editor {
  //     width: 195px;
  //   }
  .key_content {
    width: 100%;
    background: #fff;
    display: flex;
    .key_word_cloud {
      // background: crimson;
      width: 50%;
      .word_cloud_analysis {
        font-size: 20px;
        margin: 20px;
        color: #333;
      }
      .analysis_svg {
        height: 480px;
        margin: 20px;
        // background: cyan;
        border: dashed 1px #c0c4cc;
        flex: 1;
      }
    }
    .key_word_search {
      width: 50%;
      margin-bottom: 20px;
      .dialog_search {
        font-size: 20px;
        margin: 20px;
        color: #333;
      }
      .el-form {
        padding: 0;
        .el-form-item {
          margin-bottom: -5px;
        }
      }
      .el-input {
        margin: 0px 0px 15px 0px;
        width: 80%;
      }
      .el-buttom {
        width: 20%;
      }
      .key_word_dialog_box {
        padding: 15px 15px 15px 15px;
        margin-right: 15px;
        border-radius: 15px;
        // height:100%;
        height: 370px;
        background: #f7f7f7;
        overflow: hidden;
        .noDataShow {
          font-size: 26px;
          color: #6a6a6a;
          text-align: center;
          height: 340px;
          line-height: 340px;
        }
        ul {
          height: 340px;
          // overflow:auto;
          // background: rgb(223, 223, 223);
          li {
            list-style: disc;
            color: #6a6a6a;
            font-size: 14px;
            height: 68px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            padding: 10px 0px 0px 0px;
            cursor: pointer;
            // margin-left:50px;
            .key_color {
              color: #1890ff;
            }
            .key_word_dialog_time {
              margin: 0;
              color: #9c9c9c;
              padding: 6px 0px 10px 20px;
            }
          }
        }
      }
    }
  }
  .key_word_detail_data {
    background: #fff;
    margin-top: 15px;
    padding: 20px;
    .key_word_detail_title {
      display: flex;

      .detail_tital {
        font-size: 20px;
        width: 90%;
      }
      .el-form {
        padding: 0px;
        width: 10%;
      }
    }
    .detail_list {
      .detail_list_title {
        display: flex;
        span {
          display: inline-block;
          width: 33%;
          text-align: center;
          padding: 15px;
          font-size: 16px;
          font-weight: bold;
          background: #f7f8fd;
          color: #333;
        }
      }

      ul li:nth-child(2n + 1) {
        background: #f7f8fd;
      }
      ul li {
        display: flex;
        span {
          display: inline-block;
          width: 33%;
          text-align: center;
          font-size: 16px;
          color: rgb(125, 125, 125);
          padding: 10px;
        }
      }
      ul li:hover {
        background: #e6f7ff;
      }
    }
  }
}
// ::v-deep .el-notification {
//   white-space: pre-wrap !important;
// }
</style>
<style>
.Top_right_info_for_HotWord_detail {
  white-space: pre-wrap !important;
}
</style>
