import "./ui.js";

angular.module("products.other.success", ["ng", "common","directives"])
.controller("productsOtherSuccessController", ["$scope", "$API","queryParams", function($scope, $API,queryParams){
	let skuAid = queryParams.skuAid;
	let prodAid = queryParams.prodAid;
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
	            result='微助产品'
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
	$scope.get_list();

}])
