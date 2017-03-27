import "./ui.js";
import "./area.js";

angular.module("credits_order", ["ng", "common","area"])
.controller('creditsOrderController', ['$scope','$API','queryParams','serialParams','dialog', function($scope, $API,queryParams,serialParams,dialog){
	let qs = queryParams;
	let prodAid = qs.prodAid;
	let skuAid = qs.skuAid;
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
			controller: "creditsOrderDialog"
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
	};
	$scope.submit = function(){
		let postData = {
			prodAid:qs.prodAid,
            skuAid: qs.skuAid,
            itemCount: qs.proNum,
            addrAid: $scope.data.address,
            addrUsername: $scope.data.username,
            phone: $scope.data.usertell
		};
		$API.marketAuExchange(postData.prodAid,postData.skuAid,postData.addrAid,postData.addrUsername,postData.phone,postData.itemCount)
		.then(function(res){
			let basename = location.pathname.split('/');
			basename.pop();
            basename = basename.join('/');
			let surl = "http://" + location.host + basename + "/credits_pay_success.html?" + $.param({
                prodAid: $scope.data.prodAid,
                prodName: $scope.data.prodName,
                skuAid: $scope.data.skuAid
			});
			let furl = "http://" + location.host + basename + "/credits_pay_failure.html?" + $.param({
				ordAid:res.model.ordAid,
				prodAid: $scope.data.prodAid,
                prodName: $scope.data.prodName,
                skuAid: $scope.data.skuAid,
				trade_no:res.model.payAid,
				money:res.model.payMoney,
				body:$scope.data.prodName,
				attach:$scope.data.prodName,
				isuType:"C",    //积分兑换产品没有这个值 暂时填C
			});
			let str = $.param({
				trade_no:res.model.payAid,
				money:res.model.payMoney,
				body:$scope.data.prodName,
				attach:$scope.data.prodName,
				isuType:"C",    //积分兑换产品没有这个值
				surl:surl,
				furl:furl,
				show_url:surl
			});
			if(res.model.payMoney){
				location.href = "http://" + location.host + basename +  "/products_pay.html?" + str;
			}
			else{
				location.href = surl
			}
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
	$scope.allcredits = JSON.parse(sessionStorage.$UserInfo).avalicredit || 0;
	$scope.data = {};
	$scope.data.proNum = qs.proNum;
	$API.marketDetail(prodAid, skuAid).then(data => {
		Object.keys(data.model).forEach(key =>{
			$scope.data[key] = data.model[key];
		});
	})
	.then(() => {
		return $scope.getAddress();
	})
	.then(()=>{
		$scope.addresses[0] && ($scope.data.address =  $scope.addresses[0].addrAid);
	});
}])
.controller("creditsOrderDialog", ["$scope", "$area","$API",function($scope, $area,$API){
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