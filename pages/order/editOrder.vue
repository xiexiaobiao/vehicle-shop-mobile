<template>
	<view class="container">
		
		<!-- 空白页 -->
		<view v-if="empty && pageType !== 'new' && pageType !== 'edit'" class="empty">
			<image src="/static/emptyCart.jpg" mode="aspectFit"></image>
			<view class="empty-tips">
				您没有未完成订单！
				<view class="navigator" @click="navToOrder"> 去订单列表 ></view>
			</view>
		</view>
		<view v-else>
		
		<!-- 地址 -->
		<navigator :url="'/pages/customer/customer?pageType='+ encodeURIComponent(JSON.stringify(pageType))" class="address-section">
			<view class="order-content">
				<text class="yticon icon-shouhuodizhi"></text>
				<view class="cen">
					<view class="top">
						<text class="name">{{customerData.clientName}}</text>
						<text class="mobile">{{customerData.phone}}</text>
					</view>
					<text class="address">{{customerData.vehiclePlate}} {{customerData.addr}}</text>
				</view>
				<text class="yticon icon-you"></text>
			</view>

			<image class="a-bg" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAu4AAAAFCAYAAAAaAWmiAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6Rjk3RjkzMjM2NzMxMTFFOUI4RkU4OEZGMDcxQzgzOEYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6Rjk3RjkzMjQ2NzMxMTFFOUI4RkU4OEZGMDcxQzgzOEYiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpGOTdGOTMyMTY3MzExMUU5QjhGRTg4RkYwNzFDODM4RiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpGOTdGOTMyMjY3MzExMUU5QjhGRTg4RkYwNzFDODM4RiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PrEOZlQAAAiuSURBVHjazJp7bFvVHce/1/deXzuJHSdOM+fhpKMllI2SkTZpV6ULYrCHQGwrf41p/LENVk3QTipSWujKoyot1aQN0FYQQxtsMCS2SVuqsfFYHxBKYQNGV9ouZdA8nDipH4mT+HFf+51rO0pN0japrw9HreLe3Pqc3/me3+f3uFdIvfVuDIAPix1C9oceicFRVQWlvRWCkL1omqb1Of9z9rXZY65rhcO6x5ove19oWkX/RAaSMLOEkg+2Zt0wEcvoWOZzYZnXeWEbzmP7XPs11//LnOiDEY9DkGRwGw5a59QUTM2As+1qiD5v0TUvvC9Bc52KpmDSnju4ic7+CIinNVQoElYtcUM8jx2L1bzwPn14DOrHZ0hzEdxOPJtW16FH45CvuBzyZU22aH7Od9LnU/E0xpMqJG6iZ309qeqYNoA1gTJ4ZdF2zY2pJNSTfYCmkb85+GnO1hIbh+DzQVndaiHYTs3ZGJpifE/DyVnzi+X7pWqen8/i+8kPYUSjEORPCd9XtUKs9Fi+KMxjVzE0n9ZNnIgkYXwK+B5LafC4JKyudcMxD2+LqblGfNcY30VxJsfhcOCJ7xr02ATkluXE96DtmrPvPxFLIUH7zY3vOc0Z39O0oGtqy1DlFIuu+Zx8P/Ffa8/hEBey4rh0uuPWS6S6CRUhyGjG0hcfOWex+c9zXSsE5HmFzseP3H294Sl847VBRGJJQHTwy9wJNKAE7otLfXi2K3hRgeB81+bar8IDEPvFMxi6cxebnMx2cjrnDmiIwUAGDTvugX9de9E1L7R9NK1jc+8gnj8dy2rOKY/JRhgV8Cr405ea0HEBOxajeaHtySPvYvD2bUgdP0lmuzkl7oLl6Wn0wX/Dd1D/xG5bNc/f+7NjY9jyzghlM5QxS/ySOGt+Wlt3WwDXBz22a86gHrqjG7Hnekhz5uciN9NVDEBxXYng87vgEoqveZ7y+XsPE99vOTyAs1SkU+bOT3NKIJHUsIb4/rsL8L0YmrMRffQ3GNn8c6L7BOnu4pW10/xR4nsK9T+5FzWda2fXcEXTfLbtYUrc7joSwguno9kilZfsLNmgtaBcxv7rmudN2i9Fc8YRlsvkr6aOvoeBHxDf//MBzVfGke9p8vVhVN2wAQ1P7rFdczYeO34Wm4+Gsr4mcqzWMqQ5IX5rex3W1pUXX/PCRlwkjpEtDyLy9B8sPxcgLWzFpy7rWlTH3eq66AbUj0fh7lyJhn27oFzVck41mTdgdnU5+3fzbczsqqVwQ14aSuCrhwZoo3UEqCLW6biZJZZZom0e0UhlSiY3rvBjd0cdfLJjTrsXYvN8e5TvPEZ2PYbw9l9CrKqAWFNB+2+W/oiTc2l9BFefC/WPdqPyuxts1/zMlIrbqVB7OZSgaSWrC2eUWHUGcLa2MVrLyho3ftvVhNYq1ye6J8XUnI3JFw8idNdOaB+GIS+vsZhf6gMvsP1OJKGFx1H9o1sQeOSBXOcfc9pQDM3Z2PGvEeykxJ0l7AGaTyux4YKVLpOvs0BO/v0UQf17LdUzwdcskuaFHRo1NIrQxq1I9ByEc2kj+ZwDZsk1z/H9I+L7us+j4fHdUFa2FF3zQtv3DyTwrTcGoVFxXOeWKZEoPeNm+E66b7zSj71r6+ERHXN21C5V85nPmo7I3scRvncfxOoyiP7y0vNdyMZ17X9xmGR+43MPwvvtm23XnPH9h68P4u8U2yuJ7wonvmu0pigValf73XhmfRCt1S5bNbd6QK/0ov+2bhjDE8T3aj58p5hujCehjsZQs+lWLNl5N0RvuS2a5z/T8cLOd8K4/72wxdaAXHq+syGT7sOM7xLxvaOe+F5lu+bqYBjDd25H4s+vQ26ugSBL1lsEC+m4C8fQvMhXZXTa/CR8N96MekrapWCdvc1t+rvn32PY3juYrc7cEjjonFuMYQm97QsBPLSq1v7pKJAPbbwHZ3ueoqCyhJIJStqto8/BdMTh8q1A8PcPo+xrXbbP97ehSXydFWpjU0CZzO8xInM+CqSdTV688OVmBBT7O6DRh/dhYOt20nqSdK+f1RIqdRMqRXgrR90Dm+Dfsdn2+QYpeH7/8CBe+mAsq7nIsevKEjivgv1dQdzYUGH7dMlXe3FmwxZMTRyFgiZkW48mF0/XMYWqm75JfH8IUmPA1tlUMnHv+8T3N3J8d3Hkey6I3re6Djvaam1v/urhswjdsQ2jf/kVJRI1xHdPrh1lltzTWUxXai5H07N74P7KettnPDQyjWtf/ohglyJfl7jz/drP+vDrzgYsLZdtP2PRnz6B/u4t9I+U9cYCH81hddoFuBG4bxNq7v9xSfh+G/H9wKkIwF5JkR38fF3VLb73dDXhpsYS8P0Vxve7MZ14E04EkX2SumDj40Lkjz2LS9x1nZVqcK1rh1L/GaiZDB1GYwGPRi9+sA4r63odGEjAoKTZS0mTwUtoS2sTPioc1jd64KJqNZXRP9EtLFrLT5KQOd6H1JtvQ/SUQ1CUC1Z/tjp5MgXn51bAfc1VpAUVb6pqi+bsqRlrOB0ITSI0kUa1IvF7JcribPbxZnt9BYIeBZm0ap1BO2yHLMOIxjH111chmDocXg9XzZFR4fD74e5cA9GtQEulbLGbfaNMvv4+BfG3hiet9wxlUeDGdDPn68uqXVgVKKezbiBN/HHYoTnrqlORkDx0BHr/ABzVVbknbZysZ3wnRVyda6HU1UIjvpt28p2C+T+GEtYeeEh3jqcdKjl2BcWY65q9UAQb+c6+k3iePnaS+P5Pq8spOJ38fJ09RVI1OFuWo6xtJXSD+J6xh++OHN8PEt8HxtNY4pbAczC+m2Rnh8V3J9Q0Fa4LeG97YQdehj4aoSL9NZiZNMTKStp6g5/x5NsW37vWQaS1WXzPHvjihzYS/lgshbeJ75WySHm7wNXXk8SbK/xutOX4ntHtYRxE0eJn6uARaGf6ie++7GPNxVkf/78AAwCn1+RYqusbZQAAAABJRU5ErkJggg=="></image>
		</navigator>

		<view class="goods-section">
			<view class="g-header b-b">
				<image class="logo" src="https://biao-aliyun-oss-pic-bucket.oss-cn-shenzhen.aliyuncs.com/images/logo-samll.png"></image>
				<text class="name">鼎泰汽车服务中心</text>
				<navigator :url="'/pages/product/list?pageType='+ encodeURIComponent(JSON.stringify(pageType))" open-type="navigate"> 
					<button type="primary" style="font-size: small; width: 200upx;height: 50upx; position: relative; left: 200upx;">添加商品</button> 
				</navigator>
				<!-- <text style="color: #0000ff; position: relative; margin-left: 250upx;" class="name"  @click="addItems">添加商品</text> -->
			</view>
			<!-- 商品列表 -->
			<block  v-for="(item, index) in orderData.detail" :key="index" @click="showDetail(item)">
			<view style="display: flex; margin-right: 5upx;">				
				<view class="g-item">
					<!-- <image :src="item.picAddr"></image> -->
					<view class="right">
						<text class="title clamp">{{item.itemUuid}} {{item.itemName}}</text>					
						<text class="spec">￥{{item.sellPrice}} / {{item.specification}} / {{item.brandName}} / {{item.unit}}</text>
						<view class="price-box">	
							<input type="number" v-model="item.discountPrice" @blur="handlePrice" style="color: #ff0000; font-size: small; width: 100upx;"/>
							<text class="number">{{item.remark}}</text>
						</view>	
						<uni-number-box  style="margin-left: 450upx;" :min="0" :max="10" 
							:value="item.quantity"  :index="index" @eventChange="quantityChange"></uni-number-box>
					</view>
				</view>	
				<view >
					<text class="del-btn yticon icon-fork" @click="deleteCartItem(index)"></text>
				</view>
			</view>	
			</block>						
		</view>

		<view class="yt-list">
			<view class="yt-list-cell b-b">
				<text class="cell-tit clamp">商品金额</text>
				<text class="cell-tip">￥{{total}}</text>
			</view>
			<view class="yt-list-cell b-b">
				<text class="cell-tit clamp">优惠金额</text>
				<text class="cell-tip red">-￥{{discount}}</text>
			</view>
			<view class="yt-list-cell b-b">
				<text class="cell-tit clamp">运费</text>
				<text class="cell-tip">免运费</text>
			</view>
			<view class="yt-list-cell b-b">
				<text class="cell-tit clamp">付款状态</text>
				<switch class="uni-title" color="#ff0000" type="checkbox" :checked="orderData.paidStatus"  @change="switchchange" ></switch>
			</view>
			<view class="yt-list-cell desc-cell">
				<text class="cell-tit clamp">备注</text>
				<input class="desc" type="text" v-model="orderData.orderRemark" placeholder="请填写备注信息" placeholder-class="placeholder" />
			</view>
		</view>
		
		<!-- 底部 -->
		<view class="footer">
			<view class="price-content">
				<text>实付款</text>
				<text class="price-tip">￥</text>
				<text class="price">{{discountTotal}}</text>
			</view>
			<text class="submit" @click="submit">提交订单</text>
		</view>
		
		<!-- 优惠券面板 -->
		<view class="mask" :class="maskState===0 ? 'none' : maskState===1 ? 'show' : ''" @click="toggleMask">
			<view class="mask-content" @click.stop.prevent="stopPrevent">
				<!-- 优惠券页面，仿mt -->
				<view class="coupon-item" v-for="(item,index) in couponList" :key="index">
					<view class="con">
						<view class="left">
							<text class="title">{{item.title}}</text>
							<text class="time">有效期至2019-06-30</text>
						</view>
						<view class="right">
							<text class="price">{{item.price}}</text>
							<text>满30可用</text>
						</view>
						
						<view class="circle l"></view>
						<view class="circle r"></view>
					</view>
					<text class="tips">限新用户使用</text>
				</view>
			</view>
		</view>
		</view>
	</view>
