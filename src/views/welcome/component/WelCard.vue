<template>
  <el-col :md="md" :lg="lg" :xl="xl">
    <el-card>
      <template #header>
        <div class="welcome_header">
          <span class="title">{{ title }}</span>
          <router-link class="circle" :to="redirect">
            <span></span>
            <span></span>
            <span></span>
          </router-link>
        </div>
      </template>
      <slot name="content"></slot>
    </el-card>
  </el-col>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true
    },
    redirect: {
      type: String,
      default: "./"
    },
    md: Number,
    lg: Number,
    xl: Number
  },
  data() {
    return {};
  },
};
</script>

<style lang="scss" scoped>
.welcome_header {
  display: flex;
  justify-content: space-between;
  .circle {
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 15px;
    height: 15px;
    &:hover {
      cursor: pointer;
    }
    > span {
      width: 4px;
      height: 4px;
      background-color: #c5c5c5;
    }
  }
}
.title {
  line-height: 24px;
  font-family: "PingFang SC", sans-serif;
  font-weight: 500;
}
</style>
