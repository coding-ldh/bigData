<template>
  <div></div>
</template>

<script>
import notFind from "@/assets/404_images/404Img.png";
export default {
  data() {
    return {
      imgShow: true,
    };
  },
  created() {},
  methods: {
    imgEnter(e, url, type) {
      this.imgShow = type == "img" ? true : false; // img还是video
      let imgLoupe = document.getElementsByClassName("imgLoupe");
      let imgAndvideo = document.getElementsByClassName("imgAndvideo");
      imgLoupe[0].style.width = `${(imgLoupe[0].offsetHeight * 9) / 16}px`; // 等比设置宽度
      imgLoupe[0].style.opacity = 1; // 显示，配合transition进行动画
      imgLoupe[0].style.left = `calc(50% - ${
        // 居中
        (imgLoupe[0].offsetHeight * 9) / 16 / 2
      }px)`;
      // 将放大的img或video进行src填充
      if (type == "img") {
        imgAndvideo[0].src = imgAndvideo[0].src != url ? "" : url;
        imgAndvideo[0].src = url;
      } else {
        imgAndvideo[1].src = imgAndvideo[1].src != url ? "" : url;
        imgAndvideo[1].src = url;
      }
    },
    imgLeave() {
      let imgLoupe = document.getElementsByClassName("imgLoupe");
      imgLoupe[0].style.width = "0px";
      imgLoupe[0].style.opacity = 0;
    },
    imgError(e, url) {
      // 625bbc73de56d24c4bf7dcac 只有视频
      // 62592a89de56d24c4bf7dbfc 只有图片
      // 625b7b69a57c6d6da54f9dea 空数据的
      e.currentTarget.style.display = "none";
      e.currentTarget.nextElementSibling.style.display = "inline-block";
      e.currentTarget.nextElementSibling.src = url;
    },
    videoError(e) {
      e.currentTarget.style.display = "none";
      e.currentTarget.nextElementSibling.style.display = "inline-block";
      e.currentTarget.nextElementSibling.src = notFind;
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
