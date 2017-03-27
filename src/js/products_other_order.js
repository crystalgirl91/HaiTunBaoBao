import "./ui.js";
import "./area.js";

angular.module("products_other_order", ["ng", "common","area","ngCookies"])
.controller('productsOtherOrderController', ['$scope','$API','queryParams','serialParams','dialog','$cookies',function($scope, $API,queryParams,serialParams,dialog,$cookies){
	let qs = queryParams;
	let prodAid = qs.prodAid;

	$scope.openAddressModel = function(item){
		$scope.curItem = item;
		dialog({
			title: "收货信息",
			width: 616,
			top: 100,
			/*
				可以指定dialog controller的parent, 不写的话默认是rootScope
				这样dialog controller就可以访问到当前scope上的数据了
			*/
			scope: $scope,
			contentUrl: "include/credits_order_dialog.html",
			controller: "editAddressController"
		}).then(
			res => {
				/* dialog 关闭的时候会返回信息 */
				if(res === true){
					$scope.getAddress();
				}
			},
			err => {
				/*  如果contentUrl 出错会在这个报错  */
			}
		)
	};
	$scope.openNewAddressDialog = function(){
		dialog.box({
			title: "收货信息",
			width: 598,
			top: 100,
			scope: $scope,
			contentUrl: "include/credits_order_dialog.html",
			controller: "addAddressController"
		}).then(
			res => {
				/* dialog 关闭的时候会返回信息 */
				if(res === true){
					$scope.getAddress();
				}
			},
			err => {
				/*  如果contentUrl 出错会在这个报错  */
			}
		);
	}
	$scope.submit = function(){
		let postData = {
			skuAid:$scope.data.skuAid,
			prodAid: $scope.data.prodAid,
			custName: $scope.data.username,
			custId: $scope.data.usercard,
			email: $scope.data.useremail,
			address: $scope.data.address,
			requirement: $scope.data.userdir,
		};
		$API.insureCommIsuCoverSubmit(postData.skuAid,postData.prodAid,postData.custName,postData.custId,postData.email,postData.address,postData.requirement)
		.then(function(res){
			//$scope.clearDataInCookie();
			location.href = "products_other_success.html?" + $.param({
				skuAid:postData.skuAid,
				prodAid:postData.prodAid,
				prodName:$scope.data.prodName
			});
		});
		
	};

	$scope.getAddress = function(){
		let addresses = $scope.addresses = [];
		return $API.userAddressAuList().then(
			data => {
				addresses.push.apply(addresses, data.model);
			},
			err => {
				console.log(err);
			}
		);
	};
	$scope.getDataFromCookie = function(){
		let cookies = $cookies.getAll();
		Object.keys(cookies).forEach(key =>{
			let k = key.replace('other_cookie_','');
			let val = cookies[key];
			if(k === 'address'){
				// cookie地址不存在地址列表中，则选中地址列表的第一项
				$scope.addresses.filter(adr => adr.addrAid === val).length > 0 && ($scope.data[k] = val);
			}
			else{
				$scope.data[k] = val;
			}
		});
	};
	$scope.setDataToCookie = function(key,val){
		$cookies.put(key,val);
	};
	$scope.clearDataInCookie = function(){
		Object.keys($cookies.getAll()).forEach(key => {
			if(key.indexOf("other_cookie_") !== -1){
				$cookies.remove(key);
			}
		});
	};
	$scope.data = {};
	$API.insureskuDetailCommon(prodAid).then(data => {
		Object.keys(data.model).forEach(key =>{
			$scope.data[key] = data.model[key];
		});
	})
	.then(()=>{
		return $scope.getAddress();
	})
	.then(() => {
		$scope.addresses[0] && ($scope.data.address = $scope.addresses[0].addrAid);
		$scope.getDataFromCookie();
	});
	
}])
.controller("editAddressController", ["$scope", "$area","$API",function($scope, $area,$API){
	$scope.division = $area.division;
	let copyItem = angular.copy($scope.curItem);
	$scope.address = {
		addrAid:copyItem.addrAid,
		detail:copyItem.address
	};
	let index_province = copyItem.region.indexOf('省')+1;
	let index_city = copyItem.region.indexOf('市')+1;
	let index_district = copyItem.region.indexOf('区')+1;
	if(index_province>0){
		$scope.address.province = copyItem.region.slice(0, index_province);
		$scope.address.city = copyItem.region.slice(index_province, index_city);
		$scope.address.district = copyItem.region.slice(index_city, index_district);
	}
	else{
		$scope.address.province = copyItem.region.slice(0, index_city);
		$scope.address.city = copyItem.region.slice(0, index_city);
		$scope.address.district = copyItem.region.slice(index_city, index_district);
	}
	$scope.submit = function(){
		let postData = {
			addrAid:$scope.address.addrAid,
			region:$scope.address.province + $scope.address.city + $scope.address.district,
			address:$scope.address.detail
		};
		$API.userAddressAuUpdate(postData.addrAid,postData.region, postData.address).then(()=>{
			$scope.$close(true);
		})
	};
}])
.controller("addAddressController", ["$scope", "$API", "$area",function(scope, api, $area){
	scope.division = $area.division;
	scope.address = {};
	scope.submit = () => {
		let region = "";
		if(scope.address.province.indexOf("市")>-1)
			region = scope.address.province + scope.address.district;
		else
			region = scope.address.province + scope.address.city + scope.address.district;
		api.userAddressAuAdd('', '', region, scope.address.detail).then(
			data => {
				scope.$close(true);
			},
			err => {
				console.log(err);
			}
		);
	};
}])