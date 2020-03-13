<template>
	<view class="content">
		<view class="row b-b">
			<text class="tit">商品编码</text>
			<input disabled class="input" type="text" v-model="productData.itemUuid" placeholder="商品编码" placeholder-class="placeholder" />
		</view>
		<view class="row b-b">
			<text class="tit">类别</text>
			<uni-combox label="" labelWidth="50px" :candidates="cateCandidates" placeholder="请选择类别" emptyTips="无匹配项" v-model="productData.category"></uni-combox>
			<button type="primary" style="font-size: small; width: 150upx;">添加</button>
<!-- 			<input class="input" type="text" v-model="productData.category" placeholder="(必填项)" placeholder-class="placeholder" />
 -->		</view>
		<view class="row b-b">
			<text class="tit">商品名称</text>
			<input class="input" type="text" v-model="productData.itemName" placeholder="(必填项)" placeholder-class="placeholder" />
		</view>
		<view class="row b-b">
			<text class="tit">品牌</text>
			<uni-combox label="" labelWidth="50px" :candidates="brandCandidates" placeholder="请选择品牌" emptyTips="无匹配项" v-model="productData.brandName"></uni-combox>
<!-- 			<input class="input" type="text" v-model="productData.brandName" placeholder="" placeholder-class="placeholder" />
 -->		<button type="primary" style="font-size: small; width: 150upx;">添加</button>
		</view>
		<view class="row b-b">
			<text class="tit">产地</text>
			<input class="input" type="text" v-model="productData.originPlace" placeholder="" placeholder-class="placeholder" />
		</view>
		<view class="row b-b"> 
			<text class="tit">售价</text>
			<input class="input" type="number" v-model="productData.sellPrice" placeholder="(必填项) 元" placeholder-class="placeholder" />
		</view>
		<view class="row b-b">
			<text class="tit">工时费</text>
			<input class="input" type="number" v-model="productData.labourFee" placeholder="元" placeholder-class="placeholder" />
		</view>
		<view class="row b-b">
			<text class="tit">材料费</text>
			<input class="input" type="number" v-model="productData.materialFee" placeholder="元" placeholder-class="placeholder" />
		</view>
		<view class="row b-b">
			<text class="tit">商品库存</text>
			<input class="input" type="number" v-model="productData.initStock" placeholder="(必填项)" placeholder-class="placeholder" />
		</view>
		<view class="row b-b"> 
			<text class="tit">预警库存</text>
			<input class="input" type="number" v-model="productData.alertQuantity" placeholder="" placeholder-class="placeholder" />
		</view>
		<view class="row b-b">
			<text class="tit">计量单位</text>
			<input class="input" type="text" v-model="productData.unit" placeholder="条/个/瓶" placeholder-class="placeholder" />
		</view>
		<view class="row b-b"> 
			<text class="tit">规格说明</text>
			<input class="input" type="text" v-model="productData.specification" placeholder="15*15cm" placeholder-class="placeholder" />
		</view>	
<!-- 		<view class="row default-row">
			<text class="tit">是否上架</text>
			<switch :checked= "productData.shipment" color="#ff5500" @change="switchChange" />
		</view> -->
		<button class="add-btn" @click="confirm">提交</button>
	</view>
</template>

