<template>
	<view class="content">
		<view class="navbar">
			<view 
				v-for="(item, index) in navList" :key="index" 
				class="nav-item" 
				:class="{current: tabCurrentIndex === index}"
				@click="tabClick(index)"
			>
				{{item.text}}
			</view>
		</view>

		<swiper :current="tabCurrentIndex" class="swiper-box" duration="300" @change="changeTab">
			<swiper-item class="tab-content" v-for="(tabItem,tabIndex) in navList" :key="tabIndex">
				<scroll-view 
					class="list-scroll-content" 
					scroll-y
					@scrolltolower="loadData"
				>
					<!-- 空白页 -->
					<empty v-if="tabItem.loaded === true && tabItem.orderList.length === 0"></empty>
					
					<!-- 订单列表 -->
					<view 
						v-for="(item,index) in tabItem.orderList" :key="index"
						class="order-item"
					>
						<view class="i-top b-b">
							<text class="time">{{item.generateDate}}</text>
							<text class="state" :style="{color: item.stateTipColor}">{{item.stateTip}}</text>
							<text 
								v-if="item.state===1" 
								class="del-btn yticon icon-iconfontshanchu1"
								@click="deleteOrder(item.orderUuid)"
							></text>
						</view>
						
<!-- 						<scroll-view v-if="item.detail.length > 1" class="goods-box" scroll-x>
							<view
								v-for="(goodsItem, goodsIndex) in item.detail" :key="goodsIndex"
								class="goods-item"
								@click="showOrder(item)"
							>
								<image class="goods-img" :src="goodsItem.picAddr" mode="aspectFill"></image>
							</view>
						</scroll-view> -->
						
						<view class="goods-box-single" @click="showOrder(item)">
							<text class="title clamp">{{item.clientName}}   {{item.phone}}   {{item.vehiclePlate}}</text>
						</view>
						
						<!-- <view 
							v-if="item.detail.length >= 1" 
							class="goods-box-single"
							v-for="(goodsItem, goodsIndex) in item.detail" :key="goodsIndex"
							@click="showOrder(item)"
						> -->
							<!-- <image class="goods-img" :src="goodsItem.picAddr" mode="aspectFill"></image> -->
						<!-- 	<view class="right">
								<text class="title clamp">{{goodsItem.itemUuid}} {{goodsItem.itemName}}</text>
								<text class="attr-box">{{goodsItem.specification}}  x {{goodsItem.quantity}}</text>
								<text class="price">{{goodsItem.discountPrice}}</text>
							</view>
						</view> -->
						
						<view class="price-box">
							共
							<text class="num">{{item.packages}}</text>
							件商品 实付款
							<text class="price">{{item.amount}}</text>
						</view>
						<view class="action-box b-t" v-if="item.state != 3 && item.state !=2">
							<!-- <button class="action-btn" @click="cancelOrder(item)">取消</button> -->
							<button class="action-btn" @click="editOrder(item)">编辑</button>
							<button class="action-btn recom" @click="paidOrder(item.orderUuid)">支付</button>
						</view>
					</view>
					 
					<uni-load-more :status="tabItem.loadingType"></uni-load-more>
					
				</scroll-view>
			</swiper-item>
		</swiper>
	</view>
</template> 

