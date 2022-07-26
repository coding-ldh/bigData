<template>
  <div class="title_back">
    <div class="title" :style='{fontSize: titleFontSize}'>{{title}}</div>
    <span @click="back()">返回</span>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '基础信息'
    },
    titleFontSize: {
      type: String,
      default: '16px'
    }
  },
  methods: {
    back() {
      this.$emit('userBack');
    }
  }
};
</script>

<style lang="scss" scoped>
.title_back {
  display: flex;
  justify-content: space-between;
  padding-right: 20px;
  span {
    width: 96px;
    cursor: pointer;
    height: 36px;
    background: #64acff;
    border-radius: 6px;
    font-size: 16px;
    color: #fff;
    text-align: center;
    line-height: 36px;
  }
}
</style>