<script>
	import Request from '@/plugins/request/js/index.js'
	
	var sourceType = [
		['camera'], //拍照
		['album'], //相册
		['camera', 'album'] //拍照或相册
	]
	var sizeType = [
		['compressed'], //压缩
		['original'], //原图
		['compressed', 'original'] //压缩或原图
	]
	
	export default {
		data() {
			return {
				
				imageList: [], //保存图片路径集合
				imageLength: 3, //限制图片张数
				sourceTypeIndex: 2, //添加方式限制
				sizeTypeIndex: 2, //图片尺寸限制
				
				OSSUrl : 'http://biao-aliyun-oss-pic-bucket.oss-cn-shenzhen.aliyuncs.com',
				OSSImageList: [], //上传路径集合
				
				productData: {
					classification: '',
					category: '',
					itemName: '',
					sellPrice: '',
					purchasePrice: '',
					brandName: '',
					description: '',
					shipment: false,
					initStock: 1000,
					alertQuantity:'',
					specification: '',
					itemUuid:'',
					unit: '',
					originPlace:'',
					labourFee: 0,
					materialFee: 0,
				},
				formData : {
				    'policy': '',
					'signature': '',
					'OSSAccessKeyId': '',
					'key': '', //oss文件名
					'dir': '',
					'host': '',
					//让服务端返回200,不然，默认会返回204
					'success_action_status': '200',
				   },
				cateCandidates:[],
				brandCandidates:[],
			}
		},
		onLoad(option){			
			// console.log(JSON.stringify(option))
			let title = '新增商品信息';
			if(option.type==='edit'){
				title = '编辑商品信息'				
				this.productData = JSON.parse(option.data)
			}
			this.manageType = option.type;
			uni.setNavigationBarTitle({
				title
			})
			
			// 使用封装的 request
			Request().request({
				url:'stock/vehicle/stock/item/maxId',
				method: 'get',
				header:{},
				params: {},
				}				
			).then(
				res => {
					// json 和 str 转换 JSON.stringify  JSON.parse
					console.log('res--->>>'+ JSON.stringify(res))
					let maxItemUuid = res.data;
					let num = 100000 + Number(maxItemUuid.substr(3))+ 1;
					this.productData.itemUuid = maxItemUuid.substr(0,2) + num;
				}
			).catch(err => {
                console.error('is catch', err)
                this.err = err;
             });
			 
			 // 使用封装的 request  类别列表
			 Request().request({
			 	url:'stock/vehicle/stock/category/list',
			 	method: 'get',
			 	header:{},
			 	params: {
					'pageNum': 1 ,
					'pageSize': 999,
				},
			 	}				
			 ).then(
			 	res => {
			 		// json 和 str 转换 JSON.stringify  JSON.parse
			 		// console.log('res--->>>'+ JSON.stringify(res.data))
			 		this.cateCandidates = res.data.records;
			 	}
			 ).catch(err => {
			     console.error('is catch', err)
			     this.err = err;
			  });
			  
			  // 使用封装的 request 品牌列表
			  Request().request({
			  	url:'stock/vehicle/stock/brand/list',
			  	method: 'get',
			  	header:{},
			  	params: {
					'pageNum': 1 ,
					'pageSize': 999,
				},
			  	}				
			  ).then(
			  	res => {
			  		// json 和 str 转换 JSON.stringify  JSON.parse
			  		// console.log('res--->>>'+ JSON.stringify(res.data))
			  		this.brandCandidates = res.data.records;
			  	}
			  ).catch(err => {
			      console.error('is catch', err)
			      this.err = err;
			   });
			
			
/* 			uni.request({
				url: 'http://10.10.10.203:9195/stock/vehicle/stock/item/maxId',
				method: 'GET',
				success: res => {
					let maxItemUuid = res.data.data;
					let num = Number(maxItemUuid.substr(3))+ 1;
					this.productData.itemUuid = maxItemUuid.substr(0,2)+ 100000 +num;
				}
			}) */			
		},
		methods: {
			//选择图片
			chooseImage: async function() {
				   // 先获取policy
				    await this.getPolicy();
					uni.chooseImage({
						sourceType: sourceType[this.sourceTypeIndex],
						// #ifdef MP-WEIXIN
						sizeType: sizeType[this.sizeTypeIndex],
						// #endif
						count: this.imageLength - this.imageList.length,
						success: (res) => {
							const tempPaths = res.tempFilePaths;
							this.imageList = this.imageList.concat(tempPaths);
							// 可能一次选择多个相册图片
							for(let i=0;i<tempPaths.length;i++ ){
								// 设置oss文件的保存属性
								this.formData.key = this.formData.dir + this.getFileName(tempPaths[i]);
								this.OSSImageList.push(this.OSSUrl+'/'+this.formData.key)
								// 异步上传
								console.log('异步上传--' + this.formData.key);
								uni.uploadFile({
									url: this.OSSUrl , 
									filePath: tempPaths[i], //上传的文件对象
									header:{'Access-Control-Allow-Origin':'*'},
									name: 'file',								
									formData: this.formData,
									success: (uploadFileRes) => {
										console.log('上传成功--'+ uploadFileRes.data);
									 },								
								});
							}							
						}
					})
				},
				// 获取policy
				getPolicy: function(){
					Request().request({
						url: 'stock/vehicle/stock/aliyun/oss/policy',
						method: 'get',
						header: {},
						params: {}
					}).then(
						response => {
							// 返回的对象，多一层data封装，故写为response.data
							this.formData.policy = response.data.policy;
							this.formData.signature = response.data.signature;           
							this.formData.OSSAccessKeyId = response.data.accessKeyId;
							// 注意这里的'/'不能放'${filename}'前，否则oss会自动增加一层目录目录
							// this.formData.key = response.data.data.dir+'/'+'235';
							this.formData.dir = response.data.dir;
							this.formData.host = response.data.host;
					}).catch(err => {
						console.error('is catch', err)
						this.err = err;
						})
					
					/* uni.request({
						url: 'http://10.10.10.203:9195/stock/vehicle/stock/aliyun/oss/policy',
						method: 'GET',
						success: response => {
							// 返回的对象，多一层data封装，故写为response.data.data
							this.formData.policy = response.data.data.policy;
							this.formData.signature = response.data.data.signature;           
							this.formData.OSSAccessKeyId = response.data.data.accessKeyId;
							// 注意这里的'/'不能放'${filename}'前，否则oss会自动增加一层目录目录
							// this.formData.key = response.data.data.dir+'/'+'235';
							this.formData.dir = response.data.data.dir;
							this.formData.host = response.data.data.host;
						}
					}) */
				},
				// 将临时文件重命名用于上传到OSS
				_getSuffix(filename) {
				            let pos = filename.lastIndexOf('.')
				            let suffix = ''
				            if (pos != -1) {
				                suffix = filename.substring(pos)
				            }
				        return suffix;
				    },
				getFileName(filename) {
				            return '/' + new Date().getTime() + Math.random().toString(36).substring(3, 20) + this._getSuffix(filename)
				        },
				//预览图片
				previewImage: function(e) {
					var current = e.target.dataset.src
					uni.previewImage({
						current: current,
						urls: this.imageList
					})
				},
				//删除图片
				deleteImage: function(e) {
					var index = e.target.dataset.index;
					var that = this;
					var images = that.imageList;
					images.splice(index, 1);
					that.imageList = images;
				},
				///////////
				
/* 			switchChange(e){
				let value = e.target.value
				this.$set(this.productData, 'shipment', value)   // 将点击改变的状态赋给productData.shipment
			},	 */		
			//品牌选择地址
			chooseLocation(){
				uni.chooseLocation({
					success: (data)=> {
						this.productData.productName = data.name;
						this.productData.product = data.name;
					}
				})
			},
			
			//提交
			confirm: async function(){
				let data = this.productData;
				if(!data.category){
					this.$api.msg('请填写分类');
					return;
				}
				if(!data.itemName){
					this.$api.msg('请填写名称');
					return;
				}
				if(!data.sellPrice){
					this.$api.msg('请填写售价');
					return;
				}
				if(!data.initStock){
					this.$api.msg('请填写初始库存');
					return;
				}
/* 				if(this.OSSImageList.length === 0){
					this.$api.msg('请添加图片');
					return;
				} */
			    let albumPics = this.OSSImageList;
				/// 保存至DB
				Request().post('stock/vehicle/stock/item/save', {
						header: {
							contentType: 'application/json'
						},
						data: data,				
				    }).then(
						res => {
							//刷新商品列表页,this.$api.prePage()获取上一页实例，可直接调用上页所有数据和方法，在App.vue定义
							// this.$api.prePage().refreshList(data, this.manageType);
							this.$api.msg(`商品${this.manageType=='edit' ? '修改': '添加'}成功`);
							setTimeout(()=>{
								uni.navigateBack()
								}, 800)
						}
					);
				},
		}
	}
