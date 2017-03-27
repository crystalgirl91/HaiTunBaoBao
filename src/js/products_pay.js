import "./ui.js";

angular.module("products.pay", ["ng", "common"])
.config(['$sceProvider',function($sceProvider) {
	$sceProvider.enabled(false);
}])
.controller("productsPayController", ["$scope", "$API","queryParams", function($scope, api, queryParams){
	$scope.allow_zhifubao = false
	$scope.allow_wangyin = false
	$scope.allow_weixin = false
	$scope.radios = [
		{ code: 'ABC-NET-B2C', name: '中国农业银行' },
		{ code: 'BOCO-NET-B2C', name: '交通银行' },
		{ code: 'CCB-NET-B2C', name: '建设银行' },
		{ code: 'ICBC-NET-B2C', name: '工商银行' },

		{ code: 'ECITIC-NET-B2C', name: '中信银行' },
		{ code: 'CMBCHINA-NET-B2C', name: '招商银行' },
		{ code: 'CMBC-NET-B2C', name: '中国民生银行' },
		{ code: 'BOC-NET-B2C', name: '中国银行' },

		{ code: 'GDB-NET-B2C', name: '广发银行' },
		{ code: 'CIB-NET-B2C', name: '兴业银行' },
		{ code: 'SPDB-NET-B2C', name: '上海浦东发展银行' },
		{ code: 'POST-NET-B2C', name: '中国邮政' },

		{ code: 'SHB-NET-B2C', name: '上海银行' },
		{ code: 'BCCB-NET-B2C', name: '北京银行' },
		{ code: 'BJRCB-NET-B2C', name: '北京农村商业银行' },
		{ code: 'SDB-NET-B2C', name: '深圳发展银行' },

		{ code: 'HXB-NET-B2C', name: '华夏银行' },
		{ code: 'PINGANBANK-NET-B2C', name: '平安银行' },
		{ code: 'CEB-NET-B2C', name: '光大银行' }
	]


	api.availabelPay().then(res => {
		console.log(res)
		$scope.allow_zhifubao = res.model.indexOf('zhifubao') > -1
		$scope.allow_wangyin = res.model.indexOf('wangyin') > -1
		$scope.allow_weixin = res.model.indexOf('weixin') > -1
	})
	$scope.data = {
		trade_no: queryParams.trade_no,
		money: queryParams.money,
		body: queryParams.body,
		attach: queryParams.attach,
		isuType: queryParams.isuType,
		surl: queryParams.surl,
		furl: queryParams.furl,
		show_url: queryParams.surl,
		paytype: "zhifubao"
	};
	$scope.$watch("data",function(newval){
		if(newval){
			switch(newval.paytype){
				case "weixin":
					$scope.actionUrl = "http://tx.htbaobao.com/pay/tenpay.do?qr=qr";
					break;
				case "zhifubao":
					$scope.actionUrl = "http://tx.htbaobao.com/pay/alipay.do";
					break;
				case "wangyin":
					$scope.actionUrl = "http://testdev.htbaobao.com/pay/bankpay.do";
			}
		}
	},true)
}])
