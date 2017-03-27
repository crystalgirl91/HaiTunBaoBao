import ui from "./ui.js";

/**
*  Module
*
* Description
*/
angular.module('products_seckill_control', ["ng", "common", "directives"])
.config(['$sceProvider',function($sceProvider) {
	$sceProvider.enabled(false);
}])
.controller('productsSeckillControlController', ['$scope','$API','queryParams','$sce','serialParams','dialog', function($scope,$API,queryParams,$sce,serialParams,dialog){
	$scope.data = {};
	let pmAid = queryParams.pmAid;
	$API.seckillDetail(pmAid).then(function(res){
		$scope.data = res.model;
		$scope.data._colors = {};
		$scope.data._sizes = {};
		res.model.prodSkus.forEach(function(m){
			if(m.color.length && m.size.length){
				$scope.has_skus = true;
			}
			$scope.data._colors[m.color] = m.color;
			$scope.data._sizes[m.size] = m.size;
		});
		$scope.prodinfo = $sce.trustAsHtml(res.model.prodInfo);
		$scope.data.proNumber = 1;
		$scope.data._prodExts = res.model.prodExts.filter(function(item){ return item.value ? true : false });
	});
	$scope.grades = [1,2,3,4,5];
	
	
	$scope.page = 1;
	$scope.pagesize = 4;
	$scope.comments = [];
	$scope.getComment = function(){
		$API.insureCommentsList(queryParams.prodAid,0,$scope.page,$scope.pagesize).then(function(res){
			if($scope.page <= res.model.pages){
				$scope.page++;
				[].push.apply($scope.comments,res.model.list);
				$scope.pages = res.model.pages;	
			}else{
				$scope.hide = true;
			}
		});
	}
	$scope.collect = function(){
		//type  B表示保险   Z表示资讯
		if(Number($scope.fav_aid) === -1){
			$API.addFavorite("BM",queryParams.pmAid).then(function(res){
				$scope.fav_aid = res.model.fav_aid;
			});
		}else{
			$API.delFavorite($scope.fav_aid).then(function(res){
				$scope.fav_aid = -1;
			});
		}
	};
	$scope.openDetailDialog = function(){
		dialog.alert({
			title: "详情",
			width: 616,
			top: 100,
			scope: $scope,
			content: `<p ng-repeat="ext in data._prodExts"><span>{{ext.key}}</span>: <span>{{ext.value}}</span></p>`,
			controller: function($scope){}
		});
	};
	$API.isFavorite("BM",queryParams.pmAid).then(function(res){
		$scope.fav_aid = res.model.fav_aid;
	});

	$scope.ok = function(){
		var sku = $scope.data.prodSkus.filter(function(item){
			return item.color === $scope.data._color && item.size === $scope.data._size;
		})[0];

		var skuAid = sku ? sku.skuAid : $scope.data.prodSkus[0].skuAid;
		location.href = "./products_seckill_control_order.html" + serialParams({
			pmAid:pmAid,
			prodAid:$scope.data.prodAid,
			skuAid:skuAid,
			proNum:$scope.data.proNumber
		});
	};

	$scope.getComment();
}])