</template>

<script>
	import { mapGetters, mapState,mapActions,mapMutations } from 'vuex'
	import Request from '@/plugins/request/js/index.js'
	import uniNumberBox from '@/components/uni-number-box.vue'
	
	export default {
		components: {uniNumberBox},
		data() {
			return {
				empty: false, //空白页现实  true|false
				customerEmpty: false, //空白页现实  true|false
				itemEmpty: false, //空白页现实  true|false
				pageType: 'new', //
				isChecked: false  ,  
				res:{status:422},
				maskState: 0, //优惠券面板显示状态
				desc: '', //备注
				payType: 1, //1微信 2支付宝
				couponList: [
					{
						title: '新用户专享优惠券',
						price: 5,
					},
					{
						title: '庆五一发一波优惠券',
						price: 10,
					},
					{
						title: '优惠券优惠券优惠券优惠券',
						price: 15,
					}
				],
				customerData: {
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
				},
				total: 0,
				// 实际付款
				discountTotal: 0,
				discount: 0 ,				
				orderData:{
					orderUuid: null,
					clientUuid: "",
					generateDate: null,
					modifyDate: null,
					paidStatus: false,
					orderRemark: '',
					amount: null,
					package: 0,
					detail: [],
					name: null,					
					vehiclePlate: null,
					phone: null,
					addr: null
				},
				itemShowList:[],
				dtoList:[],
			}
		},
		activated() {
			/* 解决 由订单页返回购物车页，购物车却为空的问题  */
			/* 解决 由订单页返回购物车页，购物车却为空的问题  */
			// 只要进入该页面就进行刷新，因为onLoad()只加载一次，
			// https://blog.csdn.net/qq_27047215/article/details/98943080
			// this.loadData();
			
			/* console.log('dtoList2 '+ this.dtoList.length);
			// 防止重新选客户后错误累加
			this.orderData.detail = this.orderData.detail.concat(this.dtoList);
			this.dtoList = []; */
			
			/* this.dtoList.forEach(
				item=>{
					let index = this.orderData.detail.findIndex( product=> product.itemUuid === item.itemUuid )
					if (index != -1){
						this.orderData.detail.push(item)
					}
				}
			) */
			this.calcTotal();  //计算总价
			
		},
		onLoad(option){
			
			let title = '创建新订单';
			if(option.type==='edit'){
				this.pageType = 'edit'
				title = '编辑订单'
				uni.showToast({
					title:'拼命加载中...',
					icon:'loading'
				})			
				// 传参,这里必须使用JSON.parse，否则取值失败！！！！！！！
				let orderData = JSON.parse(option.data);
					this.orderData.orderUuid = orderData.orderUuid;
					this.orderData.clientUuid = orderData.clientUuid;
					this.orderData.generateDate = orderData.generateDate;
					this.orderData.amount = orderData.amount;
					this.orderData.paidStatus = orderData.paidStatus;
					this.orderData.detail = orderData.detail;
					this.orderData.package = orderData.package;
				// 
				// this.loadData();
				this.getClientInfo();								
			}else if(option.type==='draft'.toString()){ // 
			    this.pageType = 'draft';
				// 获取vuex缓存
				this.customerData = this.cusInfo;
				this.itemShowList = this.cartItems; // 用于watch，因为orderData.detail属于引用类，无法watch
				this.orderData.detail = this.cartItems;
				this.empty = this.customerEmpty && this.itemEmpty;
			}else{
				
			}
			uni.setNavigationBarTitle({
				title
			})
			//计算总价
			this.calcTotal();  
		},
		onReady() {
			uni.hideToast();
		},
		watch:{
			
			//【引用类型】必须改变obj的指向【地址】才能监听成功【仅改变内部属性值是不会监听】,比如以下
			// age或sex值发生变化，监听无效
			// obj:{
			// 	age: 20,
			// 	sex: 'man'
			// }
			
			//显示空白页
			itemShowList(e){
				let empty = (e.length === 0 ? true: false) ;
				if(this.itemEmpty !== empty){
					this.itemEmpty = empty;
				}				
				console.log('itemEmpty '+this.itemEmpty)
				let empty1 = (this.customerEmpty && this.itemEmpty) ;
				if(this.empty !== empty1){
					this.empty = empty1;
				}
				console.log('empty '+this.empty)
			},
			customerData(e){
				let empty = (e.clientUuid.length < 2 ? true: false) ;
				if(this.customerEmpty !== empty){
					this.customerEmpty = empty;
				}
				console.log('customerEmpty '+this.customerEmpty)
				let empty2 = (this.customerEmpty && this.itemEmpty) ;
				if(this.empty !== empty2){
					this.empty = empty2;
				}
				console.log('empty '+this.empty)
			},
/* 			empty(e){
				let empty = (this.customerEmpty && this.itemEmpty) ;
				if(this.empty !== empty){
					this.empty = empty;
				}
				console.log('empty '+this.empty)
			}, */
		},
		computed:{
			// ...mapState(['hasLogin']),
			...mapGetters(['cartItems']),
			...mapGetters(['cusInfo'])
		},
		methods: {
			navToOrder(){
				uni.navigateTo({
					url: '/pages/order/order-list'
				})
			},
			// 查询客户信息
			getClientInfo: function(){			
				return Request().request({
					url:'client/vehicle/client/uid',
					method: 'get',
					header:{},
					params: {
						uid: this.orderData.clientUuid,
					},
					}				
				).then(
					res => {
						// json 和 str 转换 JSON.stringify  JSON.parse
						// console.log('res--->>>'+ JSON.stringify(res))
						this.customerData = res.data;
					}
				).catch(err => {
					console.error('is catch', err)
					this.err = err;
				 });
			},
			//删除
			deleteCartItem(index){
				// console.log(index)
				// 删除vuex中对象
				// let idItemToDel = this.cartItems[index].idItem;
				// this.deleteCartItem(0);
				// console.log(idItemToDel)
				// this.$store.commit("deleteCartItem",idItemToDel)
				this.orderData.detail.splice(index, 1);
				this.calcTotal();
			},
			
			handlePrice: function(){
				this.calcTotal();  //计算总价
			},
			
			quantityChange(data){
				console.log(data)
				uni.showToast({
						    title: "数量: " + data.number.toString(),
							icon: 'none',
							duration: 500
				});
				this.orderData.detail[data.index].quantity = data.number;
				this.calcTotal();
			},
			switchchange(e) {    
				let value = e.target.value
				this.$set(this.orderData, 'paidStatus', value)   // 将点击改变的状态赋给productData.shipment             
			},
			//
			showDetail: function(e){
				uni.showToast({
						    title: "显示详细！",
							icon: 'none'		   
							});	
			},
			addItems: function(e){
				uni.showToast({
						    title: "添加商品！",
							icon: 'none'		   
							});	
				uni.navigateTo({
					url:'/pages/product/list',
				})
			},
			//计算总价
			calcTotal(){
				let list = this.orderData.detail;
				if(!list){
					this.empty = true;
					return;
				}
				let total = 0;
				// 总价
				total = list.reduce((total, itemDetail) => {
					  return total + itemDetail.sellPrice * itemDetail.quantity
					}, 0)
				this.total = Number(total.toFixed(2));
				// 优惠价
				let discountTotal = 0;
				discountTotal = list.reduce((discountTotal, itemDetail) => {
					  return discountTotal + itemDetail.discountPrice * itemDetail.quantity
					}, 0)
				this.discountTotal = Number(discountTotal.toFixed(2));
				// 优惠额
				this.discount = Number((total-discountTotal).toFixed(2));
			},
			
			//显示优惠券面板
			toggleMask(type){
				let timer = type === 'show' ? 10 : 300;
				let	state = type === 'show' ? 1 : 0;
				this.maskState = 2;
				setTimeout(()=>{
					this.maskState = state;
				}, timer)
			},
			numberChange(data) {
				this.number = data.number;
			},
			changePayType(type){
				this.payType = type;
			},
			submit(){
	/* 			list.forEach(item=>{
					if(item.checked){
						goodsData.push({
							attr_val: item.attr_val,
							number: item.quantity
						})
					}
				}) */
				// 订单数据组装
/* 				let itemDetail2 = []
				this.orderData.detail.forEach(item=>{
					itemDetail2.push({
						itemUuid : item.itemUuid,
						quantity : item.quantity,
						discountPrice : item.discountPrice,
						remark : item.remark
					})
				})
				this.orderData.detail = itemDetail2; */
				this.orderData.clientUuid = this.customerData.clientUuid;
				// 经测试以下数据组装写法有bug，原因未知！！！！！！！！！！！！！
				/* for(let i=0; i<this.itemShowList.length;i++){
					let  = {};
					itemDetail.itemUuid = this.itemShowList.itemUuid;
					itemDetail.quantity = this.itemShowList.quantity;
					itemDetail.discountPrice = this.itemShowList.discountPrice;
					itemDetail.remark = this.itemShowList.remark;
					console.log(JSON.stringify(itemDetail))
					this.orderData.itemList.push(itemDetail);
				} */
				
				// 空订单禁止提交
				if(this.orderData.detail.length === 0){
					uni.showToast({
						title: '订单为空!',
						mask: true ,
						duration: 800,
						icon: 'none'
					})
					return; 
				}
				//
				if(!this.customerData.clientUuid){
					uni.showToast({
						title: '客户未选择!',
						mask: true ,
						duration: 800,
						icon: 'none'
					})
					return; 
				}
				//创建
				if(this.pageType === 'new' || this.pageType === 'draft'){
					this.orderData.clientUuid = this.customerData.clientUuid;
					uni.showModal({
						content:"确定提交订单？",
						success: (e) => {
							if(e.confirm){
								//todo  保存订单处理
								// vuex使用,引入map辅助函数后，也可以直接使用，或者使用$store语法等效
								// this.emptyCart();
								// this.$store.commit("emptyCart")
								// 异步清空购物车缓存
								this.$store.dispatch("emptyCartAsync");
								this.$store.commit("delCustomerInfo");
								/// 保存至db
								Request().post('business/vehicle/business/create', {
										header: {
											contentType: 'application/json'
										},
										data: this.orderData,				
								    }).then(
										res => {
											//this.$api.prePage()获取上一页实例，可直接调用上页所有数据和方法，在App.vue定义
											//this.$api.prePage().refreshList(data, this.manageType);
											this.$api.msg(`订单创建成功`);
											this.$api.hidemsg;
											this.itemShowList=[];
											setTimeout(()=>{
												uni.navigateBack()
											 }, 800)
										}
									);
								uni.redirectTo({
									url:'/pages/order/order-list',
								})
							}
						}
					})
				}else{
				//更新
				uni.showModal({
					content:"确定提交订单？",
					success: (e) => {
						if(e.confirm){
							//todo  保存订单处理
							// vuex使用,引入map辅助函数后，也可以直接使用，或者使用$store语法等效
							// this.emptyCart();
							// this.$store.commit("emptyCart")
							// 异步清空购物车缓存
							// this.$store.dispatch("emptyCartAsync");
							// this.$store.commit("delCustomerInfo");
							/// 保存至db
							// console.log(JSON.stringify(this.orderData));
							Request().post('business/vehicle/business/update', {
									header: {
										contentType: 'application/json'
									},
									data: this.orderData,				
							    }).then(
									res => {
										//this.$api.prePage()获取上一页实例，可直接调用上页所有数据和方法，在App.vue定义
										//this.$api.prePage().refreshList(data, this.manageType);
										this.$api.msg(`订单修改成功`);
										this.$api.hidemsg;
										setTimeout(()=>{
											uni.navigateBack()
										 }, 800)
									}
								);
							uni.redirectTo({
								url:'/pages/order/order-list',
							})
						}
					}
				})
				}
			}

		}
	}
