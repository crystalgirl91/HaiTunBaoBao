import "./ui.js";
import "./area.js";

angular.module("products_seckill_control_order", ["ng", "common","area","ngCookies"])
.controller('productsSeckillControlOrderController', ['$scope','$API','queryParams','serialParams','dialog','$cookies', function($scope, $API,queryParams,serialParams,dialog,$cookies){
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
			controller: "productsOrderDialog"
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
		let d = $scope.data;
		let extdata = d._prodExts.map(i => {
			return {"name": i.key, "value": i.value}
		});
		let postData = {
			pmAid:qs.pmAid,
            skuAid: qs.skuAid,
			prodAid: d.prodAid,
			addrAid: d.address,
			addrUsername: d.username,
			phone: d.usertell,
			itemCount:qs.proNum,
			coupons: d.is_coupon ? d.coupon.usr_coup_aid : undefined,
			usePoint: d.is_points,
			data:JSON.stringify(extdata)
		};

		// $API.ctrlProdSubmit(postData.skuAid,postData.prodAid,postData.addrAid,postData.addrUsername,postData.phone,postData.itemCount,postData.coupons,postData.usePoint,postData.data)
		$API.seckillAuCtrlBuy(postData.pmAid, postData.skuAid, postData.prodAid, postData.addrAid, postData.addrUsername, postData.phone, postData.itemCount, postData.coupons, postData.usePoint,postData.data)
		.then(function(res){
			let basename = location.pathname.split('/');
			basename.pop();
            basename = basename.join('/');
			let surl = "http://" + location.host + basename + "/products_pay_success.html?" + $.param({
                prodAid: d.prodAid,
                skuAid: postData.skuAid,
                prodName: d.prodName
			});
			let furl = "http://" + location.host + basename + "/products_control_pay_failure.html?" + $.param({
				prodAid: d.prodAid,
                skuAid: postData.skuAid,
                prodName: d.prodName,
                ordAid:res.model.ordAid,
				money:res.model.payMoney,
				body:$scope.data.prodName,
				attach:$scope.data.prodName,
				isuType:"C",
			});
			let str = $.param({
				trade_no:res.model.payAid,
				money:res.model.payMoney,
				body:$scope.data.prodName,
				attach:$scope.data.prodName,
				isuType:"C",
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
	$scope.calculateMoneyWithPoints = function(){
		var money = $scope.data.price*$scope.data.proNum;
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
		var money = $scope.data.price*$scope.data.proNum;
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
			$scope.data._totalmoney = money;
			$scope.data.coupon = undefined;
		}
	};
	$scope.getDataFromCookie = function(){
		let cookies = $cookies.getAll();
		Object.keys(cookies).forEach(key =>{
			let k = key.replace('ctrl_cookie_','');
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
		if(key ==='ctrl_cookie__prodExts'){
			$cookies.putObject(key,val);
		}else{
			$cookies.put(key,val);
		}
	};
	$scope.clearDataInCookie = function(){
		Object.keys($cookies.getAll()).forEach(key => {
			if(key.indexOf("ctrl_cookie_") !== -1){
				$cookies.remove(key);
			}
		});
	};

	let qs = queryParams;
	let prodAid = qs.prodAid;
	let skuAid = qs.skuAid;
	let pmAid = qs.pmAid;

	$scope.data = {};
	$scope.data.proNum = qs.proNum;
	$scope.coupons = [];
	
	$API.getUserInfo().then(function(res){
		$scope.allcredits = res.model.avalicredit;
		$scope.userid = res.model.cust_aid;
	})
	.then(() => {
		$API.listavaliablecoupon($scope.userid,skuAid).then(function(res){
			$scope.coupons = res.model.list.map(c => {c._name = (c.dist_amt/100).toFixed(2) + "元优惠券";return c});
		});
	});

	$API.seckillDetail(pmAid).then(data => {
		Object.keys(data.model).forEach(key =>{
			$scope.data[key] = data.model[key];
		});
		$scope.data._prodExts = $scope.data.prodExts.filter(function(item){ return item.value ? false : true});
		$scope.data._totalmoney = $scope.data.price*$scope.data.proNum;
	})
	.then(() => {
		return $scope.getAddress();
	})
	.then(() => {
		$scope.addresses[0] && ($scope.data.address = $scope.addresses[0].addrAid);
		$scope.getDataFromCookie();
	});
	
}])
.controller("productsOrderDialog", ["$scope", "$area","$API",function($scope, $area,$API){
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
