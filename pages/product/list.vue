<template>
	<view >
		<view>
<!-- 			<cu-custom bgColor="bg-gradual-blue" :isBack="true">
				<block slot="backText">返回</block>
				<block slot="content">商品列表</block>
				<block slot="right">信息</block>
			</cu-custom> -->
		</view>

		<view class="content">				
			<view class="navbar" :style="{position:headerPosition,top:headerTop}">
				<view>
				   <uni-search-bar radius="100" placeholder="名称关键字" bgColor="#EEEEEE" @cancel="searchCancel" @confirm="search" />
			    </view>
				<view style="display: flex; flex-direction:row;">
				
				<view class="nav-item" :class="{current: filterIndex === 0}" @click="tabClick(0)">
					综合排序
				</view>
				<view class="nav-item" :class="{current: filterIndex === 1}" @click="tabClick(1)">
					销量优先
				</view>
				<view class="nav-item" :class="{current: filterIndex === 2}" @click="tabClick(2)">
					<text>价格</text>
					<view class="p-box">
						<text :class="{active: priceOrder === 1 && filterIndex === 2}" class="yticon icon-shang"></text>
						<text :class="{active: priceOrder === 2 && filterIndex === 2}" class="yticon icon-shang xia"></text>
					</view>
				</view>
				<text class="cate-item yticon icon-fenlei1" @click="toggleCateMask('show')"></text>
				</view>
				
			</view>
		    <scroll-view scroll-y="true"  >
					<view class="list b-b" v-for="(item, index) in goodsList" :key="index">
						<view class="wrapper">
							
							<view class="customer-box" >
								<!-- <checkbox  color="#FFCC33" style="transform:scale(0.5)" /> -->
								<switch type="checkbox" :checked="item.checked" style="width: 60upx;height: 30upx;"  @change="switchChange(item)"></switch>
								<text class="customer">{{item.itemUuid}} {{item.itemName}}</text>
							</view>
							<view class="u-box">
								<text class="name">{{item.category}} </text>
								<text class="name">￥{{item.sellPrice}} </text>
								<text class="name">{{item.brandName}} </text>
								<text class="mobile">{{item.specification}}</text>
								<text class="name" v-if="item.labourFee"> 工时￥{{item.labourFee}} </text>
								<text class="name" v-if="item.materialFee"> 材料￥{{item.materialFee}}</text>
							</view>
						</view>
						<text class="yticon icon-bianji" @click.stop="editItem('edit', item)"></text>
					</view>
			<uni-load-more :status="loadingType"></uni-load-more>
			</scroll-view>
		
			<view class="cate-mask" :class="cateMaskState===0 ? 'none' : cateMaskState===1 ? 'show' : ''" @click="toggleCateMask">
			<view class="cate-content" @click.stop.prevent="stopPrevent" @touchmove.stop.prevent="stopPrevent">
				<scroll-view scroll-y class="cate-list" >
					<view v-for="item in cateList" :key="item.id">
						<view class="cate-item b-b" :class="{active: item.id==cateId}" @click="changeCate(item)">{{item.name}}</view>
<!-- 						<view 
							v-for="tItem in item.child" :key="tItem.id" 
							class="cate-item b-b" 
							:class="{active: tItem.id==cateId}"
							@click="changeCate(tItem)">
							{{tItem.name}}
						</view> -->
					</view>
				<button type="primary" plain="true" @click="cancelCate"> 取消分类</button>
				</scroll-view>
				
			</view>
		</view>		
	  </view>
	</view>
	
</template>

