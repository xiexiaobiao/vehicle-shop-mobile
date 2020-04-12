<template name="components">
	<view class="container">
		<view v-if="!hasLogin">
			<view class="empty empty-tips">
				您还没有登录！
				<view class="navigator" >
					<button class="add-btn" style="background-color: #55aaff; color: #ffffff;" @click="navToLogin">去登录</button>
				</view>
			</view>
		</view>
		<view v-else>
		<scroll-view scroll-y class="page">
			<!-- <cu-custom bgImage="https://image.weilanwl.com/color2.0/plugin/cjkz2329.jpg">
				<block slot="content">
					<image src="/static/cjkz.png" mode="aspectFill" style="width: 240upx;height: 60upx;"></image>
				</block>
			</cu-custom> -->
			<view class="cu-card">
				<view class="cu-item bg-img shadow-blur" :style="[{backgroundImage:'url('+item.img+')'}]" @tap="toChild" :data-url="item.url"
				 v-for="(item,index) in list" :key="index">
					<view class="cardTitle">
						{{item.title}}
					</view>
				</view>
			</view>
			<view class="cu-tabbar-height"></view>
		</scroll-view>
	</view>
	</view>
</template>

<script>
	import { mapGetters, mapState,mapActions,mapMutations } from 'vuex'
	
	export default {
		name: "components",
		data() {
			return {
				StatusBar: this.StatusBar,
				CustomBar: this.CustomBar,
				list: [{
						title: '库存查询',
						img: 'https://image.weilanwl.com/color2.0/plugin/wdh2236.jpg',
						url: '../product/pdtCategory'
					},
					{
						title: '商品列表',
						img: 'https://image.weilanwl.com/color2.0/plugin/qpct2148.jpg',
						url: '../product/pdtCategory'
					},
					{
						title: '新增商品',
						img: 'https://image.weilanwl.com/color2.0/plugin/sylb2244.jpg',
						url: '../product/newProduct'
					},
/* 					{
						title: '预留位置',
						img: 'https://image.weilanwl.com/color2.0/plugin/qpczdh2307.jpg',
						url: '../plugin/verticalnav'
					} */
				]
			};
		},
		computed:{
			...mapState(['hasLogin'])
		},
		methods: {
			toChild(e) {
				uni.navigateTo({
					url: e.currentTarget.dataset.url
				})
			},
			navToLogin(){
				uni.navigateTo({
					url: '/pages/login/login-home'
				})
			},
		},
	}
</script>

<style lang="scss">
	.page {
		height: 100vh;
	}

	.cardTitle {
		color: #fff;
		padding: 90upx 60upx;
		font-size: 40upx;
		font-weight: 300;
		transform: skew(-10deg, 0deg);
		position: relative;
		text-shadow: 0px 0px 6upx rgba(0, 0, 0, 0.3)
	}

	.cardTitle::before {
		content: "";
		position: absolute;
		width: 60upx;
		height: 6upx;
		border-radius: 20upx;
		background-color: #fff;
		display: block;
		top: 60upx;
		left: 50upx;
		transform: skew(10deg, 0deg);
	}

	.cardTitle::after {
		content: "";
		position: absolute;
		width: 140upx;
		border-radius: 6upx;
		height: 24upx;
		background-color: #fff;
		display: block;
		bottom: 76upx;
		left: 90upx;
		transform: skew(10deg, 0deg);
		opacity: 0.1;
	}
	.container{
		padding-bottom: 134upx;
		/* 空白页 */
		.empty{
			position:fixed;
			left: 0;
			top:0;
			width: 100%;
			height: 100vh;
			padding-bottom:100upx;
			display:flex;
			justify-content: center;
			flex-direction: column;
			align-items:center;
			background: #fff;
			image{
				width: 240upx;
				height: 160upx;
				margin-bottom:30upx;
			}
			.empty-tips{
				display:flex;
				font-size: $font-sm+2upx;
				color: $font-color-disabled;
				.navigator{
					color: $uni-color-primary;
					margin-left: 16upx;
				}
			}
		}
	}
</style>
