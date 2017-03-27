angular.module("announces", ["ng", "ngRoute", "common"])
.config(['$routeProvider', function($routeProvider) {
	$routeProvider
		.when('/:pageIndex', {})
		.otherwise({ redirectTo: '/1' })
}])
.controller("announcesController", ["$scope", "$API", "queryParams", "$location", '$route', (scope, api, params, $location, $route) => {
	scope.$on('$routeChangeSuccess', function(e, route){
		let { params } = route
		if(params.pageIndex){
			api.listNotices(params.pageIndex).then(
				data => {
					scope.items = data.model.list;
					scope.pages = data.model.pages;
					scope.pageTotal = data.model.total;
					scope.pageSize = data.model.pageSize;
				},
				err => {}
			)
		}
	})
	scope.items = [];
	scope.pageTotal = 0;
	scope.selectPage = function(){
		console.log(scope);
		$route.updateParams({
			pageIndex: scope.pageIndex
		})
	}
}])