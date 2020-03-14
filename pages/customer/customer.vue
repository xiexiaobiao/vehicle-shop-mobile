<template>
	<view class="content b-t">
		<view class="list b-b" v-for="(item, index) in customerList" :key="index" @click="checkcustomer(item)">
			<view class="wrapper">
				<view class="customer-box">
					<text v-if="item.default" class="tag">默认</text>
					<text class="customer">{{item.clientName}} {{item.phone}} {{item.vehiclePlate}} </text>
				</view>
				<view class="u-box">
					<text class="name">{{item.clientUuid}} </text>
					<text class="mobile">{{item.vehicleSeries}}</text>
				</view>
			</view>
			<text class="yticon icon-bianji" @click.stop="addcustomer('edit', item)"></text>
		</view>
		<text style="display:block;padding: 16upx 30upx 10upx;lihe-height: 1.6;color: #fa436a;font-size: 24upx;">
			重要：客户‘刘晓晓’为程序示例客户，请忽略！
		</text>
		
		<button class="add-btn" @click="addcustomer('add')">新增客户</button>
	</view>
</template>

<script>
	import Request from '@/plugins/request/js/index.js'
	
	export default {
		data() {
			return {
				pageType: '', //
				customerList: [
					{
						idClient:'',
						clientUuid: '',
						clientName: '刘晓晓',
						age: '',
						gender: '',
						vehiclePlate: '粤A99999',
						vehicleSeries: '宝马5系',
						phone: '18666666666',
						addr: '北京市东城区',
						generateDate: '',
						modifyDate: '',
						point:''
						// default: true
					}
				]
			}
		},
		onLoad(option){
			// console.log('option >>>'+ JSON.parse(option.pageType))
			// 使用封装的 request
			Request().request({
				url:'client/vehicle/client/list',
				method: 'get',
				header:{},
				params: {
					'pageNum': 1,
					'pageSize': 10000
				  },
				}				
			).then(
				res => {
					// json 和 str 转换 JSON.stringify  JSON.parse
					// console.log('res--->>>'+ JSON.stringify(res))
					let customerArr = res.data.list;
					// 打印类型
					// console.log(Object.prototype.toString.call(customerArr));
					this.customerList = this.customerList.concat(customerArr);
					// console.log(this.customerList.length);
				}
			).catch(err => {
			    console.error('is catch', err)
			    this.err = err;
			 });
			 
			if(option.pageType){
			// console.log(option.value);
			const value = JSON.parse(decodeURIComponent(option.pageType));
			this.pageType = value;
			}else{
				
			}			
		},
		methods: {
			//选择客户
			checkcustomer(item){
				if(this.pageType == 'new' || this.pageType  == 'draft' ){
					// 保存vuex信息
					this.$store.commit('saveCustomerInfo',item);
					//this.$api.prePage()获取上一页实例，在App.vue定义
					this.$api.prePage().customerData = item;
					uni.navigateBack()
				}else if(this.pageType == 'edit' ){
					this.$api.prePage().customerData = item;
					uni.navigateBack()
				}
			},
			addcustomer(type, item){
				uni.navigateTo({
					url: `/pages/customer/cusManage?type=${type}&data=${JSON.stringify(item)}`
				})
			},
			//添加或修改成功之后回调
			refreshList(data, type){
				
				//添加或修改后事件，这里直接在最前面添加了一条数据，实际应用中直接刷新地址列表即可
				this.customerList.unshift(data);				
				console.log(data, type);
			}
		}
	}
</script>

<style lang='scss'>
	page{
		padding-bottom: 120upx;
	}
	.content{
		position: relative;
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
		align-items: center;
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
</style>
