angular.module("personal_store", ["ng", "personal", "common","ngRoute"])

.config(["$sceProvider",'$routeProvider',function($sceProvider, $routeProvider) {
	$sceProvider.enabled(false);
	$routeProvider
		.when('/all/:pageIndex?', {})
		.when('/insurances/:pageIndex?', {})
		.when('/news/:pageIndex?', {})
		.otherwise({ redirectTo: '/all/:pageIndex?' })
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

	// $scope.jumpPage2 = function(){
	// 	return $scope.jumpPage($scope.pageCategory, $scope.pageIndex)
	// }
	$scope.$on('$routeChangeSuccess', loadData);

	function getHref(category,typecode,prodaid){
		var url;
		// 其他类型的产品为预约产品
		if(category === "其它类"){
			url = "./products_other.html"
		}
		else if(typecode === "C"){
			url = "./products_control.html";
		}
		else if(typecode === "N"){
			url = "./products_insurance.html";
		}
	    return url + "?prodAid=" + encodeURIComponent(prodaid);
	}

	function loadData(e, route){

		let index = Number(route.params.pageIndex);
		if(!index){
			return $route.updateParams({
				pageIndex: 1
			})
		}
		$scope.pageIndex = index;
		$scope.pageCategory = $location.path().split('/').filter(x => x).shift();
		if($scope.pageCategory=='insurances'){
			api.listFavoriteInsurances(index, $scope.pageSize).then(
				data => {
					console.log(data.model.list);
					$scope.alls = data.model.list.map(function(item){
						item._type = 'insurances';
						item._href = getHref(item.category,item.prod_type,item.ref_aid);
						item.money = (parseInt(item.prod_price_amt)/100).toFixed(2);
						return item;
					});
					$scope.total = data.model.total;
				},
				err => {
					console.log(err);
				}
			);
		}
		else if($scope.pageCategory=='news'){
			api.listFavoriteNews(index, $scope.pageSize).then(
				data => {
					$scope.alls = data.model.list.map(function(item){
						item._type = 'news';
						item._href = "./post.html?id=" + item.ref_aid;
						return item;
					});
					$scope.total = data.model.total;
				},
				err => {
					console.log(err);
				}
			);
		}
		else{
			api.listAllFavorites(index, $scope.pageSize).then(
				data => {
					$scope.alls = data.model.list.map(function(item){
						if(Number(item.prod_price_amt) || Number(item.prod_price_amt)==0){
							item._type = 'insurances';
							item._href = getHref(item.category,item.prod_type,item.ref_aid);
							item.money = (parseInt(item.prod_price_amt)/100).toFixed(2);
						}
						else{
							item._type = 'news';
							item._href = "./post.html?id=" + item.ref_aid;
						}
						return item;
					});
					$scope.total = data.model.total;
				},
				err => {
					console.log(err);
				}
			);
		}
	};

	$scope.cancelStore = function(data){
		let index = $scope.alls.indexOf(data);
		api.delFavorites(data.fav_aid).then(
			data => {
				$scope.alls.splice(index,1);
			},
			err => {
				console.log(err);
			}
		);
	}
}])

