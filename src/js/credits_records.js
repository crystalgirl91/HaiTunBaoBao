import "./ui.js";

angular.module("credits.records", ["ng", "common","directives"])
.controller("creditsRecordsController", ["$scope", "$API","queryParams","$filter", function($scope, $API,queryParams,$filter){
	$scope.page = 1;
	$scope.pagesize = 10;
	$scope.get_list = function(){
		$API.marketAuExchangeHistory($scope.page,$scope.pagesize).then(res => {
			$scope.history_list = res.model.list;
			$scope.totals = res.model.total;
		});
	};
	$scope.get_list();
}])
angular.bootstrap(document, ["credits.records"])
