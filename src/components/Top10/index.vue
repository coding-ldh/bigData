<template>
  <li class="top10_container">
    <div class="title_rank_container">
      <div class="title">{{ title }}</div>
      <slot></slot>
    </div>
    <div class="rank_content">
      <el-table :data="tableData" class="el_table">
        <el-table-column type="index" label="名次" width="100">
        </el-table-column>
        <el-table-column
          v-for="(item, index) in propLableArr"
          :key="item.prop"
          :label="item.label"
          align="center"
          :width="index == 0 ? 400 : ''"
        >
          <template slot-scope="scope">
            <el-tooltip
              class="item"
              effect="dark"
              :content="scope.row[item.prop]"
              v-if="item.label == '设备类型'"
              placement="top-start"
            >
              <div :class="index == 0 ? 'content' : ''">
                {{ scope.row[item.prop] }}
              </div>
            </el-tooltip>
            <div :class="index == 0 ? 'content' : ''" v-else>
              {{ scope.row[item.prop] }}
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </li>
</template>

<script>
export default {
  props: {
    tableData: Array,
    propLableArr: Array,
    title: String
  }
};
</script>

<style lang="scss" scoped>
.top10_container {
  position: relative;
  flex: 1;
  background-color: #fff;
  flex-direction: column;
  height: 538px;

  .title_rank_container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-right: 30px;
    .title {
      color: #333333;
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 21px;
      padding-left: 30px;
      padding-top: 20px;
    }
  }
  .el_table {
    position: absolute;
  }
  .rank_content {
    position: relative;
    margin-left: 30px;
    margin-right: 30px;
    border: 1px solid #eeeeee;
    height: calc(100%-60px);
    .content {
      overflow: hidden;
      text-overflow: ellipsis;
      -o-text-overflow: ellipsis;
      -webkit-text-overflow: ellipsis;
      -moz-text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
</style>
