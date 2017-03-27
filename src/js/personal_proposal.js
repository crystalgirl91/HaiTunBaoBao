angular.module("personal_proposal", ["ng", "personal", "common","ngRoute"])

.config(["$sceProvider",'$routeProvider',function($sceProvider, $routeProvider) {
	$sceProvider.enabled(false);
	$routeProvider
		.when('/proposal/:pageIndex?', {})
		.when('/order/:pageIndex?', {})
		.otherwise({ redirectTo: '/proposal/:pageIndex?' })
}])

.run(["$rootScope", "$API", '$route', '$location', ($scope, api, $route, $location) => {

	$scope.type="proposal";
	$scope.pageSize = 4;
	$scope.total = 0;
	$scope.selectPage = function(pageIndex){
		$route.updateParams({
			pageIndex: $scope.pageIndex
		})
	};

	$scope.$on('$routeChangeSuccess', loadData);
	$scope.changeType = function(){
		window.location = location.pathname+"#/"+$scope.type+"/1";
	}

	function loadData(e, route){
		let index = Number(route.params.pageIndex);
		$scope.type = location.hash.split('/')[1];
		if(!index){
			return $route.updateParams({
				pageIndex: 1
			})
		}
		$scope.pageIndex = index;
		if($scope.type=="proposal"){
			api.insureProposalAuList($scope.pageIndex, $scope.pageSize).then(
				data => {
					$scope.proposals = data.model.list.sort(function(a,b){ return a.fpCdate>b.fpCdate?-1:1; });
					$scope.total = data.model.total;
				},
				err => {
					console.log(err);
				}
			)
		}
		else{
			api.insureIsucoverAuList($scope.pageIndex, $scope.pageSize).then(
				data => {
					$scope.orders = data.model.list;
					$scope.total = data.model.total;
				},
				err => {
					console.log(err);
				}
			)
		}

	}

}])


