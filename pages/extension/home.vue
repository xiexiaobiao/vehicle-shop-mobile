<template name="basics">
	<view>
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
</template>

<script>
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
		}
	}
</script>

<style>
	.page {
		height: 100vh;
	}
</style>
