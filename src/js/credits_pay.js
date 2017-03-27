import "./ui.js";

angular.module("credits.pay", ["ng", "common"])
.controller("creditsPayController", ["$scope", "$API","queryParams", function($scope, $API,queryParams){
	$scope.orderid = queryParams.ordAid;
	$scope.ordermoney = queryParams.payMoney;
	$scope.ordercont = queryParams.prodName;

	$scope.radios = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19];
}])
angular.bootstrap(document, ["credits.pay"])
