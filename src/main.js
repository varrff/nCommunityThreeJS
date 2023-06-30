import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
// 初始化css
import "./assets/reset.css";
// 引入相关的css
import "./assets/style.css";
// 引入动画css库
import "./assets/animate.css";
// 导入数据可视化
// import echarts from "echarts";
// 导入element-ui
// import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";


// 导入bus
import bus from './bus'
Vue.prototype.$EventBus = bus
// Vue.prototype.$echarts = echarts;
Vue.config.productionTip = false;
// Vue.use(ElementUI);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
