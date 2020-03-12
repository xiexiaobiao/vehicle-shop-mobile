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
					:refresher-enabled = "false"
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
								v-if="item.state===3" 
								class="del-btn yticon icon-iconfontshanchu1"
								@click="deleteOrder(index)"
							></text>
						</view>
						
						<scroll-view v-if="item.detail.length > 1" class="goods-box" scroll-x>
							<view
								v-for="(goodsItem, goodsIndex) in item.detail" :key="goodsIndex"
								class="goods-item"
								@click="showOrder(item)"
							>
								<image class="goods-img" :src="goodsItem.picAddr" mode="aspectFill"></image>
							</view>
						</scroll-view>
						
						<view 
							v-if="item.detail.length === 1" 
							class="goods-box-single"
							v-for="(goodsItem, goodsIndex) in item.detail" :key="goodsIndex"
							@click="showOrder(item)"
						>
							<image class="goods-img" :src="goodsItem.picAddr" mode="aspectFill"></image>
							<view class="right">
								<text class="title clamp">{{goodsItem.itemName}}</text>
								<text class="attr-box">{{goodsItem.specification}}  x {{goodsItem.quantity}}</text>
								<text class="price">{{goodsItem.discountPrice}}</text>
							</view>
						</view>
						
						<view class="price-box">
							共
							<text class="num">{{item.packages}}</text>
							件商品 实付款
							<text class="price">{{item.amount}}</text>
						</view>
						<view class="action-box b-t" v-if="item.state != 3">
							<button class="action-btn"   @click="cancelOrder(item)">取消订单</button>
							<button class="action-btn recom"  @click="editOrder(item)">编辑</button>
							<button class="action-btn recom"   @click="paidOrder(item)">付款</button>
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
		/* uni-app: onPullDownRefresh() 和 onReachBottom()，也可以实现页面到底刷新，
          效果和<scroll-view scroll-y @scrolltolower="loadData" > 等价！！！ */
		data() {
			return {
				tabCurrentIndex: 0,
				// 是否付款的查询条件，配合后端默认为 2，代表全部
				paidStatus: 2 ,
				// 分页实现页面懒加载
				pageInfo:{
					"total": 0,
					"size": 4,  // 每次加载的页面数据量
					"current":1	 //	首次请求初始值，之后每请求一次就累加1				
				},
				navList: [{
						state: 0,
						text: '全部',
						loadingType: 'more',
						firstTimeLoad: true,
						orderList: []
					},
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
					{
						state: 3,
						text: '已取消',
						loadingType: 'more',
						firstTimeLoad: true,
						orderList: []
					}
				],
				orderListArr:[],
			};
		},
		
		onLoad(options){
			// 进入后默认显示全部类型的数据
			options.state = 0;
			this.tabCurrentIndex = + options.state;
			// 加载页面时先默认请求一次数据
				
			// #ifndef MP		
			this.loadData()
			// #endif
			
			// #ifdef MP
			if(options.state == 0){
				this.loadData()
			}
			// #endif			
		},
		 
		methods: {
			// 封装后台请求数据方法
			requestForData: function(){
				return
				// 使用封装的 request
				Request().request({
					url:'order/vehicle/order/list/uniapp',
					method: 'get',
					header:{},
					params: {
						'pageNum': this.pageInfo.current ,
						'pageSize': this.pageInfo.size,
						'paidStatus': this.paidStatus,
					  },
					}				
				).then(
					res => {
						// json 和 str 转换 JSON.stringify  JSON.parse
						// console.log('res--->>>'+ JSON.stringify(res))
						this.orderListArr = res.data.records;
						this.pageInfo.total = res.data.total;
						// 加载一次后累加页数
						this.pageInfo.current  += 1;
						console.log('total>>> '+ this.pageInfo.total)
						console.log('page>>> '+ this.pageInfo.current+' * '+this.pageInfo.size)
					}
				).catch(err => {
				    console.error('is catch', err)
				    this.err = err;
				 })
			},
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
			//获取订单列表
			async loadData(source){ //async 函数返回的是一个 Promise 对象,可then() 链来处理
				//这里是将订单挂载到tab列表下
				let index = this.tabCurrentIndex; // 0
				let navItem = this.navList[index]; // {}
				let state = navItem.state; // 0
				
				if(navItem.loadingType === 'noMore'){
					return
				}
				
				if(source === 'tabChange' && navItem.firstTimeLoad === false ){					
					//tab切换没有更多，就不加载数据,
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
				
				/*  已完成的如果不加条件，可能后端第一页有数据，而前端进行过滤后导致第一页空，而非空的在后面页，！！！
				 解决办法：1.每次后端请求都加上条件，保证如果有数据，第一页肯定有数据，
				           2，循环请求，直到有数据或者到DB尽头（后续问题：如果第一页不满，会导致虽然有后续数据，
						     ，但也无法触发加载更多，这是uniapp页面组件问题，所以要注意首页数量设置，保证各设备屏幕填满！）
				*/
			   
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
					  },
					}				
				).then(
					res => {
						// json 和 str 转换 JSON.stringify  JSON.parse
						// console.log('res--->>>'+ JSON.stringify(res))
						this.orderListArr = res.data.records;
						this.pageInfo.total = res.data.total;
						// 加载一次后累加页数
						this.pageInfo.current  += 1;
						console.log('total>>> '+ this.pageInfo.total)
						console.log('page>>> '+ this.pageInfo.current+' * '+this.pageInfo.size)
					}
				).catch(err => {
				    console.error('is catch', err)
				    this.err = err;
				 })
								
					let orderList = this.orderListArr;
					// console.log(JSON.stringify(orderList))
					// console.log('this.orderListArr>>> '+ this.orderListArr.length)
					// console.log('orderList>>> '+ orderList.length)
					/* 这里注意js语法，orderList.filter返回的是一个新arr，必须再赋值给原arr，否则原arr不变！！*/
					/* 这里注意js语法，orderList.filter返回的是一个新arr，必须再赋值给原arr，否则原arr不变！！*/
					orderList = orderList.filter( (item) =>{
						//添加不同状态下订单的表现形式
						let {stateTip, stateTipColor} = this.orderStateExp(item.paidStatus);
						item = Object.assign(item, {
							state: item.paidStatus?1:0,
							stateTip, 
							stateTipColor
						})
						//演示数据所以自己进行状态筛选
						if(state === 0){
							//0为全部订单
							return item;
						}
						// console.log(item.orderUuid+" "+ item.paidStatus)
						return item.paidStatus?2:1 === state;
					});
					// console.log('orderList after >>> '+ orderList.length)
					// 计算商品件数
					orderList.forEach(item=>{
						item.packages = item.detail.reduce((total, detail) => {
								return total + detail.quantity
						}, 0)
						navItem.orderList.push(item);
					})
					// console.log('navItem.orderList >>> '+ navItem.orderList.length)

					//firstTimeLoad字段用于表示是否是第一次加载
					navItem.firstTimeLoad = false;
					// this.$set(navItem, 'firstTimeLoad', false);
					
					//判断是否还有数据， 有改为 more， 没有改为noMore 
					if(this.pageInfo.total > (this.pageInfo.current-1) * this.pageInfo.size){
						navItem.loadingType = 'more';
					}else if(this.pageInfo.total <= (this.pageInfo.current-1) * this.pageInfo.size){
						navItem.loadingType = 'noMore';
					}															
			}, 
			//计算件数
			calcPackages(arr){
				return arr.reduce((total, detail) => {
					return total + detail.quantity
			    }, 0)
			},
			
			//swiper 切换
			changeTab(e){
				console.log("A")
				this.tabCurrentIndex = e.target.current;
				this.loadData('tabChange');
			},
			
			//顶部tab点击
			tabClick(index){
				console.log("B")
				this.tabCurrentIndex = index;
				// 更新后台查询的条件
				switch(index){
					case 1:
						this.paidStatus = 0; 
						break;
					case 2:
						this.paidStatus = 1; 
						break;
					default:
						this.paidStatus = 2; 
						break;						
				}
			},
			//删除订单
			deleteOrder(index){
				uni.showModal({
					content:"删除订单？",
					success: (e) => {
						if(e.confirm){
							uni.showLoading({
								title:"请稍后"
							});
							setTimeout(()=>{
								this.navList[this.tabCurrentIndex].orderList.splice(index, 1);
								uni.hideLoading();
								}, 600)
						}
					}
				})
			},
			//取消订单
			cancelOrder(item){
				uni.showLoading({
					title: '请稍后'
				})
				setTimeout(()=>{
					console.log('state before '+ JSON.stringify(item))
					let {stateTip, stateTipColor} = this.orderStateExp(3);
					item = Object.assign(item, {
						state: 3,
						stateTip, 
						stateTipColor
					})
					console.log('state after '+ JSON.stringify(item))
					//取消订单后删除待付款中该项
					let list = this.navList[1].orderList;
					let index = list.findIndex(val=>val.id === item.id);
					index !== -1 && list.splice(index, 1);
					
					uni.hideLoading();
				}, 600)
				// uni.showModal({
				// 	content: '确定取消订单？',
				// 	success: (e)=>{
				// 		if(e.confirm){
							
				// 		}
				// 	}
				// })				
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
							// 提交 后台处理
							this.requestForPaidOrder(item.orderUuid);				
							setTimeout(()=>{
								let {stateTip, stateTipColor} = this.orderStateExp(true);
								item = Object.assign(item, {
									state: true,
									stateTip, 
									stateTipColor
								})								
								//取消订单后前端缓存中删除待付款中该项
								// let list = this.navList[1].orderList;
								// let index = list.findIndex(val=>val.orderUuid === item.orderUuid);
								// index !== -1 && list.splice(index, 1);
								// 放入已取消tab
								// this.navList[3].orderList.orderList.push()
								uni.hideLoading();
							}, 300)
						}
					}
				})				
			},
						
			//订单详细
			showOrder(item){
				uni.navigateTo({
					url: `/pages/order/orderDetail?data=${JSON.stringify(item)}`
				})
			},
			
			//修改订单
			editOrder(item){
				uni.navigateTo({
					url: `/pages/order/editOrder?data=${JSON.stringify(item)}`
				})
			},

			//订单状态文字和颜色
			orderStateExp(state){
				let stateTip = '',
					stateTipColor = '#fa436a';
				switch(state){
					case false:
						stateTip = '待付款'; 
						break;
					case true:
						stateTip = '已完成'; 
						stateTipColor = '#000000';
						break;
					case 3:
						stateTip = '订单已取消'; 
						stateTipColor = '#888a90';
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
			padding: 20upx 0;
			.goods-img{
				display: block;
				width: 120upx;
				height: 120upx;
			}
			.right{
				flex: 1;
				display: flex;
				flex-direction: column;
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
					padding: 10upx 12upx;
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
			padding: 20upx 30upx;
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
