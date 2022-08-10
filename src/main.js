import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.use(VueAxios, axios)
Vue.use(ElementUI);
Vue.config.productionTip = false
Vue.prototype.$axios = axios
axios.defaults.baseURL = 'https://api.lehuitech.com.cn/22api/wj/'  //关键代码
// 是否允许跨域携带cookie信息
//axios.defaults.withCredentials = true;
// 配置请求头
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
