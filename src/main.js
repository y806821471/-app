import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/vant.js'
import axios from 'axios'
import store from './store/store.js'
import './assets/css/main.css'; //全局样式
import VueClipboard from 'vue-clipboard2' //复制粘贴复制插件
import vueTouch from 'vue-plugin-touch'
import { JSEncrypt } from 'jsencrypt'

import echarts from 'echarts'
Vue.prototype.$echarts = echarts

Vue.config.productionTip = false
Vue.use(vueTouch)
Vue.use(VueClipboard)
Vue.prototype.routerBack = function () {
  router.back();
}
// axios.defaults.baseURL = 'http://joggle.santi333.com';
axios.defaults.baseURL = 'http://apifood.apoiion.cn'; //测试
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.headers.token = localStorage.getItem('accessToken') || '';
Vue.prototype.$http = axios;

// 路由全局守卫
router.beforeEach((to, from, next) => {
  const isLogin = localStorage.getItem("accessToken") ? true : false;
  if (isLogin || to.path == '/Login' || to.path == '/Register' || to.path == '/Forget') {
    next()
  } else {
    next("/Login")
  }
})
// 配置plus 环境
document.addEventListener('plusready', function () {

  // plus.navigator.setStatusBarBackground('#FFFFFF');
  plus.navigator.setStatusBarStyle('light');
  // 监听返回按键
  let now = false;
  let time = null;
  plus.key.addEventListener('backbutton', function () {
    let canQuit = { '/Index': true, '/Login': true }
    let pathUrl = vueInstance.$route.path;
    // let url = window.location.href;
    // var pathUrl = url.substr(url.lastIndexOf('/') + 1);
    if (canQuit[pathUrl]) {
      time = null;
      if (now) {
        now = false;
        plus.runtime.quit();
      } else {
        now = true;
        plus.nativeUI.toast("再按一次退出应用", { duration: 'short' });
        time = setTimeout(() => {
          now = false;
        }, 1000);
      }
    } else {
      router.back();
    }
  })
})

import { Toast } from 'vant';
Vue.use(Toast);
// 响应拦截器 
axios.interceptors.response.use(
  response => {
    const res = response.data;
    // console.log(res);
    switch (res.status) {
      case 997: // 账号冻结
        router.push("/Login");
        axios.defaults.headers.token = '';
        Toast(res.msg);
        break;
      case 998: // 账号不存在
        localStorage.clear();
        sessionStorage.clear();
        router.push("/Login");
        axios.defaults.headers.token = '';
        Toast(res.msg);
        break;
      case 999: // 登陆过期
        localStorage.clear();
        sessionStorage.clear();
        router.push("/Login");
        axios.defaults.headers.token = '';
        Toast(res.msg);
        break;
      case 402: // 账号在其他设备登陆
        router.push("/Login");
        axios.defaults.headers.token = '';
        Toast(res.msg);
        break;
    }
    return response;
  },
  error => {
    Toast("网络错误!");
    return Promise.reject(error);
  }
)

// 全局header公共组件
import AppBar from './components/AppBar'
Vue.component('app-bar', AppBar)

let vueInstance = new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')
