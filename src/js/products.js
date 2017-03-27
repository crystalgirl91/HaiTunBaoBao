import "./ui.js";

/**
*  Module
*
* Description
*/
angular.module('products', ["ng", "common", "directives","ngRoute"])
.config(['$routeProvider',function($routeProvider) {
	let route = {
		templateUrl: "../include/template_products.html",
		controller: "templateProductsController"
	}
	$routeProvider
		.when('/all/:pageIndex?', {})
		.when('/finance/:pageIndex?', {})
		.when('/health/:pageIndex?', {})
		.when('/network/:pageIndex?', {})
		.when('/other/:pageIndex?', {})
		.otherwise({ redirectTo: '/all/1' })
}])
.run(["$rootScope", "$API", '$route', '$location', ($scope, api, $route, $location) => {
	$scope.pageSize = 4
	$scope.total = 0
	$scope.rows = []

	$scope.jumpPage = function(cate, index){
		$location.url(`${cate}/${index}`)
	}
	$scope.selectPage = function(){
		$route.updateParams({
			pageIndex: $scope.pageIndex
		})
	}
	$scope.$on('$routeChangeSuccess', getData)
	function getData(e, route){
		let index = Number(route.params.pageIndex)
		if(!index){
			return $route.updateParams({
				pageIndex: 1
			})
		}
		$scope.pageIndex = index

		let category = $location.path().split('/').filter(x => x).shift()
		$scope.pageCategory = category
		switch(category){
			case 'finance':
				$scope.categoryValue = '2000103'
			break
			case 'health':
				$scope.categoryValue = '2000102'
			break
			case 'network':
				$scope.categoryValue = '2000101'
			break
			case 'other':
				$scope.categoryValue = '2000104'
			break
			case 'all':
			default:
				$scope.categoryValue = undefined
			break
		}

		api.insureskuList(
			$scope.categoryValue,
			$scope.pageIndex,
			$scope.pageSize
		).then(
			res => {
				$scope.rows = res.model.list.map(function(item){
					item._prodType_name = parseProType(item.prodType);
					item._href = getHref(item.category,item.prodType,item.prodAid);
					return item;
				});
				//$scope.page.pages = res.model.pages;
				$scope.pageTotal = res.model.total;
			},
			err => {}
		)
	}
	function parseProType(code){
		var result;
		switch (code){
	        case 'H':
	            result='微助产品';
	            break;
	        case "C":
	        	result='风险检测产品';
	        	break;
	        case 'N':
	        default :
	            result='保险产品';
	            break;
	    }
	    return result;
	}
	function getHref(category,typecode,prodaid){
		var url;
		// 其他类型的产品为预约产品
		if(category === "2000104"){
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
}])