</script>

<style lang="scss">
	
	page {
			display: flex;
			flex-wrap: wrap;
			justify-content: center;
			align-items: flex-start;
			background-color: #FFFFFF;
		}
	 
		.body-view {
			width: 100%;
			display: flex;
			flex-wrap: wrap;
			justify-content: center;
			align-items: flex-start;
		}
	 
		.info-table {
			width: 100%;
			display: flex;
			flex-wrap: wrap;
			justify-content: center;
			align-items: flex-start;
			background-color: #FFFFFF;
		}
	 
		.info-table .info-table-row {
			height: 120upx;
			width: 92%;
			display: flex;
			flex-wrap: nowrap;
			align-items: center;
			justify-content: space-between;
			border-bottom: 1upx solid rgba(204, 204, 204, 1);
		}
	 
		.info-table .info-table-row .table-row-left {
			height: 40upx;
			font-size: 28upx;
			font-weight: 400;
			color: rgba(28, 28, 28, 1);
			line-height: 40upx;
		}
	 
		.info-table .info-table-row .table-row-right {
			display: flex;
			align-items: center;
			justify-content: center;
		}
	 
		.info-table .info-table-row .table-row-right image {
			width: 13upx;
			height: 24upx;
		}
	 
		.info-table .info-table-row .table-row-right input {
			width: 560upx;
			height: 40upx;
			font-size: 28upx;
			font-weight: 400;
			color: rgba(28, 28, 28, 1);
			line-height: 40upx;
		}
	 
		.table-btn-view {
			position: fixed;
			bottom: 27upx;
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
		}
	 
		.table-btn-view .save-btn {
			width: 92%;
			height: 90upx;
			background: rgba(0, 170, 255, 1);
			border-radius: 10upx;
			color: #FFFFFF;
		}
		
		.uploads{
			width: 92%;
			}
	
	/* 第一套图片上传样式（内部图标相机） */
	.upload-image-view {
		width: 100%;
		margin: 20upx 0 20upx 0;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
	}
	 
	.upload-image-view .title {
		width: 100%;
		font-family: PingFang-SC-Regular;
		font-size: 24upx;
		color: #4a4a4a;
		margin-bottom: 15upx;
		line-height: 100%;
	}
	 
	.upload-image-view .info {
		width: 100%;
		font-family: PingFang-SC-Regular;
		font-size: 24upx;
		color: #ff4259;
		height: 24upx;
		margin-top: 15upx;
		line-height: 24upx;
	}
	 
	.upload-image-view .image-view {
		height: 130upx;
		width: 130upx;
		position: relative;
		margin: 15upx 15upx 15upx 0upx;
		border-radius: 8upx;
	}
	 
	.upload-image-view .image-view image {
		height: 100%;
		width: 100%;
		border-radius: 8upx;
	}
	 
	.upload-image-view .image-view .del-btn {
		background-color: #f67371;
		border-radius: 50%;
		width: 25upx;
		height: 25upx;
		position: absolute;
		top: -12upx;
		right: -12upx;
		z-index: 2;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	 
	.upload-image-view .image-view .del-btn .baicha {
		display: inline-block;
		width: 20upx;
		height: 5upx;
		background: #fff;
		line-height: 0;
		font-size: 0;
		vertical-align: middle;
		-webkit-transform: rotate(45deg);
	}
	 
	.upload-image-view .image-view .del-btn .baicha:after {
		content: '/';
		display: block;
		width: 20upx;
		height: 5upx;
		background: #fff;
		-webkit-transform: rotate(-90deg);
	}
	 
	.upload-image-view .add-view {
		height: 115upx;
		width: 115upx;
		margin: 15upx 15upx 15upx 0upx;
		display: flex;
		align-items: center;
		justify-content: center;
		background: rgba(255, 255, 255, 0.00);
		border: 3upx dashed #979797;
		border-radius: 8upx;
	}
	 
	/* 相机 */
	 
	.upload-image-view .add-view .xiangji {
		height: 40upx;
		width: 48upx;
		display: flex;
		justify-content: center;
		flex-wrap: wrap;
	}
	 
	.upload-image-view .add-view .xiangji .tixing {
		width: 10upx;
		height: 7upx;
		background-color: #fff;
		border-right: 10upx solid #fff;
		border-bottom: 7upx solid #b2b2b2;
		border-left: 10upx solid #fff;
	}
	 
	.upload-image-view .add-view .xiangji .changfx {
		height: 32upx;
		width: 48upx;
		border-radius: 5%;
		background-color: #b2b2b2;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	 
	.upload-image-view .add-view .xiangji .changfx .yuan1 {
		height: 20upx;
		width: 20upx;
		border-radius: 50%;
		background-color: #fff;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	 
	.upload-image-view .add-view .xiangji .changfx .yuan2 {
		height: 10upx;
		width: 10upx;
		border-radius: 50%;
		background-color: #b2b2b2;
	}
	 
	/* 第二套图片上传样式（内部图标 十字架）*/
	 
	/* 十字架 */
	.upload-image-view .add-view .cross {
		height: 48upx;
		width: 48upx;
		display: flex;
		flex-wrap: wrap;
		position: relative;
	}
	 
	.upload-image-view .add-view .cross .transverse-line {
		height: 100%;
		width: 48%;
		position: absolute;
		border-right: 3upx solid #5A5A5A;
		top: 0;
		left: 0;
	}
	 
	.upload-image-view .add-view .cross .vertical-line {
		height: 48%;
		width: 100%;
		position: absolute;
		border-bottom: 3upx solid #5A5A5A;
		top: 0;
		left: 0;
	}
	///////////////////////
	
	// page{
	// 	background: $page-color-base;
	// 	padding-top: 16upx;
	// }

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