<script>
	import Request from '@/plugins/request/js/index.js'
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import uniSearchBar from '@/components/uni-search-bar/uni-search-bar.vue'
	
	export default {
		components: {
			uniLoadMore	
		},
		data() {
			return {
				itemName: '',//模糊查询
				//已选择的商品数量
				totalChecked: 0,
				// 分页实现页面懒加载
				pageInfo:{
					"total": 0, 
					"size": 15,  // 每次懒加载的页面数据量
					"current":1	 ,//	首次请求的初始页值，之后每请求一次就累加 1					
				},
				cateMaskState: 0, //分类面板展开状态
				headerPosition:"fixed",
				headerTop:"0px",
				loadingType: 'more', //加载更多状态
				filterIndex: 0, 
				cateId: 0, //已选三级分类id
				priceOrder: 0, //1 价格从低到高 2价格从高到低
				cateList: [],
				goodsList: [],
				toAddItemList: [],
				category: '' //查询条件：类别
			};
		},
		
		onLoad(options){
			uni.showLoading({
				title: '数据拼命加载中...',
				mask: true
			});
			// #ifdef H5
			this.headerTop = document.getElementsByTagName('uni-page-head')[0].offsetHeight+'px';
			// #endif
			this.cateId = options.tid;
			this.loadCateList(options.fid,options.sid);
			
			// 页面懒加载：先默认加载一个页面量数据
			this.requesForData();
		},
		onReady() {
			uni.hideLoading();
			this.setStyle(0,true,'10');
			this.setStyle(1,true,'0');
		},
		/*  */
		onPageScroll(e){
			//兼容iOS端下拉时顶部漂移
			if(e.scrollTop>=0){
				this.headerPosition = "fixed";
			}else{
				this.headerPosition = "absolute";
			}
		},
		
		/* uni-app: onPullDownRefresh() 和 onReachBottom()，也可以实现页面到底刷新，
          效果和<scroll-view scroll-y @scrolltolower="loadData" > 等价！！！ */
		  
		//下拉刷新
		onPullDownRefresh(){
			this.loadData('refresh');
		},
		//加载更多
		onReachBottom(){
			console.log("onReachBottom")
			this.loadData();
		},
		onNavigationBarButtonTap(e) {
			if(e.index === 1){
				uni.showToast({
					title: '您已选'+ e.badgeText.toString() +'件商品',
					icon: "none",
					duration: 800
				})
				
				// 取消红点或者角标
/* 				this.setStyle(e.index,false,"0");
				uni.navigateTo({
					url: "../order/cart" //跳转到未完成订单
				}) */
			}else if(e.index === 0){
				uni.navigateTo({
					url: "../product/newProduct" //跳转到新增
				})
			}else if(e.index === 2){
				// 
				this.$api.prePage().dtoList = this.toAddItemList ;
				console.log('pre '+this.$api.prePage().orderData.detail.length)
				console.log('toadd '+this.toAddItemList.length);
				uni.navigateBack({
					url: "../order/editOrder" //跳转到订单
				})
			}
			
		},
		methods: {
			search: function(e){
				this.itemName = e.value ; 
				//初始化查询数据
				this.goodsList = [];
				this.loadingType = 'more';
				this.pageInfo.current = 1;
				this.loadData('add', 1);
			},
			searchCancel: function(){
				this.itemName = '' ;
				//初始化查询数据
				this.goodsList = [];
				this.loadingType = 'more';
				this.pageInfo.current = 1;
				this.loadData('add', 1);
			},
			/**
			 * 修改导航栏buttons
			 * index[number] 修改的buttons 下标索引，最右边索引为0
			 * show[boolean] 显示还是隐藏角标或者红点
			 * text[string] 需要修改的角标的text 内容 ，如果定义redDot 此参数无效 ，如果定义badgeText请设置具体，如果不用输入
			 */
			setStyle(index, show, text) {
				// console.log(text)
				let pages = getCurrentPages();
				let page = pages[pages.length - 1];
				// #ifdef APP-PLUS
				let currentWebview = page.$getAppWebview();
				if(show){
					if(index === 0){
						currentWebview.showTitleNViewButtonRedDot({index:index,text:text})
					}else{
						currentWebview.setTitleNViewButtonBadge({index:index,text:text})
					}
				}else{
					if(index === 0){
						currentWebview.hideTitleNViewButtonRedDot({index:index})
					}else{
						currentWebview.removeTitleNViewButtonBadge({index:index})
					}
				}				
				// #endif
			},
			async switchChange(item){
				item.checked = !item.checked;
				// console.log(JSON.stringify(item));
				let requestItem={};
				if(item.checked){
					// 获取商品详细					
					await Request().request({
						url: 'stock/vehicle/stock/item/uid/'+ item.itemUuid,
						method: 'get',
						header: {},
						params: {}
					}).then(
						res => {
							// 返回的对象，多一层data封装，故写为response.data
							requestItem = res.data;
					}).catch(err => {
						console.error('is catch', err)
						this.err = err;
						})
					
					// 设置数量默认值
					requestItem = Object.assign(requestItem,{
						discountPrice: requestItem.sellPrice,
					})
					requestItem.quantity = 1;
					//加入vuex缓存,commit是同步方法
					// this.$store.commit('addCartItems',requestItem);
					this.toAddItemList.push(requestItem);
					//修改角标值
					this.totalChecked += 1;
					this.setStyle(1,true,this.totalChecked);
					uni.showToast({
						    title: "选择商品成功！",
							icon: 'info',
							duration: 300
							});
				}else{
					// this.$store.commit("deleteCartItem",item)
					// 删除临时数组中的值
					let index = this.toAddItemList.findIndex(item=>item.itemUuid === requestItem.itemUuid);
					this.toAddItemList.splice(index,1);
					this.totalChecked -= 1;
					this.setStyle(1,true,this.totalChecked);
					uni.showToast({
						    title: "取消商品成功！",
							icon: 'info',
							duration: 300
							});
				}
					
			},
			//
			editItem(type, item){
				uni.navigateTo({
					url: `/pages/product/newProduct?type=${type}&data=`+ JSON.stringify(item)
				})
			},
			// 
			requesForData:function(){
			return	Request().request({
					url:'stock/vehicle/stock/item/list',
					method: 'get',
					header:{},
					params: {
						'pageNum': this.pageInfo.current,
						'pageSize': this.pageInfo.size,
						'category': this.category,
						'itemName': this.itemName
					  },
					}				
				).then(
					res => {
						// json 和 str 转换 JSON.stringify  JSON.parse
						// console.log('res--->>>'+ JSON.stringify(res.data.records))
						let pdtArr = res.data.records;
						// 打印类型
						// console.log(Object.prototype.toString.call(pdtArr));
						this.goodsList = this.goodsList.concat(pdtArr);
						// 每个item增加一个checked字段表示 是否选中
						this.goodsList.forEach(item=>{
							item = Object.assign(item,{
								checked: false,
								quantity: 1 // 默认数量
							})
						})
						// 懒加载机制 --> 加载一次后累加页数
						this.pageInfo.total = res.data.total;
						this.pageInfo.current  += 1;
						// console.log(this.pageInfo.total);
						// console.log(this.pageInfo.current +' / '+this.pageInfo.size );
						// console.log(goodsList.length);
					}
				).catch(err => {
				    console.error('is catch', err)
				    this.err = err;
				 });
			},
			//加载分类
			async loadCateList(fid, sid){
				await Request().request({
					url: 'stock/vehicle/stock/category/list',
					method: 'get',
					header: {},
					params: {
						'pageNum': 1,
						'pageSize': 99,
					}
				}).then(
					res => {
						// 返回的对象，多一层data封装，故写为response.data
						// console.log(JSON.stringify(res.records));
						let cateArr = res.data.records;
						let i = 0;
						cateArr.forEach(
							item=>{
									this.cateList.push({name:item,id:i});
									i++;
								}
						)
					// console.log(this.cateList);	
				}).catch(err => {
					console.error('is catch', err)
					this.err = err;
					})
				/* let list = await this.$api.json('cateList');
				let cateList = list.filter(item=>item.pid == fid);
				
				cateList.forEach(item=>{
					let tempList = list.filter(val=>val.pid == item.id);
					item.child = tempList;
				})
				this.cateList = cateList; */
			},
			//加载商品 ，带下拉刷新和上滑加载 ('refresh', 1);
			async loadData(type='add', loading) {
				console.log("loadData   " + this.loadingType)
				//没有更多直接返回
				if(type === 'add'){
					if(this.loadingType === 'nomore'){
						return;
					}
				}
				this.loadingType === 'loading';
								
				// 请求后台数据
				await this.requesForData();
				
				// console.log("this.goodsList: " + this.goodsList.length)
										
				if(type === 'refresh'){
				//直接前端筛选
				if(this.filterIndex === 1){
					this.goodsList.sort((a,b)=>b.sellPrice - a.sellPrice)
				}
				if(this.filterIndex === 2){
					this.goodsList.sort((a,b)=>{
						if(this.priceOrder == 1){
							return a.sellPrice - b.sellPrice;
						}
						return b.sellPrice - a.sellPrice;
					})
				}
				}
												
				//判断是否还有下一页，有是more  没有是nomore
				if(this.pageInfo.total <= (this.pageInfo.current-1) * this.pageInfo.size){
					this.loadingType = 'nomore';					
				}else if(this.pageInfo.total > (this.pageInfo.current-1) * this.pageInfo.size){
					this.loadingType = 'more';
				}
				console.log(this.loadingType);
				// 
				if(type === 'refresh'){
					if(loading == 1){
						uni.hideLoading()
					}else{
						uni.stopPullDownRefresh();
					}
				}
				//					
			},
			//排序点击，只有前端处理
			tabClick(index){
				if(this.filterIndex === index && index !== 2){
					return;
				}
				this.filterIndex = index;
				if(index === 2){
					this.priceOrder = (this.priceOrder === 1 ? 2: 1);
				}else{
					this.priceOrder = 0;
				}
				uni.pageScrollTo({
					duration: 300,
					scrollTop: 0
				})
				this.loadData('refresh', 1);
				uni.showLoading({
					title: '正在加载'
				})
			},
			//显示分类面板
			toggleCateMask(type){
				let timer = type === 'show' ? 10 : 300;
				let	state = type === 'show' ? 1 : 0;
				this.cateMaskState = 2;
				setTimeout(()=>{
					this.cateMaskState = state;
				}, timer)
			},
			//分类点击
			changeCate(item){
				this.cateId = item.id;
				this.category = item.name;
				this.toggleCateMask();
				uni.pageScrollTo({
					duration: 300,
					scrollTop: 0
				})
				//初始化查询数据
				this.goodsList = [];
				this.loadingType = 'more';
				this.pageInfo.current = 1;
				this.loadData('add', 1);
/* 				uni.showLoading({
					title: '正在加载'
				}) */
			},
			//取消分类浏览
			cancelCate(){
				this.toggleCateMask();
				//初始化查询数据
				this.goodsList = [];
				this.loadingType = 'more';
				this.pageInfo.current = 1;
				this.category = '';
				this.loadData('add', 1);

			},
			//详情
			navToDetailPage(item){
				let uid = item.itemUuid;
				let itemName = item.itemName;
				uni.navigateTo({
					url: `/pages/product/product?uid=${uid}&itemName=${itemName}`
				})
			},
			stopPrevent(){}
		},
	}
