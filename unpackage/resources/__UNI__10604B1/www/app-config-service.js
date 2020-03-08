
var isReady=false;var onReadyCallbacks=[];
var __uniConfig = {"pages":["pages/report/home","pages/login/login-home","pages/index/index","pages/report/order","pages/report/sale","pages/report/stock","pages/report/customer","pages/report/cusQuantity","pages/order/order-list","pages/product/pdtCategory","pages/product/list","pages/product/product","pages/order/cart","pages/order/home","pages/stock/home","pages/extension/home","pages/order/createOrder","pages/customer/customer","pages/customer/cusManage","pages/product/newProduct","pages/report/test","pages/order/orderDetail","pages/order/editOrder"],"window":{"navigationBarBackgroundColor":"#00aaff","navigationBarTitleText":"鼎泰汽车手机端","navigationStyle":"default","navigationBarTextStyle":"white"},"tabBar":{"height":"50px","color":"#C0C4CC","selectedColor":"#fa436a","borderStyle":"black","backgroundColor":"#ffffff","list":[{"pagePath":"pages/report/home","iconPath":"static/tabbar/report.png","selectedIconPath":"static/tabbar/report_cur.png","text":"首页"},{"pagePath":"pages/order/home","iconPath":"static/tabbar/order.png","selectedIconPath":"static/tabbar/order_cur.png","text":"订单"},{"pagePath":"pages/stock/home","iconPath":"static/tabbar/stock.png","selectedIconPath":"static/tabbar/stock_cur.png","text":"库存"},{"pagePath":"pages/extension/home","iconPath":"static/tabbar/extension.png","selectedIconPath":"static/tabbar/extension_cur.png","text":"菜单"}]},"splashscreen":{"alwaysShowBeforeRender":true,"autoclose":false},"appname":"vehicle-shop-app","compilerVersion":"2.6.1","entryPagePath":"pages/report/home","networkTimeout":{"request":60000,"connectSocket":60000,"uploadFile":60000,"downloadFile":60000}};
var __uniRoutes = [{"path":"/pages/report/home","meta":{"isQuit":true,"isTabBar":true},"window":{"navigationBarTitleText":"报表首页"}},{"path":"/pages/login/login-home","meta":{},"window":{"navigationBarTitleText":"系统登录"}},{"path":"/pages/index/index","meta":{},"window":{"navigationBarTitleText":"鼎泰汽车手机端"}},{"path":"/pages/report/order","meta":{},"window":{"navigationBarTitleText":"订单报表"}},{"path":"/pages/report/sale","meta":{},"window":{"navigationBarTitleText":"销售额报表"}},{"path":"/pages/report/stock","meta":{},"window":{"navigationBarTitleText":"库存报表"}},{"path":"/pages/report/customer","meta":{},"window":{"navigationBarTitleText":"客户报表"}},{"path":"/pages/report/cusQuantity","meta":{},"window":{"navigationBarTitleText":"客户量报表"}},{"path":"/pages/order/order-list","meta":{},"window":{"navigationBarTitleText":"订单列表"}},{"path":"/pages/product/pdtCategory","meta":{},"window":{"navigationBarTitleText":"商品分类"}},{"path":"/pages/product/list","meta":{},"window":{"navigationBarTitleText":"商品列表"}},{"path":"/pages/product/product","meta":{},"window":{"navigationBarTitleText":"商品详细"}},{"path":"/pages/order/cart","meta":{},"window":{"navigationBarTitleText":"购物车"}},{"path":"/pages/order/home","meta":{"isQuit":true,"isTabBar":true},"window":{"navigationBarTitleText":"订单"}},{"path":"/pages/stock/home","meta":{"isQuit":true,"isTabBar":true},"window":{"navigationBarTitleText":"库存"}},{"path":"/pages/extension/home","meta":{"isQuit":true,"isTabBar":true},"window":{"navigationBarTitleText":"系统功能"}},{"path":"/pages/order/createOrder","meta":{},"window":{"navigationBarTitleText":"创建订单"}},{"path":"/pages/customer/customer","meta":{},"window":{"navigationBarTitleText":"选择客户"}},{"path":"/pages/customer/cusManage","meta":{},"window":{"navigationBarTitleText":"编辑客户"}},{"path":"/pages/product/newProduct","meta":{},"window":{"navigationBarTitleText":"新增商品"}},{"path":"/pages/report/test","meta":{},"window":{"navigationBarTitleText":"测试页面"}},{"path":"/pages/order/orderDetail","meta":{},"window":{"navigationBarTitleText":"订单详细"}},{"path":"/pages/order/editOrder","meta":{},"window":{"navigationBarTitleText":"订单编辑"}}];
__uniConfig.onReady=function(callback){if(__uniConfig.ready){callback()}else{onReadyCallbacks.push(callback)}};Object.defineProperty(__uniConfig,"ready",{get:function(){return isReady},set:function(val){isReady=val;if(!isReady){return}const callbacks=onReadyCallbacks.slice(0);onReadyCallbacks.length=0;callbacks.forEach(function(callback){callback()})}});
service.register("uni-app-config",{create(a,b,c){if(!__uniConfig.viewport){var d=b.weex.config.env.scale,e=b.weex.config.env.deviceWidth,f=Math.ceil(e/d);Object.assign(__uniConfig,{viewport:f,defaultFontSize:Math.round(f/20)})}return{instance:{__uniConfig:__uniConfig,__uniRoutes:__uniRoutes}}}});
