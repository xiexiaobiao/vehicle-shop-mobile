<template>
	<view>
		<view class="VerticalBox">
			<scroll-view class="VerticalNav nav" scroll-y scroll-with-animation :scroll-top="verticalNavTop" style="height:calc(100vh - 375upx)">
				<view class="cu-item" :class="index==tabCur?'text-green cur':''" v-for="(item,index) in catelist" :key="index" @tap="TabSelect"
				 :data-id="index">
					{{item.name}}
				</view>
			</scroll-view>
			<scroll-view class="VerticalMain" scroll-y scroll-with-animation style="height:calc(120vh - 375upx)"
			 :scroll-into-view="'main-'+mainCur" @scroll="VerticalMain">
				<view  class="padding-top padding-lr" v-for="(item,index) in catelist" :key="index" :id="'main-'+index">
					<view class="cu-bar solid-bottom bg-white">
						<view class="action">
							<text class="cuIcon-title text-green"></text>{{item.name}}</view>
					</view>
					<view class="cu-list menu-avatar" v-if="item.name === gitem.category" v-for="(gitem,index) in itemlist" :key="index">
						<view class="cu-item cur"  @click="navToItem(gitem)">
							<view class="cu-avatar radius lg" style=" background-image:url(+${gitem.picAddr});">
								<image class="Itemimage" :src="gitem.picAddr"></image>
								<view class="cu-tag badge"></view>
							</view>
							<view class="content">
								<view class="text-pink">
									<text class="text-cut">{{gitem.itemName}}</text>
									<view class="cu-tag round bg-orange sm">{{gitem.brandName}}</view>
								</view>
								<view class="text-gray">
									<text class="text-cut">￥{{gitem.sellPrice}}</text>
									<text class="cuIcon-locationfill text-orange margin-right-xs"/>
									</text> {{gitem.specification}}</text></view>
							</view>
							<view class="action">
								<view class="text-grey text-xs">{{gitem.itemUuid}}</view>
								<view class="text-grey text-xs">{{gitem.unit}}</view>
							</view>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>	
	import Request from '@/plugins/request/js/index.js'
	
	export default {
		data() {
			return {
				catelist: [],
				itemlist: [],
				tabCur: 0,
				mainCur: 0,
				verticalNavTop: 0,
				load: true
			};
		},
		onLoad() {
			uni.showLoading({
				title: '数据拼命加载中...',
				mask: true
			});
			let list = [{}];
			
			// 获取分类
			Request().request({
				url:'stock/vehicle/stock/item/categories',
				method: 'get',
				header:{},
				params: {},
				}				
			).then(
				res => {
					// json 和 str 转换 JSON.stringify  JSON.parse
					console.log('res--->>>'+ JSON.stringify(res))
					let cateArr = res.data;
					// 打印类型
					console.log(Object.prototype.toString.call(cateArr));
					for(let i = 0; i < cateArr.length; i++){
						list[i] = {};
						list[i].name = cateArr[i].toString();
						list[i].id = i;
					}
					this.catelist = list;
					this.listCur = list[0];
					console.log(list.length);
				}
			).catch(err => {
			    console.error('is catch', err)
			    this.err = err;
			 });
			 
			 // 获取商品列表
			 Request().request({
			 	url:'stock/vehicle/stock/item/list',
			 	method: 'get',
			 	header:{},
			 	params: {
			 		'pageNum': 1,
			 		'pageSize': 1000
			 	  },
			 	}				
			 ).then(
			 	res => {
			 		// json 和 str 转换 JSON.stringify  JSON.parse
			 		// console.log('res--->>>'+ JSON.stringify(res))
			 		let pdtArr = res.data.records;
			 		// 打印类型
			 		console.log(Object.prototype.toString.call(pdtArr));
			 		this.itemlist = this.itemlist.concat(pdtArr);
			 		console.log(this.itemlist.length);
			 	}
			 ).catch(err => {
			     console.error('is catch', err)
			     this.err = err;
			  });
			 
/* 			for (let i = 0; i < 26; i++) {
				list[i] = {};
				list[i].name = String.fromCharCode(65 + i);
				list[i].id = i;
			} */
/* 			
			this.list = list;
			this.listCur = list[0]; */
		},
		onReady() {
			uni.hideLoading()
		},
		methods: {
			
			navToItem: function(gitem){
				let uid = gitem.itemUuid;
				let itemName = gitem.itemName;
				uni.navigateTo({
					url: `/pages/product/product?uid=${uid}&itemName=${itemName}`
				})
			},
			
			TabSelect(e){
				this.tabCur = e.currentTarget.dataset.id;
				this.mainCur = e.currentTarget.dataset.id;
				this.verticalNavTop = (e.currentTarget.dataset.id - 1) * 50
			},
			VerticalMain(e) {
				// #ifdef MP-ALIPAY
				   return false  //支付宝小程序暂时不支持双向联动 
				// #endif
				let that = this;
				let tabHeight = 0;
				if (this.load) {
					for (let i = 0; i < this.catelist.length; i++) {
						let view = uni.createSelectorQuery().select("#main-" + this.catelist[i].id);
						view.fields({
							size: true
						}, data => {
							this.catelist[i].top = tabHeight;
							tabHeight = tabHeight + data.height;
							this.catelist[i].bottom = tabHeight;
						}).exec();
					}
					this.load = false
				}
				let scrollTop = e.detail.scrollTop + 10;
				for (let i = 0; i < this.catelist.length; i++) {
					if (scrollTop > this.catelist[i].top && scrollTop < this.catelist[i].bottom) {
						this.verticalNavTop = (this.catelist[i].id - 1) * 50
						this.tabCur = this.catelist[i].id
						console.log(scrollTop)
						return false
					}
				}
			}
		},
	}
</script>

<style>
	.fixed {
		position: fixed;
		z-index: 99;
	}
	
	.VerticalNav.nav {
		width: 200upx;
		white-space: initial;
	}
	
	.VerticalNav.nav .cu-item {
		width: 100%;
		text-align: center;
		background-color: #fff;
		margin: 0;
		border: none;
		height: 50px;
		position: relative;
	}
	
	.VerticalNav.nav .cu-item.cur {
		background-color: #f1f1f1;
	}
	
	.VerticalNav.nav .cu-item.cur::after {
		content: "";
		width: 10upx;
		height: 50upx;
		border-radius: 15upx 0 0 15upx;
		position: absolute;
		background-color: currentColor;
		top: 0;
		right: 0upx;
		bottom: 0;
		margin: auto;
	}
	
	.VerticalBox {
		display: flex;
	}
	
	.VerticalMain {
		background-color: #f1f1f1;
		flex: 1;
	}
	
	.Itemimage{
		width: 100upx;
		height: 100upx;
	}
</style>
