<template>
	<view style="padding-top: 40upx;">
		<view class="inputArea" style="text-align: center;">
			<image class="logo-img" src="../../static/logo.png"></image>
		</view>
		<view class="inputArea">
			<uni-icons type="person" size="30"></uni-icons>
			<label>用户名</label>
			<input v-model="loginUsername" placeholder="请输入用户名" type="text" maxlength="11" class="inputClass" />
		</view>
		<view class="inputArea">
			<uni-icons type="locked" size="30"></uni-icons>
			<label>密码</label>
			<input v-model="loginPassword" placeholder="请输入登录密码" type="password" class="inputClass" @confirm="goLogin"/>
		</view>
		<view style="padding: 0 10%;text-align: center;">
			<text style="color: red;">{{message}}</text>
		</view>
		<view class="inputArea">
			<view class="login-button" @click="goLogin">登 录</view>
		</view>
		<!--
		<view class="inputArea">
			<text style="float:right;color:blue;" @click="openRegisterPage">>>注册>></text>
		</view>
		-->
	</view>
</template>

<script>
	
	import {
	    mapMutations  
	} from 'vuex';
	
	import Request from '@/plugins/request/js/index.js'
	var _self;
	import uniIcons from "@/components/uni-icons/uni-icons.vue"
	export default {
		components: {uniIcons},
		data() {
			return {
				loginUsername: '',
				loginPassword: '',
				message: '',
				logining: false
			}
		},
		onLoad() {
			_self=this;
		},
		methods: {
			...mapMutations(['login']),
			
			openRegisterPage() {
				uni.navigateTo({
					url: '../login/register',
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			},
			goLogin() {
				let loginUsername = this.loginUsername;
				let loginPassword = this.loginPassword;
				if (!loginUsername) {
					this.message = "用户名不能为空";
					return false;
				}
				if (!loginPassword) {
					this.message = "密码不能为空";
					return false;
				}
				uni.showLoading({
					title: '登录中...',
					mask: false
				});
				// 
				/// 统一封装
				Request().post('auth/vehicle/admin/login', 
						{
						header: {
							contentType: 'application/json'
						},
						data: {
							username: this.loginUsername,
							password: this.loginPassword
						}			
				    }).then(
						res => {
							console.log("登录返回数据",res);
							//这里都是假的，其实并没有在后台判断用户和密码
							let result = JSON.parse(res.data);
							// token判断
							if (result.token === 'vehicleAdminToken') {
								let userinfo={
									token: result.token //测试用的token值
								}
								uni.setStorageSync('token',result.token);
								uni.hideLoading();
								this.login(res.data); //使用vuex本地存储来共享数据
								uni.navigateBack();//跳转到上一页
								/* uni.reLaunch({
										 url: "../report/home" //跳转到首页
											}); */
							} else {
								uni.removeStorageSync('userinfo');
								this.message = '用户名或密码错误';
								uni.hideLoading();
								this.$api.msg(result.msg);
							}
					});
			
			}
		}
	}
</script>

<style>
	.inputArea {
		padding: 30upx 10%;
	}

	.inputClass {
		border: 2px solid #ccc;
		border-radius: 44upx;
		outline: 0;
		width: 90%;
		height: 100upx;
		padding: 16upx 30upx;
		background-color: #FFFFFF;
	}
	.logo-img {
		width: 300upx;
		height: 300upx;
		border-radius: 150upx;
	}
	.login-button {
		background: #2fc25b;
		color: #FFFFFF;
		border-radius: 44upx;
		font-size: 36upx;
		text-align: center;
		padding: 20upx;
	}
</style>
