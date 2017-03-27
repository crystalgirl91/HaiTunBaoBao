angular.module("personal_message", ["ng", "personal", "common","ngRoute"])

.config(["$sceProvider",'$routeProvider',function($sceProvider, $routeProvider) {
	$sceProvider.enabled(false);
	$routeProvider
		.when('/mess/:pageIndex?', {})
		.when('/aboutme/:pageIndex?', {})
}])
.run(["$rootScope", "$API", '$route', '$location', ($scope, api, $route, $location) => {
	$scope.pageCategory = $location.path().split('/').filter(x => x).shift();
	$scope.pageSize = 6;
	$scope.total = 0;
	$scope.selectPage = function(){console.log(11111111111,$scope.pageIndex);
		$route.updateParams({
			pageIndex: $scope.pageIndex
		})
	};
	$scope.jumpPage = function(cate, index){
		$scope.pageCategory = cate;
		$location.url(`${cate}/${index}`);
	}

	$scope.$on('$routeChangeSuccess', loadData);

	function loadData(e, route){
		let index = Number(route.params.pageIndex);
		if($scope.pageCategory=='mess'){ $scope.messIndex = index; }
		else{ $scope.aboutIndex = index; }
		if(!index){
			return $route.updateParams({
				pageIndex: 1
			})
		}
		$scope.pageIndex = index;
		$scope.pageCategory = $location.path().split('/').filter(x => x).shift();
		// if($scope.pageCategory=='mess'){
			api.listSystemMsg($scope.messIndex, $scope.pageSize).then(
				data => {
					if($scope.pageCategory=='mess'){
						$scope.messages = data.model.list;
						$scope.total = data.model.total;
					};
					$scope.unreadMess = data.model.list.filter(function(item){ return item.read_tf==0 });
				},
				err => {
					if(err.errCode==1010){
						if($scope.pageCategory=='mess'){
							$scope.messages = [];
						};
						$scope.unreadMess = [];
					};						
				}
			);
		// }
		// else{
			api.listCommentsMsg($scope.aboutIndex, $scope.pageSize).then(
				data => {
					if($scope.pageCategory=='aboutme'){
						$scope.messages = data.model.list;
						$scope.total = data.model.total;
					};
					$scope.unreadAbout = data.model.list.filter(function(item){ return item.read_tf==0 });
					
				},
				err => {
					if(err.errCode==1010){
						if($scope.pageCategory=='aboutme'){
							$scope.messages = [];
						};
						$scope.unreadAbout = [];
					}
				}
			);
		// }
	};
}])