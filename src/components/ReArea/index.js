import reArea from "./src/Area.vue";

export const ReArea = Object.assign(reArea, {
  install(app, options = {}) {
    app.component(options.componentName || reArea.name, reArea);
  }
});

export default ReArea;