<script>
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import empty from "@/components/empty";
	import Json from '@/Json';
	import Request from '@/plugins/request/js/index.js'
	export default {
		components: {
			uniLoadMore,
			empty
		},
		data() {
			return {
				clientName: '', // 查询条件
				vehiclePlate: '',// 查询条件
				tabCurrentIndex: 0,
				paidStatus: 2 , // 查询条件
				cancelStatus: '',
				// 分页实现页面懒加载
				pageInfo:{
					"total": 0,
					"size": 8,  // 每次加载的页面数据量
					"current":1	 //	首次请求初始值，之后每请求一次就累加1				
				},
				navList: [{
						state: 0,
						text: '全部',
						loadingType: 'more',
						firstTimeLoad: true,
						orderList: []
					},
/* 					{
						state: 3,
						text: '未完成',
						loadingType: 'more',
						firstTimeLoad: true,
						orderList: []
						}, */
					{
						state: 1,
						text: '待付款',
						loadingType: 'more',
						firstTimeLoad: true,
						orderList: []
					},
					{
						state: 2,
						text: '已完成',
						loadingType: 'more',
						firstTimeLoad: true,
						orderList: []
					},
/* 					{
						state: 3,
						text: '已取消',
						loadingType: 'more',
						firstTimeLoad: true,
						orderList: []
					}, */
				],
			};
		},
		
		onLoad(options){
			/**
			 * 修复app端点击除全部订单外的按钮进入时不加载数据的问题
			 * 替换onLoad下代码即可
			 */
			options.state = 0;
			this.tabCurrentIndex = +options.state;
			// #ifndef MP
			this.loadData()
			// #endif
			// #ifdef MP
			if(options.state == 0){
				this.loadData()
			}
			// #endif
			
		},
		
		/**
		 * 当 searchInput 配置 disabled 为 true 时触发
		 */
		onNavigationBarSearchInputClicked(e) {
			console.log('事件执行了')
			uni.navigateTo({
				url: '/pages/order/srchdetail'
			});
		},
		/**
		 *  点击导航栏 右侧 button 时触发 
		 */
		onNavigationBarButtonTap() {
			//注意：： 网页测试这里会报错，真机运行可以！！！
			const currentWebview = this.$mp.page.$getAppWebview();
			currentWebview.setTitleNViewSearchInputText("");
			
			// 初始化查询条件
			this.navList[this.tabCurrentIndex].orderList = [];
			this.pageInfo.current = 1;
			this.clientName = '';
			this.vehiclePlate = '';
			this.loadData()
/* 			uni.showModal({
				title: '提示',
				content: '用户点击了功能按钮，这里仅做展示。',
				success: res => {
					if (res.confirm) {
						console.log('用户点击了确定');
					}
				}
			}); */
		},
		/**
			 * 当 searchInput 输入时触发
			 */
/* 		onNavigationBarSearchInputChanged(e) {
			let text = e.text;
			if (!text) {
				this.isHistory = true;
				this.historyList = [];
				this.historyList = uni.getStorageSync('search:history');
	
				return;
			} else {
				this.isHistory = false;
				this.getInputtips(text);
			}
		}, */
			/**
			 * 点击软键盘搜索按键触发
			 */
		onNavigationBarSearchInputConfirmed(e) {
			let text = e.text;
			if (text) {
				// 初始化查询条件
				this.navList[this.tabCurrentIndex].orderList = [];
				this.clientName = text;
				this.vehiclePlate = text;
				this.pageInfo.current = 1;
				this.loadData()
			}
			
			
			/* if (!text) {
				this.isHistory = true;
				this.historyList = [];
				this.historyList = uni.getStorageSync('search:history');
				uni.showModal({
					title: '提示',
					content: '请输入内容。',
					success: res => {
						if (res.confirm) {
						}
					}
				});
				return;
			} else {
				uni.showModal({
					title: '提示',
					content: `您输入的内容为"${text}",如果点击确定,将记录到历史搜索,并返回.如果取消不做操作`,
					success: res => {
						if (res.confirm) {
							util.setHistory(text);
							uni.navigateBack();
						}
					}
				});
			} */
		},
			/**
			 *  点击导航栏 buttons 时触发
			 */
/* 		onNavigationBarButtonTap() {
			uni.showModal({
				title: '提示',
				content: '点击确定，修改输入框的内容为abc',
				success: res => {
					if (res.confirm) {
						const currentWebview = this.$mp.page.$getAppWebview();
						currentWebview.setTitleNViewSearchInputText("abc");
					}
				}
			});
		}, */
		 
		methods: {
			requestForCancelOrder: function(value){
				// 使用封装的 request
				Request().request({
					url:'order/vehicle/order/cancel',
					method: 'get',
					header:{},
					params: {
						'Uuid': value ,
					  },
					}				
				).then(
					res => { }
				).catch(err => {
				    console.error('is catch', err)
				    this.err = err;
				 });
			},
			requestForPaidOrder: function(value){				
				// 使用封装的 request
				return Request().request({
					url:'order/vehicle/order/paid',
					method: 'get',
					header:{},
					params: {
						'Uid': value ,
					  },
					}				
				).then(
					res => { }
				).catch(err => {
				    console.error('is catch', err)
				    this.err = err;
				 });
			},
			requestForDeleteOrder: function(value){
				// 使用封装的 request
				return Request().request({
					url:'order/vehicle/order/del/uid',
					method: 'get',
					header:{},
					params: {
						'uid': value ,
					  },
					}				
				).then(
					res => { }
				).catch(err => {
				    console.error('is catch', err)
				    this.err = err;
				 });
			},
			//修改订单
			editOrder(item){
				let type = 'edit';
				uni.navigateTo({
					url: `/pages/order/editOrder?type=${type}&data=${JSON.stringify(item)}`
				})
			},
			//订单详细
			showOrder(item){
				uni.navigateTo({
					url: `/pages/order/orderDetail?data=${JSON.stringify(item)}`
				})
			},
			
			//获取订单列表
		async loadData(source){
				console.log("async loadData")
				//这里是将订单挂载到tab列表下
				let index = this.tabCurrentIndex;
				let navItem = this.navList[index];
				let state = navItem.state;
				
				if(source === 'tabChange' && navItem.loadingType === 'noMore'){
					//tab切换只有第一次需要加载数据
					return;
				}
				if(source === 'tabChange' && navItem.firstTimeLoad === true){
					// tab切换，第一次按首次加载处理
					this.pageInfo.current = 1;
				}
				if(navItem.loadingType === 'loading'){
					//防止重复加载
					return;
				}
				
				navItem.loadingType = 'loading';
				

				let orderList = [];
				//请求后台数据
				// await this.requestForData();  // await 只能出现在 async 函数中
				await Request().request({
					url:'order/vehicle/order/list/uniapp',
					method: 'get',
					header:{},
					params: {
						'pageNum': this.pageInfo.current ,
						'pageSize': this.pageInfo.size,
						'paidStatus': this.paidStatus,
						'clientName': this.clientName, 
						'vehiclePlate': this.vehiclePlate,
					  },
					}				
				).then(
					res => {
						// json 和 str 转换 JSON.stringify  JSON.parse
						// console.log('res--->>>'+ JSON.stringify(res.data.records.length))
						// console.log('res--->>>'+ JSON.stringify(res.data.records))
						orderList = res.data.records;
						this.pageInfo.total = res.data.total;
						// 加载一次后累加页数
						this.pageInfo.current  += 1;
						// console.log('total>>> '+ this.pageInfo.total)
						// console.log('page>>> '+ this.pageInfo.current+' * '+this.pageInfo.size)
					}
				).catch(err => {
					console.error('is catch', err)
					this.err = err;
				 })
				 //是否取消的订单
/* 				orderList = orderList.forEach( (item)=>{
					if(item.cancelStatus){
						let {stateTip, stateTipColor} = this.orderStateExp(3);
						item = Object.assign(item, {
							state: item.paidStatus?2:1,
							stateTip, 
							stateTipColor
						})
					}					
				}) */
				//是否付款的订单
				orderList = orderList.filter(item=>{
					//添加不同状态下订单的表现形式
					let {stateTip, stateTipColor} = this.orderStateExp(item.paidStatus?2:1);
					item = Object.assign(item, {
						state: item.paidStatus?2:1,
						stateTip, 
						stateTipColor
					})
					//演示数据所以自己进行状态筛选
					if(state === 0){
						//0为全部订单
						return item;
					}
					return item.state === state
				});
				// 计算商品件数
				orderList.forEach(item=>{
					item.packages = item.detail.reduce((total, detail) => {
							return total + detail.quantity
					}, 0)
					navItem.orderList.push(item);
				})

				//firstTimeLoad字段用于表示是否是第一次加载
				navItem.firstTimeLoad = false;
				//loaded新字段用于表示数据加载完毕，如果为空可以显示空白页
				this.$set(navItem, 'loaded', true);
				
				//判断是否还有数据， 有改为 more， 没有改为noMore 
				if(this.pageInfo.total >=  (this.pageInfo.current-1) * this.pageInfo.size){
					navItem.loadingType = 'more';
				}else {
					navItem.loadingType = 'noMore';
				}

			}, 

			//swiper 切换
			changeTab(e){
				this.tabCurrentIndex = e.target.current;
				// 更新后台查询的条件
				switch(e.target.current){
					case 1:
						this.paidStatus = 0; 
						break;
					case 2:
						this.paidStatus = 1; 
						break;
					case 3:
						this.cancelStatus = 1; //已取消
						break;
					default:
						this.paidStatus = 2; 
						break;						
				}
				this.loadData('tabChange');
			},
			//顶部tab点击
			tabClick(index){
				this.tabCurrentIndex = index;
			},
			//删除订单
			deleteOrder(orderUuid){
				uni.showModal({
					content: '删除不可恢复，确定？',
					success: (e) =>{
						if(e.confirm){
							uni.showLoading({
							title: '请稍后'
							})
							//后台处理
							this.requestForDeleteOrder(orderUuid)
						setTimeout(()=>{
							//
							let index = this.navList[0].orderList.findIndex(val=>val.orderUuid === orderUuid)
							this.navList[0].orderList.splice(index, 1);
							let index2 = this.navList[1].orderList.findIndex(val=>val.orderUuid === orderUuid)
							this.navList[1].orderList.splice(index2, 1);
							uni.hideLoading();
						}, 600)
						}
					}
				})
				
			},
			//取消订单
			cancelOrder(item){
				uni.showModal({
					content: '取消订单？',
					success: (e)=>{
						if(e.confirm){
							uni.showLoading({
							title: '请稍后'
							})
						setTimeout(()=>{
							// console.log('state before'+ JSON.stringify(item))
							let {stateTip, stateTipColor} = this.orderStateExp(3);
							item = Object.assign(item, {
								state: 3,
								stateTip, 
								stateTipColor
							})
							// console.log('state after'+  JSON.stringify(item))
							// 提交 后台处理
							this.requestForCancelOrder(item.orderUuid);
							//取消订单后删除待付款中该项
							let list = this.navList[1].orderList;
							let index = list.findIndex(val=>val.id === item.id);
							index !== -1 && list.splice(index, 1);					
							uni.hideLoading();
						}, 600)
						}
					}
				})
				
				
			},
			//付款订单
			paidOrder(item){
				uni.showModal({
					content: '订单已付款？',
					success: (e)=>{
						if(e.confirm){
									uni.showLoading({
										title: '请稍后'
									})
								setTimeout(()=>{
									// console.log('state before'+ JSON.stringify(item))
									let {stateTip, stateTipColor} = this.orderStateExp(1);
									item = Object.assign(item, {
										state: 1,
										stateTip, 
										stateTipColor
									})
									// console.log('state after'+  JSON.stringify(item))
									// 提交 后台处理
									this.requestForPaidOrder(item.orderUuid);
									//取消订单后删除待付款中该项
									let list = this.navList[1].orderList;
									let index = list.findIndex(val=>val.id === item.id);
									index !== -1 && list.splice(index, 1);
									
									uni.hideLoading();
								}, 600)
						}
					}
				})
				
				
			},

			//订单状态文字和颜色
			orderStateExp(state){
				let stateTip = '',
					stateTipColor = '#fa436a';
				switch(+state){
					case 1:
						stateTip = '待付款';
						break;
					case 2:
						stateTip = '已完成'; 
						stateTipColor = '#00007f';
						break;
					case 3:
						stateTip = '订单已取消'; 
						stateTipColor = '#909399';
						break;
						
					//更多自定义
				}
				return {stateTip, stateTipColor};
			}
		},
	}
