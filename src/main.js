import Vue from 'vue'
import App from './App.vue'
import moment from 'moment';

// 引入路由模块
import VueRouter from 'vue-router'
// 引入index组件
import index from './components/index.vue'
// 导入ui框架
import ElementUI from "element-ui";
// 导入css
import "element-ui/lib/theme-chalk/index.css";
// 导入懒加载插件
import VueLazyload from "vue-lazyload";

// 导入iViewUI框架
import iView from 'iview';
import 'iview/dist/styles/iview.css';
import axios from 'axios';
axios.defaults.baseURL='http://47.106.148.205:8899';
Vue.prototype.axios=axios;

import goodsinfo from './components/goodsinfo.vue';

// 使用路由中间件
Vue.use(VueRouter);
// 使用ui中间件
Vue.use(ElementUI);
// 使用懒加载路由中间件
Vue.use(VueLazyload,{
  loading:require('./img/02.gif')
});
// 使用iView
Vue.use(iView);


// 2. 定义路由
const routes = [
  { path: '/', component: index },
  { path: '/index', component: index },
  { path: '/goodsinfo/:id', component: goodsinfo },
]

// 3. 创建 router 实例，然后传 `routes` 配置
// 你还可以传别的配置参数, 不过先这么简单着吧。
const router = new VueRouter({
  routes // (缩写) 相当于 routes: routes
})
// 注册全局过滤器
Vue.filter('cutTime',function(value){
  return moment(value).format("YYYY年MM月DD日");
});

import './assets/statics/site/css/style.css';

Vue.config.productionTip = false;

new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
