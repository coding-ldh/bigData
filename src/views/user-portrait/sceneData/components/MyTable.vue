<template>
  <el-collapse @change="closeOpenSceneTable">
    <el-collapse-item>
      <template slot="title">
        <div class="operate_container">
          <span>{{ showSceneDetail ? "收起明细数据" : "展开明细数据" }}</span>
          <el-button type="primary" @click="userExport()">导出excel</el-button>
        </div>
      </template>
      <div class="table_content">
        <el-table :data="tableObj.list" style="width: 100%">
          <el-table-column
            v-for="(item, index) in getKeys()"
            :key="index"
            :prop="item"
            :label="tableObj.header[0][item]"
          >
          </el-table-column>
        </el-table>
        <pagination
          :total="tableObj.total"
          @pageChange="turnPage"
          @sizeChange="sizeChange"
        ></pagination>
      </div>
    </el-collapse-item>
  </el-collapse>
</template>

<script>
import pagination from "@/components/Pagination/index.vue";
export default {
  components: {
    pagination
  },
  props: {
    tableObj: Object
  },
  data() {
    return {
      showSceneDetail: false
    }
  },
  methods: {
    closeOpenSceneTable(val) {
      if(val.length == 0){
        this.showSceneDetail = false;
      }else{
        this.showSceneDetail = true;
      }
    },
    getKeys(){
      if(this.tableObj.header.length != 0){
        return Object.keys(this.tableObj.header[0]);
      }
    },
    turnPage(val){
      this.$emit("turnPage", val);
    },
    sizeChange(){
      this.$emit("sizeChange", val);
    },
    userExport(){
      this.$emit("userExport");
    }
  },
};
</script>
<style lang="scss">
.el-collapse {
  border-top: none;
  .el-collapse-item__header {
    border-bottom: none;
    .el-collapse-item__arrow {
      display: none;
    }
  }
  .el-collapse-item__wrap {
    border-bottom: none;
  }
}
div.operate_container {
  padding: 10px 20px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  > span {
    font-size: 14px;
    color: #0f79db;
    cursor: pointer;
  }
}
</style>