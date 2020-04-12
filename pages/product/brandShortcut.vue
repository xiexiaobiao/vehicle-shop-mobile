<template>
	<view class="content">
		<view class="row b-b">
			<text class="tit">品牌编码</text>
			<input class="input" type="text" v-model="brandData.brandId"  disabled="true"/>
		</view>
		<view class="row b-b">
			<text class="tit">品牌名称</text>
			<input class="input" type="text" v-model="brandData.brandName" placeholder="(必填项)" placeholder-class="placeholder" />
		</view>
		<view class="row b-b">
			<text class="tit">创建日期</text>
			<input class="input" type="text" v-model="showDate" placeholder-class="placeholder" />
		</view>
		<view class="row b-b">
			<text class="tit">备注说明</text>
			<input class="input" type="text" v-model="brandData.description" placeholder="" placeholder-class="placeholder" />
		</view>
		
		<button class="add-btn" @click="confirm">提交</button>
	</view>
</template>

<script>
	import Request from '@/plugins/request/js/index.js'
	
	export default {
		data() {
			return {
				genderTemp: Boolean,
				manageType: 'add',
				showDate: '',
				brandData: {
					brandId: '',
					brandName: '',
					generateDate: '',
					description: ''
				}
			}
		},
		onLoad(option){
			let title = '新增品牌';
			uni.setNavigationBarTitle({
				title
			})
			// 获取当前日期并格式化
			let myDate = new Date();
			myDate.setMinutes(myDate.getMinutes() - myDate.getTimezoneOffset()); // toJSON 的时区补偿
			let dateFormated =  myDate.toJSON();
			this.showDate = dateFormated.substr(0, 10);
			this.brandData.generateDate = dateFormated.substr(0, 19);
			
			// 使用封装的 request
				Request().request({
					url:'stock/vehicle/stock/max/brandUId',
					method: 'get',
					header:{},
					params: {},
					}				
				).then(
					res => {
						// json 和 str 转换 JSON.stringify  JSON.parse
						let maxBranUuid = res.data;
						let num = 1000 + Number(maxBranUuid.substr(2))+ 1;						
						this.brandData.brandId = maxBranUuid.substr(0,1) + num;
					}
				).catch(err => {
					console.error('is catch', err)
					this.err = err;
				 });		
		},
		methods: {
			
			//提交
			confirm(){
				let data = this.brandData;
				if(!data.brandName){
					this.$api.msg('请填写品牌名称');
					return;
				}
				/// 保存至DB
				Request().post('stock/vehicle/stock/brandSave', {
						header: {
							contentType: 'application/json'
						},
						data: this.brandData,				
				    }).then(
						res => {
							//this.$api.prePage()获取上一页实例，可直接调用上页所有数据和方法，在App.vue定义
							this.$api.prePage().getBrandList(); // 刷新上一页的品牌列表
							this.$api.msg(`品牌添加成功`);
							setTimeout(()=>{
								uni.navigateBack()
							 }, 800)
						}
					);
								
/* 				uni.request({
					url: 'http://10.10.10.203:9195/client/vehicle/client/create',
					method: 'post',
					data: this.customerData,
					success: res => {					
						//this.$api.prePage()获取上一页实例，可直接调用上页所有数据和方法，在App.vue定义
				this.$api.prePage().refreshList(data, this.manageType);
				this.$api.msg(`客户${this.manageType=='edit' ? '修改': '添加'}成功`);
				setTimeout(()=>{
					uni.navigateBack()
				}, 800)
					}
				}); */
			},
		}
	}
</script>

<style lang="scss">
	page{
		background: $page-color-base;
		padding-top: 16upx;
	}

	.row{
		display: flex;
		align-items: center;
		position: relative;
		padding:0 30upx;
		height: 110upx;
		background: #fff;
		
		.tit{
			flex-shrink: 0;
			width: 120upx;
			font-size: 30upx;
			color: $font-color-dark;
		}
		.input{
			flex: 1;
			font-size: 30upx;
			color: $font-color-dark;
		}
		.icon-shouhuodizhi{
			font-size: 36upx;
			color: $font-color-light;
		}
	}
	.default-row{
		margin-top: 16upx;
		.tit{
			flex: 1;
		}
		switch{
			transform: translateX(16upx) scale(.9);
		}
	}
	.add-btn{
		display: flex;
		align-items: center;
		justify-content: center;
		width: 690upx;
		height: 80upx;
		margin: 60upx auto;
		font-size: $font-lg;
		color: #fff;
		background-color: $base-color;
		border-radius: 10upx;
		box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
	}
</style>
