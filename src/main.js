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
// 导入vuex
import Vuex from 'vuex'

// 导入iViewUI框架
import iView from 'iview';
import 'iview/dist/styles/iview.css';
import axios from 'axios';
import goodsinfo from './components/goodsinfo.vue';
import buyCar from './components/buyCar.vue';
import payOrder from './components/payOrder.vue';
import login from './components/login.vue';
import orderInfo from './components/orderInfo.vue';
import paySuccess from './components/paySuccess.vue';
import sellCenter from './components/sellCenter.vue';
import orderCenter from './components/orderCenter.vue';
import lookOrder from './components/lookOrder.vue';

axios.defaults.baseURL='http://47.106.148.205:8899';
// 让axios携带cookie,否则一登录就退出来
axios.defaults.withCredentials=true;

Vue.prototype.axios=axios;
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
Vue.use(Vuex)


// 2. 定义路由
const routes = [
  { path: '/', component: index },
  { path: '/index', component: index },
  { path: '/goodsinfo/:id', component: goodsinfo ,meta:{checkLogin:true}},
  { path: '/lookOrder/:orderId', component: lookOrder ,meta:{checkLogin:true}},
  { path: '/buyCar', component: buyCar },
  { path: '/payOrder/:ids', component: payOrder,meta:{checkLogin:true} },
  { path: '/paySuccess', component: paySuccess,meta:{checkLogin:true} },
  { path: '/sellCenter', component: sellCenter,meta:{checkLogin:true} },
  { path: '/orderCenter', component: orderCenter,meta:{checkLogin:true} },
  { path: '/orderInfo/:orderid', component: orderInfo },
  { path: '/login', component: login },
]

// 3. 创建 router 实例，然后传 `routes` 配置
// 你还可以传别的配置参数, 不过先这么简单着吧。
const router = new VueRouter({
  routes // (缩写) 相当于 routes: routes
});




// 注册全局过滤器
Vue.filter('cutTime',function(value){
  return moment(value).format("YYYY年MM月DD日");
});

let buyList=JSON.parse( window.localStorage.getItem('buyList')) || {};

// 实例化一个Vue仓库
const store = new Vuex.Store({
  state: {
    // buyList:{} 
    buyList,
    isLogin:false,
    fromPath:'/'
  },
  getters:{
    totalCount(state){
      let num = 0;
      for (const key in state.buyList) {
        num+=parseInt( state.buyList[key]);
      }
      return num;
    }
  },
  mutations: {
    buyGood(state,info){
      // console.log(info);
      if(state.buyList[info.goodId]){
        let oldNum=parseInt(state.buyList[info.goodId]);
        oldNum+=parseInt( info.goodNum);
        state.buyList[info.goodId]=oldNum;
      }else{
        // state.buyList[info.goodId]=info.goodNum;
        Vue.set(state.buyList,info.goodId ,parseInt( info.goodNum))
      }
    },
    changeCount(state,info){
      state.buyList[info.goodId]=info.goodNum;
    },
    delGoodById(state,id){
      // delete state.buyList[id]
      Vue.delete(state.buyList,id)
    },
    changeLogin(state,login){
      state.isLogin=login;
    },
    // 保存来时的路由
    saveFromPath(state,fromPath){
      state.fromPath=fromPath;
    }
  }
});

//注册全局守卫
router.beforeEach((to, from, next) => {
  // 保存来时的路由
  store.commit('saveFromPath',from.path)

  // if(to.path=='/payOrder'){
    if(to.meta.checkLogin){
    axios.get('/site/account/islogin')
    .then(response=>{
      // console.log(response);
      if(response.data.code=='nologin'){
        next('/login');
      }else{
        next();
      }
    })
    .catch(err=>{
      // console.log(err);
    })
  }else{
    next();
  }
})

import './assets/statics/site/css/style.css';

Vue.config.productionTip = false;

new Vue({
  el: '#app',
  router,
  render: h => h(App),
  store,
  // 生命周期函数,一进来就判断用户是否登录
  beforeCreate(){
    axios.get('/site/account/islogin')
    .then(response=>{
      store.state.isLogin = response.data.code=='logined';
    })
    .catch(err=>{
      // console.log(err);
    })
  },
})


// 数据保存,刷新之前保存
window.onbeforeunload=function(){
  window.localStorage.setItem('buyList',JSON.stringify(store.state.buyList))
}