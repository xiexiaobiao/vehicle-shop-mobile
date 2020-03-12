<template name="components">
	<view>
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
</template>

<script>
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
		}
	}
</script>

<style>
	.page {
		height: 100vh;
	}
</style>
