<template>
  <div class="pageContainer">
    <!-- :hide-on-single-page="true" -->
    <el-pagination
      :current-page="currentPage"
      background
      :page-sizes="[10, 20, 30, 40]"
      :page-size="10"
      :layout="layout"
      :total="total"
      :hide-on-single-page="true"
      @current-change="change"
      @size-change="changeSize"
    >
    </el-pagination>
  </div>
</template>

<script>
export default {
  props:{
    total:Number,
    currentPage: {
      type: Number,
      default: 1
    },
    layout:{
      type:String,
      default:"total, sizes, prev, pager, next, jumper"
    }
  },
  methods: {
    change(val) {
      this.$emit("pageChange", val);
    },
    changeSize(val){
      this.$emit("sizeChange", val);
    }
  },
};
</script>

<style lang="scss" scoped>
.pageContainer {
  display: flex;
  justify-content: center;
  margin-top:20px;
  margin-bottom:20px;
}
</style>