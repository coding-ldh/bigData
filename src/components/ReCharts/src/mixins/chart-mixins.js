export default {
  methods: {
    destroy(instance) {
      if (!instance) return;
      instance.dispose;
      instance = null;
    },
    resize(instance) {
      this.$nextTick(() => {
        window.addEventListener("resize", () => {
          if (!instance) return;
          setTimeout(() => {
            instance.resize&&instance.resize();
          });
        });
      });
    }
  }
};
