angular.module("risk_result", ["ng", "common"])
.controller("riskresultController", ["$scope", "$API", function(scope, api){
	scope.risk = {
		level: 0,
		waterline: 228,
		colorFrom: '#fff',
		colorTo: '#fff'
	};
	function setRisk(level){
		if(level>=0 && level<=15){
			scope.risk.colorFrom = '#e55656';
			scope.risk.colorTo = '#be000d';
			scope.risk.eval ="高";
		}
		else if(level>=16 && level<=30){
			scope.risk.colorFrom = '#ff6969';
			scope.risk.colorTo = '#ff0b0b';
			scope.risk.eval ="高";
		}
		else if(level>=31 && level<=50){
			scope.risk.colorFrom = '#ff9600';
			scope.risk.colorTo = '#ff7800';
			scope.risk.eval ="中";
		}
		else if(level>=51 && level<=70){
			scope.risk.colorFrom = '#ffae30';
			scope.risk.colorTo = '#ffa200';
			scope.risk.eval ="中";
		}
		else if(level>=71 && level<=90){
			scope.risk.colorFrom = '#5be788';
			scope.risk.colorTo = '#2cc951';
			scope.risk.eval ="低";
		}
		else{
			scope.risk.colorFrom = '#81ccff';
			scope.risk.colorTo = '#2693f9';
			scope.risk.eval ="低";
		}
	}
	api.getUserInfo(true).then(
		data => {
			console.log(222,data)
			let level = parseInt(data.model.cust_risklevel);
			scope.risk.level = level;
			scope.risk.waterline = 228-228*level/100;
			scope.risktip = data.model.risktip;
			setRisk(level);

			var getHref = function(typecode,prodaid,skuaid){
				var url;
				switch (typecode){
			        case 'H':
			            url = "./products_mutual.html";
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
			        case 'N':
			        default :
			            result='保险产品'
			            break;
			    }
			    return result;
			};
			scope.recommends = data.model.recommends.map(function(item){
				item._prodType_name = parseProType(item.recommend_protype);
				item._href = getHref(item.recommend_protype,item.recommend_proid,item.recommend_skuaid);
				item.price = parseInt(item.recommend_proprice);
				return item;
			});
		},
		err => {
			console.log(err);
		}
	);
}])
