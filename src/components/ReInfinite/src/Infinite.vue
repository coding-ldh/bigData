<template>
  <div class="infinite">
    <ul class="top">
      <li>排名</li>
      <li>科室</li>
      <li>查询次数</li>
    </ul>
    <SeamlessScroll
      ref="scroll"
      :data="listData"
      :class-option="classOption"
      class="warp"
    >
      <ul class="item">
        <li v-for="(item, index) in listData" :key="index">
          <span v-text="item.date"></span>
          <span v-text="item.name"></span>
          <span v-text="item.star"></span>
        </li>
      </ul>
    </SeamlessScroll>
  </div>
</template>

<script>
import SeamlessScroll from "@/components/SeamlessScroll";
export default {
  components: {
    SeamlessScroll
  },
  data() {
    return {
      listData: [
        {
          date: "1",
          name: "vue-pure-admin",
          star: "1000"
        },
        {
          date: "2",
          name: "vue-pure-admin",
          star: "1100"
        },
        {
          date: "3",
          name: "vue-pure-admin",
          star: "1200"
        },
        {
          date: "4",
          name: "vue-pure-admin",
          star: "1300"
        },
        {
          date: "5",
          name: "vue-pure-admin",
          star: "1400"
        },
        {
          date: "6",
          name: "vue-pure-admin",
          star: "1500"
        },
        {
          date: "7",
          name: "vue-pure-admin",
          star: "1600"
        },
        {
          date: "8",
          name: "vue-pure-admin",
          star: "1700"
        },
        {
          date: "9",
          name: "vue-pure-admin",
          star: "1800"
        },
        {
          date: "10",
          name: "vue-pure-admin",
          star: "1900"
        },
        {
          date: "11",
          name: "vue-pure-admin",
          star: "1900"
        },
        {
          date: "12",
          name: "vue-pure-admin",
          star: "1900"
        },{
          date: "13",
          name: "vue-pure-admin",
          star: "1900"
        },{
          date: "14",
          name: "vue-pure-admin",
          star: "1900"
        }
      ],
      data: {
        direction: 'top',
      }
    };
  }
};
</script>

<style lang="scss" scoped>
.infinite {
  .top {
    width: 95%;
    height: 40px;
    line-height: 40px;
    display: flex;
    margin: 0 auto;
    font-size: 14px;
    color: #909399;
    font-weight: 400;
    background: #fafafa;

    li {
      width: 34%;
      text-align: center;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .warp {
    width: 95%;
    height: 170px;
    margin: 0 auto;
    overflow: hidden;

    li {
      height: 30px;
      line-height: 30px;
      display: flex;
      font-size: 15px;
    }

    span {
      width: 34%;
      text-align: center;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
</style>
