import reInfinite from "./src/Infinite.vue";

export const ReInfinite = Object.assign(reInfinite, {
  install(app, options = {}) {
    app.component(options.componentName || reInfinite.name, reInfinite);
  }
});

export default ReInfinite;