</script>

<style lang="scss">
	page{
		padding-bottom: 10upx;
	}
	.content{
		position: relative;
		background: $page-color-base;
		padding-top: 160upx;
	}
	.list{
		display: flex;
		align-items: center;
		padding: 20upx 30upx;;
		background: #fff;
		position: relative;
	}
	.wrapper{
		display: flex;
		flex-direction: column;
		flex: 1;
	}
	.customer-box{
		display: flex;
		flex-direction: row;
		align-items: baseline ;
		.tag{
			font-size: 24upx;
			color: $base-color;
			margin-right: 10upx;
			background: #fffafb;
			border: 1px solid #ffb4c7;
			border-radius: 4upx;
			padding: 4upx 10upx;
			line-height: 1;
		}
		.customer{
			font-size: 30upx;
			color: $font-color-dark;
		}
	}
	.u-box{
		font-size: 28upx;
		color: $font-color-light;
		margin-top: 16upx;
		.name{
			margin-right: 30upx;
		}
	}
	.icon-bianji{
		display: flex;
		align-items: center;
		height: 80upx;
		font-size: 40upx;
		color: $font-color-light;
		padding-left: 30upx;
	}
	
	.add-btn{
		position: fixed;
		left: 30upx;
		right: 30upx;
		bottom: 16upx;
		z-index: 95;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 690upx;
		height: 80upx;
		font-size: 32upx;
		color: #fff;
		background-color: $base-color;
		border-radius: 10upx;
		box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);		
	}
