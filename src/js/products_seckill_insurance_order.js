import "./ui.js";
import "./area.js";

/**
*  Module
*
* Description
*/
angular.module('products.seckill.insurance.order', ["ng", "common", "directives","area","ngCookies"])
.config(['$sceProvider',function($sceProvider) {
	$sceProvider.enabled(false);
}])
.controller('productsSeckillInsuranceOrderController', ['$scope','$API','queryParams','serialParams','$filter','cnid','dialog','$uibModal','$cookies',function($scope,$API,queryParams,serialParams,$filter,cnid,dialog,$uibModal,$cookies){
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

	$scope.ok = function(){
		let d = $scope.data;
		let extdata = d._prodExts.map(i => {
			return {"name": i.key, "value": i.value}
		});
		var postData = {
			pmAid:queryParams.pmAid,
			isuName:d.username,
			isuSsn:d.userCode,
			email:d.usermail,
			addrAid:d.address,
			skuAid:d.skuAid,
			prodAid:queryParams.prodAid,
			money:d.price,
			isuDtStart:$filter("date")(d.isuDtStart,"yyyy-MM-dd"),
			coupons:d.is_coupon ? d.coupon.usr_coup_aid : undefined,
			usePoint:d.is_points,
			data: JSON.stringify(extdata)
		};
		$API.seckillAuBuy(
			postData.pmAid,
			postData.isuName,
			postData.isuSsn,
			postData.email,
			postData.addrAid,
			postData.skuAid,
			postData.prodAid,
			postData.money,
			postData.isuDtStart,
			postData.coupons,
			postData.usePoint,
			postData.data)
		.then( res => {
			let basename = location.pathname.split('/');
			basename.pop();
            basename = basename.join('/');
			let surl = "http://" + location.host + basename + "/products_pay_success.html?" + $.param({
                prodAid: d.prodAid,
                skuAid: d.skuAid,
                prodName: d.prodName
			});
			let furl = "http://" + location.host + basename + "/products_pay_failure.html?" + $.param({
				ordAid:res.model.ordAid,
				money:res.model.payMoney,
				body:$scope.data.prodName,
				attach:$scope.data.prodName,
				isuType:"N",
				prodAid: d.prodAid,
                skuAid: d.skuAid,
                prodName: d.prodName
			});
			let str = $.param({
				trade_no:res.model.payAid,
				money:res.model.payMoney,
				body:$scope.data.prodName,
				attach:$scope.data.prodName,
				isuType:"N",
				surl:surl,
				furl:furl,
				show_url:surl
			});
			//$scope.clearDataInCookie();
			if(res.model.payMoney){
				location.href = "http://" + location.host + basename +  "/products_pay.html?" + str;
			}
			else{
				location.href = surl
			}
		});
	};
	$scope.calculateMoneyWithPoints = function(){
		var money = $scope.data.price;
		if($scope.data.is_points){
			$scope.data.is_coupon = false;
			$scope.data.coupon = undefined;
			$API.calculateAmtByPoint($scope.allcredits,money).then(function(res){
				$scope.data._totalmoney = res.model;
			});
		}else{
			$scope.data._totalmoney = money;
		}
	};
	$scope.calculateMoneyWithCoupon = function(){
		var money = $scope.data.price;
		if($scope.data.is_coupon){
			$scope.data.is_points = false;
			if($scope.data.coupon){
				$API.calculateAmtByCoupon($scope.data.coupon.usr_coup_aid,money).then(function(res){
					$scope.data._totalmoney = res.model;
				},function(err){
					console.log(err)
				});
			}else{
				$scope.data._totalmoney = money;
			}
		}else{
			$scope.data.coupon = undefined;
			$scope.data._totalmoney = money;
		}
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
	
	$scope.openAgreementDialog = function(){
		$uibModal.open({
			size:"lg",
			template: `
				<div class="uid-content">
					<h3 class="uid-title">协议<span class="uid-close-btn" ng-click="$close()"></span></h3>
					<div class="uid-body" ng-bind-html='agreementHTML'></div>
				</div>
				`,
			controller: "agreementController",
			resolve:{
				paramData : function(){ return $scope.data }
			}
		})
	};

	$scope.getDataFromCookie = function(){
		let cookies = $cookies.getAll();
		Object.keys(cookies).forEach(key =>{
			let k = key.replace('isu_cookie_','');
			let val = cookies[key];
			if(k === "_prodExts"){
				let cookie_prodExts = JSON.parse(val);
				$scope.data._prodExts.map(d => {
					cookie_prodExts.forEach(c => {
						if(c.key === d.key){
							d.value = c.value;
						}
					});
					return d;
				});
			}
			else if(k === 'address'){
				// cookie地址不存在地址列表中，则选中地址列表的第一项
				$scope.addresses.filter(adr => adr.addrAid === val).length > 0 && ($scope.data[k] = val);
			}
			else{
				$scope.data[k] = val;
			}
		});
	};
	$scope.setDataToCookie = function(key,val){
		if(key ==='isu_cookie__prodExts'){
			$cookies.putObject(key,val);
		}else{
			$cookies.put(key,val);
		}
	};
	$scope.clearDataInCookie = function(){
		Object.keys($cookies.getAll()).forEach(key => {
			if(key.indexOf("isu_cookie_") !== -1){
				$cookies.remove(key);
			}
		});
	};

	let ordAid = queryParams.ordAid;
	let pmAid = queryParams.pmAid;
	$scope.data = {};
	$API.seckillDetail(pmAid).then(function(res){
		Object.keys(res.model).forEach(key =>{
			$scope.data[key] = res.model[key];
		});
		$scope.data._prodExts = $scope.data.prodExts.filter(function(item){ return item.value ? false : true});
		$scope.data._totalmoney = $scope.data.price;
		$scope.data.isuDtStart = (new Date()).setDate(new Date().getDate() + 1);
	})
	.then(() => {
		return $API.getUserInfo(true).then(function(res){
			$scope.allcredits = res.model.avalicredit;
			$scope.userid = res.model.cust_aid;
		});
	})
	.then(() => {
		$API.listavaliablecoupon($scope.userid,$scope.data.skuAid).then(function(res){
			$scope.coupons = res.model.list.map(c => {c._name = (c.dist_amt/100).toFixed(2) + "元优惠券";return c});
		});
		return $scope.getAddress();
	})
	.then(() => {
		$scope.addresses[0] && ($scope.data["address"] = $scope.addresses[0].addrAid);
		if(ordAid){
			// 续保
			$API.insureCommAuPolicyDetail(ordAid).then(res =>{
				let d = res.model;
				$scope.data['username'] = d.isuName;
				$scope.data['userCode'] = d.isuSsn;
				$scope.data['usermail'] = d.custEmail;
				$scope.data['isuDtStart'] = d.isuDtStart;
				if($scope.addresses.filter(adr => { return adr.addrAid === d.addrAid}).length){
					$scope.data['address'] = d.addrAid
				}		
			});
		}else{
			$scope.getDataFromCookie();
		}
	})
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
.controller('agreementController', ['$scope', '$API','paramData',function($scope,$API,paramData){
	var skuaid = paramData.skuAid;
	$API.insureskuDetailCommonIsuDocAgree(skuaid).then(data => {
		$scope.agreementHTML = data.model;
	});
}])


