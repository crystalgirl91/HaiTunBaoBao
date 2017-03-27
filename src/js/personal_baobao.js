angular.module("personal_baobao", ["ng", "personal", "common","ngRoute"])

.config(["$sceProvider",'$routeProvider',function($sceProvider, $routeProvider) {
	$sceProvider.enabled(false);
	$routeProvider
		.when('/comm/all/:pageIndex?', {})
		.when('/comm/0/:pageIndex?', {})
		.when('/comm/1/:pageIndex?', {})
		.when('/comm/2/:pageIndex?', {})
		.when('/comm/3/:pageIndex?', {})
		.when('/comm/4/:pageIndex?', {})
		.when('/comm/8/:pageIndex?', {})
		.when('/comm/9/:pageIndex?', {})
		.when('/comm/10/:pageIndex?', {})
		.when('/mutual/all/:pageIndex?', {})
		.when('/mutual/2/:pageIndex?', {})
		.when('/mutual/4/:pageIndex?', {})
		.when('/mutual/6/:pageIndex?', {})
		.when('/mutual/7/:pageIndex?', {})
		.when('/mutual/8/:pageIndex?', {})
		.otherwise({ redirectTo: 'comm/all/:pageIndex?' })
}])
.run(["$rootScope", "$API", '$route', '$location', "dialog", ($scope, api, $route, $location, dialog) => {
	$scope.date = new Date((new Date()).getTime() + 30 * 24 * 60 * 60 * 1000);
	let path = $location.path().split('/').filter(x => x);
	$scope.pageCategory = path[0]+"/"+path[1];
	$scope.type=path[0];

	$scope.pageSize = 4;
	$scope.total = 0;
	$scope.selectPage = function(pageIndex){
		$route.updateParams({
			pageIndex: $scope.pageIndex
		})
	};
	$scope.jumpPage = function(cate, index){
		$scope.pageCategory = cate;
		$location.url(`${cate}/${index}`);
	}

	$scope.$on('$routeChangeSuccess', loadData);
	$scope.changeType = function(){
		$scope.pageCategory = $scope.type+"/all";
		window.location = location.pathname+"#/"+$scope.type+"/all/1";
	}
	$scope.getData = function(){
		console.log(3333333333);
		let policyStatus = Number($scope.pageCategory.split('/')[1]);
		if($scope.type=="comm"){
			api.insureCommAuPolicyList($scope.pageIndex, $scope.pageSize, !policyStatus&&policyStatus!==0?undefined:policyStatus).then(
				data => {
					$scope.comm = data.model.list;
					$scope.total = data.model.total;
				},
				err => {
					console.log(err);
				}
			);
		}
		else{
			api.ctrlProdList($scope.pageIndex, $scope.pageSize, !policyStatus&&policyStatus!==0?undefined:policyStatus).then(
				data => {
					$scope.mutual = data.model.list;
					$scope.total = data.model.total
				},
				err => {
					console.log(err);
				}
			);
		}
	};
	function loadData(e, route){
		
		let index = Number(route.params.pageIndex);
		$scope.type = location.hash.split('/')[1];
		$scope.pageCategory = location.hash.split('/')[1]+'/'+location.hash.split('/')[2];
		if(!index){
			return $route.updateParams({
				pageIndex: 1
			})
		}
		$scope.pageIndex = index;
		$scope.getData();
	}
	$scope.evaluateBaobao = function(cur_item){
		$scope.curItem = cur_item;
		dialog.box({
			title: "",
			width: 598,
			top: 100,
			/*
				scope 可以指定 dialog controller scope 的 parent, 不写的话默认是 rootScope
				这样dialog controller就可以访问到当前scope上的数据了
			*/
			scope: $scope,
			contentUrl: "include/evaluate_baobao.html",
			controller: "evaluateBaobaoController"
		}).then(
			res => {
				/* dialog 关闭的时候会返回信息 */
				console.log(res);
			},
			err => {
				/*  如果contentUrl 出错会在这个报错  */
			}
		);
	}
	$scope.payInsurance = function(data){
		let surl = "http://" + location.host + "/products_insurance_order.html/products_pay_success.html?" + $.param({
			prodAid: data.prodAid,
			skuAid: data.skuAid,
			prodName: data.prodName
		});
		let furl = "http://" + location.host + "/products_insurance_order.html/products_pay_failure.html?" + $.param({
			prodAid: data.prodAid,
			skuAid: data.skuAid,
			prodName: data.prodName
		});
		let str = $.param({
			trade_no: data.ordAid,
			money: data.isuAmt,
			body: data.prodName,
			attach: data.prodName,
			isuType:"N",
			surl:surl,
			furl:furl,
			show_url:surl
		});
		return "http://" + location.host + "/products_pay.html?" + str;
	}
	$scope.payControl = function(data){
		let surl = "http://" + location.host + "/products_control_order.html/products_pay_success.html?" + $.param({
			prodAid: data.prodAid,
			skuAid: data.skuAid,
			prodName: data.prodName
		});
		let furl = "http://" + location.host + "/products_control_order.html/products_pay_failure.html?" + $.param({

		});
		let str = $.param({
			trade_no: data.ordAid,
			money: data.prodPriceAmt + data.shipFee,
			body: data.prodName,
			attach: data.prodName,
			isuType:"C",
			surl:surl,
			furl:furl,
			show_url:surl
		});
		return "http://" + location.host + "/products_pay.html?" + str;
	}
}])
.controller("evaluateBaobaoController", ["$scope", "$API", function($scope, api){
	$scope.evaluate = { grade: "5" };
	$scope.submit = () => {
		api.insureCommentsAuAdd($scope.curItem.prodAid, $scope.curItem.ordAid, $scope.curItem.skuAid, $scope.evaluate.grade, $scope.evaluate.content).then(
			data => {
				$scope.$root.getData();
			},
			err => {
				console.log(err);
				// alert(err.errMessage)
			}
		);
		$scope.$close();
	};
}])