</script>

<style lang="scss">
	page {
		background: $page-color-base;
		padding-bottom: 100upx;
	}
	
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

	.item-right{
			display:flex;
			flex-direction: column;
			flex: 1;
			overflow: hidden;
			position:relative;
			padding-left: 30upx;
			.title,.price{
				font-size:$font-base + 2upx;
				color: $font-color-dark;
				height: 45upx;
				line-height: 40upx;
			}
			.attr{
				font-size: $font-sm + 2upx;
				color: $font-color-light;
				height: 50upx;
				line-height: 50upx;
			}
			.price{
				height: 50upx;
				line-height:50upx;
			}
		}

	.address-section {
		padding: 30upx 0;
		background: #fff;
		position: relative;

		.order-content {
			display: flex;
			align-items: center;
		}

		.icon-shouhuodizhi {
			flex-shrink: 0;
			display: flex;
			align-items: center;
			justify-content: center;
			width: 90upx;
			color: #888;
			font-size: 44upx;
		}

		.cen {
			display: flex;
			flex-direction: column;
			flex: 1;
			font-size: 28upx;
			color: $font-color-dark;
		}

		.name {
			font-size: 34upx;
			margin-right: 24upx;
		}

		.address {
			margin-top: 16upx;
			margin-right: 20upx;
			color: $font-color-light;
		}

		.icon-you {
			font-size: 32upx;
			color: $font-color-light;
			margin-right: 30upx;
		}

		.a-bg {
			position: absolute;
			left: 0;
			bottom: 0;
			display: block;
			width: 100%;
			height: 5upx;
		}
	}

	.goods-section {
		margin-top: 16upx;
		background: #ffffff;
		padding-bottom: 1px;

		.g-header {
			display: flex;
			align-items: center;
			height: 84upx;
			padding: 0 30upx;
			position: relative;
		}

		.logo {
			display: block;
			width: 50upx;
			height: 50upx;
			border-radius: 100px;
		}

		.name {
			font-size: 30upx;
			color: $font-color-base;
			margin-left: 24upx;
		}

		.g-item {
			display:flex;
			flex-direction: column;
			flex: 1;
			overflow: hidden;
			position:relative;
			padding-left: 10upx;
			.right {
				flex: 1;
				padding-left: 24upx;
				overflow: hidden;
			}

			.title {
				font-size: 30upx;
				color: $font-color-dark;
			}

			.spec {
				font-size: 26upx;
				color: $font-color-light;
			}

			.price-box {
				display: flex;
				align-items: center;
				font-size: 32upx;
				color: $font-color-dark;
				padding-top: 10upx;

				.price {
					margin-bottom: 4upx;
				}
				.number{
					font-size: 26upx;
					color: $font-color-base;
					margin-left: 20upx;
				}
			}

			.step-box {
				position: relative;
			}
		}
	}
	.yt-list {
		margin-top: 16upx;
		background: #fff;
	}

	.yt-list-cell {
		display: flex;
		align-items: center;
		padding: 10upx 30upx 10upx 40upx;
		line-height: 70upx;
		position: relative;

		&.cell-hover {
			background: #fafafa;
		}

		&.b-b:after {
			left: 30upx;
		}

		.cell-icon {
			height: 32upx;
			width: 32upx;
			font-size: 22upx;
			color: #fff;
			text-align: center;
			line-height: 32upx;
			background: #f85e52;
			border-radius: 4upx;
			margin-right: 12upx;

			&.hb {
				background: #ffaa0e;
			}

			&.lpk {
				background: #3ab54a;
			}

		}

		.cell-more {
			align-self: center;
			font-size: 24upx;
			color: $font-color-light;
			margin-left: 8upx;
			margin-right: -10upx;
		}

		.cell-tit {
			flex: 1;
			font-size: 26upx;
			color: $font-color-light;
			margin-right: 10upx;
		}

		.cell-tip {
			font-size: 26upx;
			color: $font-color-dark;

			&.disabled {
				color: $font-color-light;
			}

			&.active {
				color: $base-color;
			}
			&.red{
				color: $base-color;
			}
		}

		&.desc-cell {
			.cell-tit {
				max-width: 90upx;
			}
		}

		.desc {
			flex: 1;
			font-size: $font-base;
			color: $font-color-dark;
		}
	}
	
	/* 支付列表 */
	.pay-list{
		padding-left: 40upx;
		margin-top: 16upx;
		background: #fff;
		.pay-item{
			display: flex;
			align-items: center;
			padding-right: 20upx;
			line-height: 1;
			height: 110upx;	
			position: relative;
		}
		.icon-weixinzhifu{
			width: 80upx;
			font-size: 40upx;
			color: #6BCC03;
		}
		.icon-alipay{
			width: 80upx;
			font-size: 40upx;
			color: #06B4FD;
		}
		.icon-xuanzhong2{
			display: flex;
			align-items: center;
			justify-content: center;
			width: 60upx;
			height: 60upx;
			font-size: 40upx;
			color: $base-color;
		}
		.tit{
			font-size: 32upx;
			color: $font-color-dark;
			flex: 1;
		}
	}
	
	.footer{
		position: fixed;
		left: 0;
		bottom: 0;
		z-index: 995;
		display: flex;
		align-items: center;
		width: 100%;
		height: 90upx;
		justify-content: space-between;
		font-size: 30upx;
		background-color: #fff;
		z-index: 998;
		color: $font-color-base;
		box-shadow: 0 -1px 5px rgba(0,0,0,.1);
		.price-content{
			padding-left: 30upx;
		}
		.price-tip{
			color: $base-color;
			margin-left: 8upx;
		}
		.price{
			font-size: 36upx;
			color: $base-color;
		}
		.submit{
			display:flex;
			align-items:center;
			justify-content: center;
			width: 280upx;
			height: 100%;
			color: #fff;
			font-size: 32upx;
			background-color: $base-color;
		}
	}
	
	/* 优惠券面板 */
	.mask{
		display: flex;
		align-items: flex-end;
		position: fixed;
		left: 0;
		top: var(--window-top);
		bottom: 0;
		width: 100%;
		background: rgba(0,0,0,0);
		z-index: 9995;
		transition: .3s;
		
		.mask-content{
			width: 100%;
			min-height: 30vh;
			max-height: 70vh;
			background: #f3f3f3;
			transform: translateY(100%);
			transition: .3s;
			overflow-y:scroll;
		}
		&.none{
			display: none;
		}
		&.show{
			background: rgba(0,0,0,.4);
			
			.mask-content{
				transform: translateY(0);
			}
		}
	}

	/* 优惠券列表 */
	.coupon-item{
		display: flex;
		flex-direction: column;
		margin: 20upx 24upx;
		background: #fff;
		.con{
			display: flex;
			align-items: center;
			position: relative;
			height: 120upx;
			padding: 0 30upx;
			&:after{
				position: absolute;
				left: 0;
				bottom: 0;
				content: '';
				width: 100%;
				height: 0;
				border-bottom: 1px dashed #f3f3f3;
				transform: scaleY(50%);
			}
		}
		.left{
			display: flex;
			flex-direction: column;
			justify-content: center;
			flex: 1;
			overflow: hidden;
			height: 100upx;
		}
		.title{
			font-size: 32upx;
			color: $font-color-dark;
			margin-bottom: 10upx;
		}
		.time{
			font-size: 24upx;
			color: $font-color-light;
		}
		.right{
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			font-size: 26upx;
			color: $font-color-base;
			height: 100upx;
		}
		.price{
			font-size: 44upx;
			color: $base-color;
			&:before{
				content: '￥';
				font-size: 34upx;
			}
		}
		.tips{
			font-size: 24upx;
			color: $font-color-light;
			line-height: 60upx;
			padding-left: 30upx;
		}
		.circle{
			position: absolute;
			left: -6upx;
			bottom: -10upx;
			z-index: 10;
			width: 20upx;
			height: 20upx;
			background: #f3f3f3;
			border-radius: 100px;
			&.r{
				left: auto;
				right: -6upx;
			}
		}
	}
	.del-btn{
		padding:10upx 10upx;
		font-size:34upx; 
		height: 50upx;
		color: $font-color-light;
	}

</style>