</script>

<style lang="scss">
	page, .content{
		background: $page-color-base;
		height: 100%;
	}
	
	.swiper-box{
		height: calc(100% - 40px);
	}
	.list-scroll-content{
		height: 100%;
	}
	
	.navbar{
		display: flex;
		height: 40px;
		padding: 0 5px;
		background: #fff;
		box-shadow: 0 1px 5px rgba(0,0,0,.06);
		position: relative;
		z-index: 10;
		.nav-item{
			flex: 1;
			display: flex;
			justify-content: center;
			align-items: center;
			height: 100%;
			font-size: 15px;
			color: $font-color-dark;
			position: relative;
			&.current{
				color: $base-color;
				&:after{
					content: '';
					position: absolute;
					left: 50%;
					bottom: 0;
					transform: translateX(-50%);
					width: 44px;
					height: 0;
					border-bottom: 2px solid $base-color;
				}
			}
		}
	}

	.uni-swiper-item{
		height: auto;
	}
	.order-item{
		display: flex;
		flex-direction: column;
		padding-left: 30upx;
		background: #fff;
		margin-top: 16upx;
		.i-top{
			display: flex;
			align-items: center;
			height: 80upx;
			padding-right:30upx;
			font-size: $font-base;
			color: $font-color-dark;
			position: relative;
			.time{
				flex: 1;
			}
			.state{
				color: $base-color;
			}
			.del-btn{
				padding: 10upx 0 10upx 36upx;
				font-size: $font-lg;
				color: $font-color-light;
				position: relative;
				&:after{
					content: '';
					width: 0;
					height: 30upx;
					border-left: 1px solid $border-color-dark;
					position: absolute;
					left: 20upx;
					top: 50%;
					transform: translateY(-50%);
				}
			}
		}
		/* 多条商品 */
		.goods-box{
			height: 160upx;
			padding: 20upx 0;
			white-space: nowrap;
			.goods-item{
				width: 120upx;
				height: 120upx;
				display: inline-block;
				margin-right: 24upx;
			}
			.goods-img{
				display: block;
				width: 100%;
				height: 100%;
			}
		}
		/* 单条商品 */
		.goods-box-single{
			display: flex;
			padding: 10upx 0;
			.goods-img{
				display: block;
				width: 120upx;
				height: 120upx;
			}
			.right{
				flex: 1;
				display: flex;
				flex-direction: row;
				padding: 0 30upx 0 24upx;
				overflow: hidden;
				.title{
					font-size: $font-base + 2upx;
					color: $font-color-dark;
					line-height: 1;
				}
				.attr-box{
					font-size: $font-sm + 2upx;
					color: $font-color-light;
					padding: 0upx 12upx;
				}
				.price{
					font-size: $font-base + 2upx;
					color: $font-color-dark;
					&:before{
						content: '￥';
						font-size: $font-sm;
						margin: 0 2upx 0 8upx;
					}
				}
			}
		}
		
		.price-box{
			display: flex;
			justify-content: flex-end;
			align-items: baseline;
			padding: 5upx 30upx;
			font-size: $font-sm + 2upx;
			color: $font-color-light;
			.num{
				margin: 0 8upx;
				color: $font-color-dark;
			}
			.price{
				font-size: $font-lg;
				color: $font-color-dark;
				&:before{
					content: '￥';
					font-size: $font-sm;
					margin: 0 2upx 0 8upx;
				}
			}
		}
		.action-box{
			display: flex;
			justify-content: flex-end;
			align-items: center;
			height: 100upx;
			position: relative;
			padding-right: 30upx;
		}
		.action-btn{
			width: 160upx;
			height: 60upx;
			margin: 0;
			margin-left: 24upx;
			padding: 0;
			text-align: center;
			line-height: 60upx;
			font-size: $font-sm + 2upx;
			color: $font-color-dark;
			background: #fff;
			border-radius: 100px;
			&:after{
				border-radius: 100px;
			}
			&.recom{
				background: #fff9f9;
				color: $base-color;
				&:after{
					border-color: #f7bcc8;
				}
			}
		}
	}
	
	
	/* load-more */
	.uni-load-more {
		display: flex;
		flex-direction: row;
		height: 80upx;
		align-items: center;
		justify-content: center
	}
	
	.uni-load-more__text {
		font-size: 28upx;
		color: #999
	}
	
	.uni-load-more__img {
		height: 24px;
		width: 24px;
		margin-right: 10px
	}
	
	.uni-load-more__img>view {
		position: absolute
	}
	
	.uni-load-more__img>view view {
		width: 6px;
		height: 2px;
		border-top-left-radius: 1px;
		border-bottom-left-radius: 1px;
		background: #999;
		position: absolute;
		opacity: .2;
		transform-origin: 50%;
		animation: load 1.56s ease infinite
	}
	
	.uni-load-more__img>view view:nth-child(1) {
		transform: rotate(90deg);
		top: 2px;
		left: 9px
	}
	
	.uni-load-more__img>view view:nth-child(2) {
		transform: rotate(180deg);
		top: 11px;
		right: 0
	}
	
	.uni-load-more__img>view view:nth-child(3) {
		transform: rotate(270deg);
		bottom: 2px;
		left: 9px
	}
	
	.uni-load-more__img>view view:nth-child(4) {
		top: 11px;
		left: 0
	}
	
	.load1,
	.load2,
	.load3 {
		height: 24px;
		width: 24px
	}
	
	.load2 {
		transform: rotate(30deg)
	}
	
	.load3 {
		transform: rotate(60deg)
	}
	
	.load1 view:nth-child(1) {
		animation-delay: 0s
	}
	
	.load2 view:nth-child(1) {
		animation-delay: .13s
	}
	
	.load3 view:nth-child(1) {
		animation-delay: .26s
	}
	
	.load1 view:nth-child(2) {
		animation-delay: .39s
	}
	
	.load2 view:nth-child(2) {
		animation-delay: .52s
	}
	
	.load3 view:nth-child(2) {
		animation-delay: .65s
	}
	
	.load1 view:nth-child(3) {
		animation-delay: .78s
	}
	
	.load2 view:nth-child(3) {
		animation-delay: .91s
	}
	
	.load3 view:nth-child(3) {
		animation-delay: 1.04s
	}
	
	.load1 view:nth-child(4) {
		animation-delay: 1.17s
	}
	
	.load2 view:nth-child(4) {
		animation-delay: 1.3s
	}
	
	.load3 view:nth-child(4) {
		animation-delay: 1.43s
	}
	
	@-webkit-keyframes load {
		0% {
			opacity: 1
		}
	
		100% {
			opacity: .2
		}
	}
</style>
