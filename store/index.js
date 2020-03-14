import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		hasLogin: false,
		userInfo: {},
		// session周期有效
		customerInfo:{
			idClient:'',
			clientUuid: '',
			clientName: '刘大大',
			age: '',
			gender: '',
			vehiclePlate: '粤A99999',
			vehicleSeries: '宝马5系',
			phone: '18666666666',
			addr: '北京市东城区',
			generateDate: '',
			modifyDate: '',
			point:''
		},
		items: [
/* 			{
					idItem: 3,
					itemUuid: 'SP100034',
					category: '保养',
					classification: '',
					itemName: '特色全合成机油',
					sellPrice: 160.00,
					discountPrice: 150.00,
					brandName: '丰田',
					description: '1.5升塑料瓶装',
					shipment: true,
					quantity: 3,
					remark: '八折优惠5块钱',
					alertQuantity: 5,
					specification: '1.5升瓶装',
					unit: '瓶',
					sales: 20 ,
					stock: 50,
					checked: true, // 是否选中
					picAddr:'http://biao-aliyun-oss-pic-bucket.oss-cn-shenzhen.aliyuncs.com/images/2020/03/08/1583628752948gv86t511pi.jpg',
			}, */
			], 
	},
	// 同步操作 总是接受 state 作为第一个参数
	mutations: {
		login(state, provider) {
			state.hasLogin = true;
			state.userInfo = provider;
			// 将数据存储在本地缓存中指定的 key 中，会覆盖掉原来该 key 对应的内容，这是一个异步接口
			// 对比vuex，localstorage是永久存储，保存在本地浏览器中
			uni.setStorage({//缓存用户登陆状态 
			    key: 'userInfo',  
			    data: provider  
			}) 
			console.log(state.userInfo);
		},
		logout(state) {
			state.hasLogin = false;
			state.userInfo = {};
			uni.removeStorage({  
                key: 'userInfo'  
            })
		},
		// 添加进购物车
		addCartItems(state,provider){
			const cartItem = state.items.find(item => item.itemUuid === provider.itemUuid)
			if(!cartItem){
				state.items.push(provider);
			}else{
				cartItem.quantity ++;
			}
					
		},
		// 清空
		emptyCart(state){
			state.items = [];
		},
		// 删除一个商品,  形参如果有多个，可使用{}
		deleteCartItem(state,idItem){
			// 注意es6语法 findIndex 和 find 使用
			let index = state.items.findIndex(item => item.idItem === idItem)
			state.items.splice(index,1);
		},
		// 解构
		incrementItemQuantity (state, { idItem }) {
			const cartItem = state.items.find(item => item.idItem === idItem)
			cartItem.quantity++;
		},
		decrementItemQuantity (state, { idItem }) {
			const cartItem = state.items.find(item => item.idItem === idItem)
			cartItem.quantity--;
		},
		setItemQuantity (state, {idItem,quantity }) {
			const cartItem = state.items.find(item => item.idItem === idItem)
			cartItem.quantity = quantity;
		},
		saveCustomerInfo(state,provider){
			state.customerInfo = provider;
		},
		delCustomerInfo(state){
			state.customerInfo = {};
		}
	},
	// 异步 总是接受 context 作为第一个参数
	actions: {
		// {commit} 解构 context对象，context与store实例具有相同的属性和方法。这里commit 就是 store.commit
		emptyCartAsync({commit}){
		     setTimeout(()=>{ commit("emptyCart"),3000})
		     },
		addCartAsync: (context,provider) => {
			setTimeout(()=>{ context.commit('addCart',addCartItems),3000})
		},
		/* emptyCartAsync: context => {
			return context.commit('emptyCart')
		} */
		
	},
	getters:{
		cartItems: state => {
			return state.items;
		},
		cusInfo: state => {
			return state.customerInfo;
		}
	}
})

export default store
