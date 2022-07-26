<template>
  <el-tooltip
    class="item"
    effect="dark"
    placement="top-start"
  >
    <div slot="content" v-html="content"></div>
    <i class="el-icon-question"></i>
  </el-tooltip>
</template>

<script>
export default {
  props: {
    content: String
  }
};
</script>

<style lang="scss" scoped>
.item{
  margin-left: 10px;
  color: #DDDDDD;
}
</style>