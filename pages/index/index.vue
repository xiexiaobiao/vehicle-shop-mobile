<template>
	<view class="content">
		<report v-if="PageCur=='report'"></report>
		<!-- <report v-if="PageCur=='report'"></report>
		<order v-if="PageCur=='order'"></order>
		<stock v-if="PageCur=='stock'"></stock>
		<extension v-if="PageCur=='extension'"></extension>
		<view class="cu-bar tabbar bg-white shadow foot">
			<view class="action" @click="NavChange" data-cur="report">
				<view class='cuIcon-cu-image'>
					<image :src="'/static/tabbar/report' + [PageCur=='report'?'_cur':''] + '.png'"></image>
				</view>
				<view :class="PageCur=='report'?'text-green':'text-gray'">首页</view>
			</view>
			<view class="action" @click="NavChange" data-cur="order">
				<view class='cuIcon-cu-image'>
					<image :src="'/static/tabbar/order' + [PageCur == 'order'?'_cur':''] + '.png'"></image>
				</view>
				<view :class="PageCur=='order'?'text-green':'text-gray'">订单</view>
			</view>
			<view class="action" @click="NavChange" data-cur="stock">
				<view class='cuIcon-cu-image'>
					<image :src="'/static/tabbar/stock' + [PageCur == 'stock'?'_cur':''] + '.png'"></image>
				</view>
				<view :class="PageCur=='stock'?'text-green':'text-gray'">库存</view>
			</view>
			<view class="action" @click="NavChange" data-cur="extension">
				<view class='cuIcon-cu-image'>
					<image :src="'/static/tabbar/extension' + [PageCur == 'extension'?'_cur':''] + '.png'"></image>
				</view>
				<view :class="PageCur=='extension'?'text-green':'text-gray'">菜单</view>
			</view>
		</view> -->
	</view>
</template>

<script>
	export default {
		data() {
		return {
				PageCur: 'report'
			}
		},
		methods: {
			NavChange: function(e) {
				this.PageCur = e.currentTarget.dataset.cur
			}
		},
		onLoad() {
			uni.showTabBar({
				animation: true
			})
		}
	}
</script>

<style>

</style>
