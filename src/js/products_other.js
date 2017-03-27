import "./ui.js";

/**
*  Module
*
* Description
*/
angular.module('products_other', ["ng", "common", "directives"])
.controller('productsOtherController', ['$scope','$API','queryParams','dialog', function($scope,$API,queryParams,dialog){
	
	$scope.grades = [1,2,3,4,5];
	$scope.pay = function(){
		location.href = "./products_other_order.html" + location.search;
	};
	$API.insureskuDetailCommon(queryParams.prodAid).then(function(res){
		$scope.data = res.model;
		$scope.data._prodExts = res.model.prodExts.filter(function(item){ return item.value ? true : false });
		let url = res.model.imageUrl;
		let nurl = url.slice(0,url.lastIndexOf(".")) + "_P_B" + url.slice(url.lastIndexOf("."));
		$scope.data._imgstyle = {"background-image":"url("+ nurl +")"};
	});
	$scope.page = 1;
	$scope.pagesize = 4;
	$scope.comments = [];
	$scope.getComment = function(){
		$API.insureCommentsList(queryParams.prodAid,0,$scope.page,$scope.pagesize).then(function(res){
			$scope.page++;
			[].push.apply($scope.comments,res.model.list);
			$scope.pages = res.model.pages;	
			$scope.show = $scope.page <= res.model.pages;
		});
	};

	$scope.collect = function(){
		//type  B表示保险   Z表示资讯
		if(Number($scope.fav_aid) === -1){
			$API.addFavorite("B",queryParams.prodAid).then(function(res){
				$scope.fav_aid = res.model.fav_aid;
			});
		}else{
			$API.delFavorite($scope.fav_aid).then(function(res){
				$scope.fav_aid = -1;
			});
		}
	};
	$API.isFavorite("B",queryParams.prodAid).then(function(res){
		$scope.fav_aid = res.model.fav_aid;
	});

	$scope.openDetailDialog = function(){
		dialog({
			title: "保障计划",
			width: 616,
			top: 100,
			content: $scope.data.prodInfo,
		});
	};
	$scope.openProExtsDetailDialog = function(){
		dialog({
			title: "详情",
			width: 616,
			top: 100,
			scope:$scope,
			content: `<p ng-repeat="ext in data._prodExts"><span>{{ext.key}}</span>: <span>{{ext.value}}</span></p>`,
			controller: function($scope){}
		});
	};
	$scope.getComment();
}])




