import seamlessScroll from "./src/index.vue";

export const SeamlessScroll = Object.assign(seamlessScroll, {
  install(app, options = {}) {
    app.component(options.componentName || seamlessScroll.name, seamlessScroll);
  }
});

export default SeamlessScroll;
