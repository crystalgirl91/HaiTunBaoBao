angular.module("personal_address", ["ng", "personal", "common", "area"])
.controller("addressController", ["$scope", "$API", "dialog", "$area",function(scope, api, dialog, $area){
	api.userAddressAuList().then(
		data => {
			scope.addresses = data.model;
		},
		err => {
			console.log(err);
		}
	);
	scope.editAddress = function(cur_item){
		scope.curItem = cur_item;
		dialog.box({
			title: "收货信息",
			width: 598,
			top: 100,
			scope: scope,
			contentUrl: "include/edit_address.html",
			controller: "editAddressController"
		}).then(
			res => {
				/* dialog 关闭的时候会返回信息 */
				console.log(res);
			},
			err => {
				/*  如果contentUrl 出错会在这个报错  */
			}
		);
	};
	scope.addAddress = function(cur_item){
		scope.curItem = cur_item;
		dialog.box({
			title: "收货信息",
			width: 598,
			top: 100,
			scope: scope,
			contentUrl: "include/edit_address.html",
			controller: "addAddressController"
		}).then(
			res => {
				/* dialog 关闭的时候会返回信息 */
				console.log(res);
			},
			err => {
				/*  如果contentUrl 出错会在这个报错  */
			}
		);
	};
	scope.deleteAddress = function(cur_item){
		dialog.confirm({
			title: "删除收货人信息",
			width: 598,
			top: 100,
			scope: scope,
			content: "<p class='delete_tip'><i></i>您确定要删除该地址吗？</p>",
		}).then(
			res => {
				if(res){
					api.userAddressAuRemove(cur_item.addrAid, cur_item.custAid).then(
						data => {
							api.userAddressAuList().then(
								data => {
									scope.addresses = data.model;
								},
								err => {
									console.log(err);
								}
							);
						},
						err => {
							console.log(err);
						}
					);
				};
			},
			err => {
			}
		);
	}

}])
.controller("editAddressController", ["$scope", "$API", "$area",function(scope, api, $area){
	scope.division = $area.division;
	scope.address = {};
	let index_province = scope.curItem.region.indexOf('省')+1;
	let index_city = scope.curItem.region.indexOf('市')+1;
	let index_district = scope.curItem.region.indexOf('区')+1;
	if(index_province>0){
		scope.address.province = scope.curItem.region.slice(0, index_province);
		scope.address.city = scope.curItem.region.slice(index_province, index_city);
		scope.address.district = scope.curItem.region.slice(index_city, index_district);
	}
	else{
		scope.address.province = scope.curItem.region.slice(0, index_city);
		scope.address.city = scope.curItem.region.slice(0, index_city);
		scope.address.district = scope.curItem.region.slice(index_city, index_district);
	}
	scope.address.detail = scope.curItem.address;
	scope.submit = () => {
		let region = "";
		if(scope.address.province.indexOf("市")>-1)
			region = scope.address.province + scope.address.district;
		else
			region = scope.address.province + scope.address.city + scope.address.district;
		api.userAddressAuUpdate(scope.curItem.addrAid, region, scope.address.detail).then(
			data => {
				api.userAddressAuList().then(
					data => {
						scope.$parent.addresses = data.model;
						scope.$close();
					},
					err => {
						console.log(err);
					}
				);
			},
			err => {
				console.log(err);
			}
		);
	};
}])
.controller("addAddressController", ["$scope", "$API", "$area",function(scope, api, $area){
	scope.division = $area.division;
	scope.submit = () => {
		let region = "";
		if(scope.address.province.indexOf("市")>-1)
			region = scope.address.province + scope.address.district;
		else
			region = scope.address.province + scope.address.city + scope.address.district;
		api.userAddressAuAdd('', '', region, scope.address.detail).then(
			data => {
				api.userAddressAuList().then(
					data => {
						scope.$parent.addresses = data.model;
						scope.$close();
					},
					err => {
						console.log(err);
					}
				);
			},
			err => {
				console.log(err);
			}
		);
	};
}])