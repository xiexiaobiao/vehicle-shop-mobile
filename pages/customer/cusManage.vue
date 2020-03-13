<template>
	<view class="content">
		<view class="row b-b">
			<text class="tit">客户码</text>
			<input class="input" type="text" v-model="customerData.clientUuid"  disabled="true"/>
		</view>
		<view class="row b-b">
			<text class="tit">客户名</text>
			<input class="input" type="text" v-model="customerData.clientName" placeholder="(必填项)" placeholder-class="placeholder" />
		</view>
		<view class="row b-b">
			<text class="tit">手机号</text>
			<input class="input" type="number" v-model="customerData.phone" placeholder="(必填项)" placeholder-class="placeholder" />
		</view>
		<view class="row b-b">
			<text class="tit">年龄</text>
			<input class="input" type="number" v-model="customerData.age" placeholder="" placeholder-class="placeholder" />
		</view>
		<view class="row b-b">
			<text class="tit">性别</text>
			<radio-group name="gender" v-model="customerData.gender" @change="radioChange">
				<label>
					<radio value="1" /><text>男</text>
				</label>
				<label>
					<radio value="0" /><text>女</text>
				</label>
			</radio-group>
			<!-- <switch :checked="customerData.gender" color="#fa436a" @change="switchChange" /> -->
		</view>
		<view class="row b-b">
			<text class="tit">地址</text>
			<text @click="chooseLocation" class="input">
				{{customerData.addressName}}
			</text>
			<text class="yticon icon-shouhuodizhi"></text>
		</view>
		<view class="row b-b">
			<text class="tit">车型</text>
			<input class="input" type="text" v-model="customerData.vehicleSeries" placeholder="" placeholder-class="placeholder" />
		</view>
		<view class="row b-b"> 
			<text class="tit">车牌号</text>
			<input class="input" type="text" v-model="customerData.vehiclePlate" placeholder="(必填项)" placeholder-class="placeholder" />
		</view>		
		<view class="row default-row">
			<text class="tit">设为默认</text>
			<switch :checked="customerData.default" color="#fa436a" @change="deSwitchChange" />
		</view>
		<button class="add-btn" @click="confirm">提交</button>
	</view>
</template>

<script>
	import Request from '@/plugins/request/js/index.js'
	
	export default {
		data() {
			return {				
				customerData: {
					clientUuid: '',
					clientName: '',
					gender: '',
					age: '',
					phone: '',
					vehicleSeries: '',
					vehiclePlate: '',
					addressName: '在地图中选择',
					addr: '',
					default: false
				}
			}
		},
		onLoad(option){
			let title = '新增客户信息';
			if(option.type==='edit'){
				title = '编辑客户信息'				
				this.customerData = JSON.parse(option.data)
			}
			this.manageType = option.type;
			uni.setNavigationBarTitle({
				title
			})
			// 使用封装的 request
			if(option.type==='add'){
					Request().request({
					url:'client/vehicle/client/maxUid',
					method: 'get',
					header:{},
					params: {},
					}				
				).then(
					res => {
						// json 和 str 转换 JSON.stringify  JSON.parse
						console.log('res--->>>'+ JSON.stringify(res))
						let maxItemUuid = res.data;
						let num = 10000 + Number(maxItemUuid.substr(3))+ 1;
						
						this.customerData.clientUuid = maxItemUuid.substr(0,2) +num;
					}
				).catch(err => {
					console.error('is catch', err)
					this.err = err;
				 });
			}			
		},
		methods: {
			radioChange(e){
				let value = e.target.value
				this.$set(this.customerData, 'gender', value) 
			},			
			switchChange(e){
				let value = e.target.value
				this.$set(this.customerData, 'gender', value) 
			},
			deSwitchChange(e){
				let value = e.target.value
				this.$set(this.customerData, 'default', value) 
			},
			//地图选择地址
			chooseLocation(){
				uni.chooseLocation({
					success: (data)=> {
						this.customerData.addressName = data.name;
						this.customerData.address = data.name;
					}
				})
			},
			
			//提交
			confirm(){
				let data = this.customerData;
				if(!data.clientName){
					this.$api.msg('请填写客户姓名');
					return;
				}
				if(!/(^1[3|4|5|7|8][0-9]{9}$)/.test(data.phone)){
					this.$api.msg('请输入正确的手机号码');
					return;
				}
				if(!data.vehiclePlate){
					this.$api.msg('请填写车牌号信息');
					return;
				}
				/// 保存至DB
				Request().post('client/vehicle/client/create', {
						header: {
							contentType: 'application/json'
						},
						data: this.customerData,				
				    }).then(
						res => {
							//this.$api.prePage()获取上一页实例，可直接调用上页所有数据和方法，在App.vue定义
							this.$api.prePage().refreshList(data, this.manageType);
							this.$api.msg(`客户${this.manageType=='edit' ? '修改': '添加'}成功`);
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
