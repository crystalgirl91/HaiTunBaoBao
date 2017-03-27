angular.module('credits',  ["ng", "common"])
.controller('creditsController', ['$scope','$API','serialParams', function($scope, $API,serialParams){
	$scope.page = 1;
	$scope.pagesize = 8;
	$scope.pages = null;
	$scope.pageTotal = null;
	$scope.rows = [];

	$scope.allcredits = JSON.parse(sessionStorage.$UserInfo).avalicredit || 0;

	$scope.loadData = function(isFirst){
		$API.marketList($scope.page,$scope.pagesize).then(function(res){
			if(isFirst){
				$scope.pages = res.model.pages;
				$scope.pageTotal = res.model.total;
			}
			$scope.page++;
			[].push.apply($scope.rows,res.model.list.map(row => {
				let paStr = serialParams({
					prodAid:row.prodAid,
					skuAid:row.skuAid
				});
				row._href = "./credits_exchange.html" + paStr;
				return row;
			}));
		});
	};
	$scope.loadmore = function(){
		$scope.loadData();
	};
	$scope.loadData(true);
}])