/* 	 .content{
		background: $page-color-base;
	}
	.content{
		padding-top: 96upx;
	} */

	.navbar{
		position: fixed;
		flex-direction:column;
		left: 0;
		top: var(--window-top);
		display: flex;
		width: 100%;
		height: 160upx;
		background: #fff;
		box-shadow: 0 2upx 10upx rgba(0,0,0,.06);
		z-index: 10;
		.nav-item{
			flex: 1;
			display: flex;
			justify-content: center;
			align-items: center;
			height: 100%;
			font-size: 30upx;
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
					width: 120upx;
					height: 0;
					border-bottom: 4upx solid $base-color;
				}
			}
		}
		.p-box{
			display: flex;
			flex-direction: column;
			.yticon{
				display: flex;
				align-items: center;
				justify-content: center;
				width: 30upx;
				height: 14upx;
				line-height: 1;
				margin-left: 4upx;
				font-size: 26upx;
				color: #888;
				&.active{
					color: $base-color;
				}
			}
			.xia{
				transform: scaleY(-1);
			}
		}
		.cate-item{
			display: flex;
			justify-content: center;
			align-items: center;
			height: 100%;
			width: 80upx;
			position: relative;
			font-size: 44upx;
			&:after{
				content: '';
				position: absolute;
				left: 0;
				top: 50%;
				transform: translateY(-50%);
				border-left: 1px solid #ddd;
				width: 0;
				height: 36upx;
			}
		}
	}

	/* 分类 */
	.cate-mask{
		position: fixed;
		left: 0;
		top: var(--window-top);
		bottom: 0;
		width: 100%;
		background: rgba(0,0,0,0);
		z-index: 95;
		transition: .3s;
		
		.cate-content{
			width: 630upx;
			height: 100%;
			background: #fff;
			float:right;
			transform: translateX(100%);
			transition: .3s;
		}
		&.none{
			display: none;
		}
		&.show{
			background: rgba(0,0,0,.4);
			
			.cate-content{
				transform: translateX(0);
			}
		}
	}
	.cate-list{
		display: flex;
		flex-direction: column;
		height: 100%;
		.cate-item{
			display: flex;
			align-items: center;
			height: 90upx;
			padding-left: 30upx;
 			font-size: 28upx;
			color: #555;
			position: relative;
		}
		.two{
			height: 64upx;
			color: #303133;
			font-size: 30upx;
			background: #f8f8f8;
		}
		.active{
			color: $base-color;
		}
	}

	/* 商品列表 */
	.goods-list{
		display:flex;
		flex-wrap:wrap;
		padding: 0 30upx;
		background: #fff;
		.goods-item{
			display:flex;
			flex-direction: column;
			width: 48%;
			padding-bottom: 40upx;
			&:nth-child(2n+1){
				margin-right: 4%;
			}
		}
		.image-wrapper{
			width: 100%;
			height: 330upx;
			border-radius: 3px;
			overflow: hidden;
			image{
				width: 100%;
				height: 100%;
				opacity: 1;
			}
		}
		.title{
			font-size: $font-lg;
			color: $font-color-dark;
			line-height: 80upx;
		}
		.price-box{
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding-right: 10upx;
			font-size: 24upx;
			color: $font-color-light;
		}
		.price{
			font-size: $font-lg;
			color: $uni-color-primary;
			line-height: 1;
			&:before{
				content: '￥';
				font-size: 26upx;
			}
		}
	}
	

</style>
