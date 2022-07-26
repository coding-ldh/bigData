<template>
  <!-- <div id="app"> -->
  <wordcloud
    class="svgContent"
    :data="defaultWords"
    nameKey="key"
    valueKey="count"
    :color="colors"
    :showTooltip="false"
    :rotate="rotate"
    :fontSize="[20, 80]"
    :wordClick="wordClickHandler"
  ></wordcloud>
  <!-- </div> -->
</template>

<script>
import wordcloud from "vue-wordcloud";
export default {
  // name: "app",
  props: {
    svgData: Array,
    colors: Array
  },
  components: {
    wordcloud
  },
  watch: {
    svgData: {
      immediate: true,
      handler: function (news, old) {
        if (this.svgData.length == 0) {
          let temp = [];
          for (let i = 0; i < 10; i++) {
            temp.push({
              key: ">_<||空数据",
              count:
                Math.floor(Math.random(0, 1) * 10) > 7
                  ? Math.floor(Math.random(0, 1) * 1000)
                  : Math.floor(Math.random(0, 1) * 10)
            });
          }
          this.defaultWords = temp;
        } else {
          this.defaultWords = this.svgData;
        }
      }
    }
  },
  methods: {
    wordClickHandler(name, value, vm) {
      // console.log("word cloud", name);
      this.$emit("duringClick", 1, 5, false, name);
    }
  },
  data() {
    return {
      rotate: { from: 0, to: 0, numOfOrientation: 0 },
      defaultWords: []
    };
  }
};
</script>
<style lang="scss" scoped>
.svgContent {
  height: 480px;
  ::v-deep .text{
    cursor:pointer;
  }
}
</style>
