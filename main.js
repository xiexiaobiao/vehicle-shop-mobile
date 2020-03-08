import Vue from 'vue'
import store from './store' // 全局存储
import App from './App'
import Request from './plugins/request/js/index'

//测试用数据
import Json from './Json' 

import report from './pages/report/home.vue'
Vue.component('report',report)

//这里全局引入，并注册为vue组件，相比单页面js引入，使用更方便
/* import uniNavBar from "./components/uni-nav-bar/uni-nav-bar.vue"
Vue.component('uniNavBar',uniNavBar) */

/* import cuCustom from './colorui/components/cu-custom.vue'
Vue.component('cu-custom',cuCustom) */

import uniIcons from "@/components/uni-icons/uni-icons.vue"
Vue.component('uniIcons',uniIcons)

//设置全局的api地址
Vue.prototype.websiteUrl = 'http://10.4.14.132:7000';

const msg = (title, duration=1500, mask=false, icon='none')=>{
	//统一提示方便全局修改
	if(Boolean(title) === false){
		return;
	}
	uni.showToast({
		title,
		duration,
		mask,
		icon
	});
}

const hidemsg = ()=>{
	uni.hideToast()({
	});
}

const json = type=>{
	// 模拟异步请求数据
	return new Promise(resolve=>{
		setTimeout(()=>{
			resolve(Json[type]);
		}, 500)
	})
}

const prePage = ()=>{
	let pages = getCurrentPages();
	let prePage = pages[pages.length - 2];
	// #ifdef H5
	return prePage;
	// #endif
	return prePage.$vm;
}


Vue.config.productionTip = false
Vue.prototype.$fire = new Vue();
Vue.prototype.$store = store;
Vue.prototype.$api = {msg, hidemsg, json, prePage};
Vue.prototype.$http = Request;

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
