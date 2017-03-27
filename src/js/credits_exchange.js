import "./ui.js";

angular.module('credits_exchange',  ["ng", "common", "directives"])
.config(["$sceProvider", function($sceProvider){
	$sceProvider.enabled(false);
}])
.controller('creditsExchangeController', ["$scope","$API","queryParams","serialParams", function($scope,$API,queryParams,serialParams){
	$scope.get_detail = function(){
		$API.marketDetail(queryParams.prodAid,queryParams.skuAid).then(function(res){
			$scope.details = res.model;
		});
	};

	$scope.allcredits = JSON.parse(sessionStorage.$UserInfo).avalicredit || 0;
	
	$scope.page = {};
	$scope.page.page = 1;
	$scope.page.pagesize = 10;

	$scope.get_history = function(){
		$API.marketProdExchangeHistory(queryParams.prodAid,queryParams.skuAid,$scope.page.page,$scope.page.pagesize).then(function(res){
			$scope.history_list = res.model.list;
			if($scope.page.pages === undefined){
				$scope.page.pages = res.model.pages;
				$scope.page.totals = res.model.total;
			}
		});
	};
	$scope.submit = function(){
		location.href = "./credits_order.html" + serialParams({
			prodAid:$scope.details.prodAid,
			skuAid:$scope.details.skuAid,
			proNum:$scope.proNumber
		});
	};
	$scope.get_detail();
	$scope.get_history();
}])


