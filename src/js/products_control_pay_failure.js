import "./ui.js";

angular.module("products.control.pay.failure", ["ng", "common","directives"])
.controller("productsControlPayFailureController", ["$scope", "$API","queryParams", function($scope, $API,queryParams){
	let skuAid = queryParams.skuAid;
	let prodAid = queryParams.prodAid;
	let ordAid = queryParams.ordAid;
	$scope.prodName = queryParams.prodName;

	$API.getUserInfo().then(function(res){
		$scope.user = res.model.nick_name;
	});

	var getHref = function(typecode,prodaid,skuaid){
		var url;
		switch (typecode){
	        case 'H':
	            url = "./products_mutual.html";
	            break;
	        case "C":
	        	url = "./products_control.html";
	        	break;
	        case 'N':
	        default :
	            url = "./products_insurance.html";
	            break;
	    };
	    return url + "?prodAid=" + prodaid + "&skuAid=" + skuaid;
	};
	var parseProType = function(code){
		var result;
		switch (code){
	        case 'H':
	            result='微助产品';
	            break;
	        case "C":
	        	result = "风险检测产品";
	        	break;
	        case 'N':
	        default :
	            result='保险产品'
	            break;
	    }
	    return result;
	};

	$scope.page = 1;
	$scope.pagesize = 4;
	$scope.get_list = function(){
		$API.insureskuListSimilar(skuAid,prodAid,$scope.page,$scope.pagesize).then(res =>{
			$scope.rows = res.model.list.map(row => {
				row._href = getHref(row.prodType,row.prodAid,row.skuAid);
				row._prodType_name = parseProType(row.prodType);
				return row;
			});
			$scope.totals = res.model.total;
		});
	};
	$scope.repay = function(){
		$API.ctrlProdPay(ordAid).then(
			res =>{
				let basename = location.pathname;
				let baseurl = location.origin + basename.slice(0,basename.lastIndexOf("/"));
				let surl = baseurl + "/products_pay_success.html?" + $.param({
					prodAid: queryParams.prodAid,
	                skuAid: queryParams.skuAid,
	                prodName: queryParams.prodName
				});
				let furl = baseurl + "/products_control_pay_failure.html?" + $.param({
					ordAid:ordAid,
					trade_no:res.model.payAid,
					money:queryParams.money,
					body:queryParams.body,
					attach:queryParams.attach,
					isuType:queryParams.isuType,
					prodAid: queryParams.prodAid,
	                skuAid: queryParams.skuAid,
	                prodName: queryParams.prodName
				});
				let url = baseurl + "/products_pay.html?" + $.param({
					trade_no:res.model.payAid,
					money:queryParams.money,
					body:queryParams.body,
					attach:queryParams.attach,
					isuType:queryParams.isuType,
					surl:surl,
					furl:furl,
					show_url:surl
				});
				location.replace(url);
			});
	};
	$scope.get_list();
}])
