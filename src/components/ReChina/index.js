import reChina from "./src/China.vue";

export const ReChina = Object.assign(reChina, {
  install(app, options = {}) {
    app.component(options.componentName || reChina.name, reChina);
  }
});

export default ReChina;
