import reLine from "./src/Line.vue";
import reBar from "./src/Bar.vue";
import reCircle from "./src/Circle.vue"

export const ReLine = Object.assign(reLine, {
  install(app, options = {}) {
    app.component(options.componentName || reLine.name, reLine);
  }
});

export const ReBar = Object.assign(reBar, {
  install(app, options = {}) {
    app.component(options.componentName || reBar.name, reBar);
  }
});

export const ReCircle = Object.assign(reCircle, {
  install(app, options = {}) {
    app.component(options.componentName || reCircle.name, reCircle);
  }
})