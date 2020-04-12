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
				<image src="/static/componentBg.png" mode="widthFix" class="response"></image>
				<view class="nav-list">
					<navigator hover-class='none' :url="'/pages/report/' + item.name" class="nav-li" navigateTo :class="'bg-'+item.color"
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
		data() {
			return {
				elements: [{
						title: '月度订单',
						name: 'order',
						color: 'purple',
						cuIcon: 'vipcard'
					},
					{
						title: '月度销售额 ',
						name: 'sale',
						color: 'mauve',
						cuIcon: 'formfill'
					},
					{
						title: '商品库存图',
						name: 'stock',
						color: 'pink',
						cuIcon: 'list'
					},
					{
						title: '客户分析图',
						name: 'customer',
						color: 'brown',
						cuIcon: 'newsfill'
					},
					{
						title: '客户量趋势图',
						name: 'cusQuantity',
						color: 'red',
						cuIcon: 'formfill'
					},
					{
						title: '预留位置',
						name: 'test',
						color: 'orange',
						cuIcon: 'timefill'
					},
					{
						title: '预留位置',
						name: 'chat',
						color: 'green',
						cuIcon: 'messagefill'
					},
					{
						title: '预留位置',
						name: 'swiper',
						color: 'olive',
						cuIcon: 'album'
					},
					{
						title: '预留位置',
						name: 'modal',
						color: 'grey',
						cuIcon: 'squarecheckfill'
					},
					{
						title: '预留位置',
						name: 'steps',
						color: 'cyan',
						cuIcon: 'roundcheckfill'
					}
				],
			};
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

<style lang='scss'>
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
