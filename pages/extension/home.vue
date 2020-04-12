<template name="basics">
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
			<image src="/static/menuBg.png" mode="widthFix" class="response"></image>
			<view class="nav-list">
				<navigator hover-class="none" :url="'/pages/' + item.name" class="nav-li" navigateTo :class="'bg-'+item.color"
				 :style="[{animation: 'show ' + ((index+1)*0.2+1) + 's 1'}]" v-for="(item,index) in elements" :key="index">
					<view class="nav-title">{{item.title}}</view>
					<view class="nav-name">{{item.name}}</view>
					<text :class="'cuIcon-' + item.cuIcon"></text>
				</navigator>
			</view>
			<view class="cu-tabbar-height"></view>
		</scroll-view>
		</view>
	</view>
</template>

<script>
	import { mapGetters, mapState,mapActions,mapMutations } from 'vuex'
	
	export default {
		name: "basics",
		data() {
			return {
				elements: [{
						title: '商品类别',
						name: '',
						color: 'cyan',
						cuIcon: 'newsfill'
					},
					{
						title: '客户信息',
						name: 'customer/customer',
						color: 'blue',
						cuIcon: 'colorlens'
					},
					{
						title: '品牌管理',
						name: 'brand',
						color: 'purple',
						cuIcon: 'font'
					},
					{
						title: '采购入库 ',
						name: 'icon',
						color: 'mauve',
						cuIcon: 'cuIcon'
					},
					{
						title: '店铺信息',
						name: 'button',
						color: 'pink',
						cuIcon: 'btn'
					},
					{
						title: '系统帮助',
						name: 'tag',
						color: 'brown',
						cuIcon: 'tagfill'
					},
					{
						title: '联系作者',
						name: 'avatar',
						color: 'red',
						cuIcon: 'myfill'
					},
					{
						title: '版权信息',
						name: 'progress',
						color: 'orange',
						cuIcon: 'icloading'
					},
					// {
					// 	title: '边框阴影',
					// 	name: 'shadow',
					// 	color: 'olive',
					// 	cuIcon: 'copy'
					// },
					// {
					// 	title: '加载',
					// 	name: 'loading',
					// 	color: 'green',
					// 	cuIcon: 'loading2'
					// }
				],
			};
		},
		onShow() {
			console.log("success")
		},
		computed:{
			...mapState(['hasLogin'])
		},
		methods:{
			navToLogin(){
				uni.navigateTo({
					url: '/pages/login/login-home'
				})
			},
		}
	}
</script>

<style lang="scss">
	.page {
		height: 100vh;
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
