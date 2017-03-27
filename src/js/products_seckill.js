import "./ui.js";
angular.module('products_seckill', ["ng", "common", "directives","ngRoute"])
.config(["$sceProvider", '$routeProvider', function($sceProvider, $routeProvider){
	$sceProvider.enabled(false);
	$routeProvider.when('/:pageIndex?', {})
}])
.filter("timespan",function(){
	function getTimespan(tspan){
		let ts = parseInt(tspan);
		if(!ts){
			return ''
		}
		let MILLISECOND_TO_SECOND = 1000,
			SECOND_TO_MINUTE = 60,
			MINUTE_TO_HOURE = 60,
			HOURE_TO_DAY = 24,
			DAY_TO_WEEK = 7,
			DAY_TO_MONTH = 30,
			MONTH_TO_YEAR = 12;
		let seconds = Math.floor(ts / MILLISECOND_TO_SECOND) % SECOND_TO_MINUTE;
		let minuts = Math.floor(ts / (MILLISECOND_TO_SECOND * SECOND_TO_MINUTE)) % MINUTE_TO_HOURE;
		let hours =  Math.floor(ts / (MILLISECOND_TO_SECOND * SECOND_TO_MINUTE * MINUTE_TO_HOURE)) % HOURE_TO_DAY;
		let days = Math.floor(ts / (MILLISECOND_TO_SECOND * SECOND_TO_MINUTE * MINUTE_TO_HOURE * HOURE_TO_DAY)) % DAY_TO_MONTH;
		if(days > DAY_TO_WEEK){
			days = days % DAY_TO_WEEK;
		}
		let weeks = Math.floor(days / DAY_TO_WEEK);
		let months = Math.floor(ts / (MILLISECOND_TO_SECOND * SECOND_TO_MINUTE * MINUTE_TO_HOURE * HOURE_TO_DAY * DAY_TO_MONTH)) % MONTH_TO_YEAR;
		let year = Math.floor(ts / (MILLISECOND_TO_SECOND * SECOND_TO_MINUTE * MINUTE_TO_HOURE * HOURE_TO_DAY * DAY_TO_MONTH * MONTH_TO_YEAR));
		let unit = ["年","月","周","天","时","分","秒"];
		let rtn = "";
		[year,months,weeks,days,hours,minuts,seconds].forEach((val,idx) =>{
			if(val > 0 || idx > 3){
				rtn = rtn + val + unit[idx];
			}
		});
		return rtn;
	};
	return getTimespan;
})
.run(["$rootScope", "$API", '$route','$interval', (scope, api, $route,$interval) => {
	var getHref = function(typecode,prodaid,skuaid,pmaid){
		var url;
		switch (typecode){
	        case 'H':
	            url = "./products_mutual.html";
	            break;
	        case 'C':
	            url = "./products_seckill_control.html?" + $.param({
	            	pmAid:pmaid,
	            	prodAid:prodaid,
	            	skuAid:skuaid
	            });
	            break;
	        case 'N':
	        default :
	            url = "./products_seckill_insurance.html?" + $.param({
	            	pmAid:pmaid,
	            	prodAid:prodaid,
	            	skuAid:skuaid
	            });
	            break;
	    };
	    return url;
	};
	var parseProType = function(code){
		var result;
		switch (code){
	        case 'H':
	            result='微助产品'
	            break;
	        case 'C':
	            result='风险检测产品'
	            break;
	        case 'N':
	        default :
	            result='保险产品'
	            break;
	    }
	    return result;
	};


	scope.pageSize = 4;
	scope.rows = [];
	scope.selectPage = function(){
		$route.updateParams({
			pageIndex: scope.pageIndex
		})
	}
	scope.$on('$routeChangeSuccess', getData)
	function getData(e, route){
		let index = Number(route.params.pageIndex)
		if(!index){
			return $route.updateParams({
				pageIndex: 1
			})
		}
		scope.pageIndex = index
		api.seckillList(index, scope.pageSize).then(
			res => {
				scope.total = res.model.total
				scope.rows = res.model.list.map(function(item){
					item._prodType_name = parseProType(item.prodType);
					item._href = getHref(item.prodType,item.prodAid,item.skuAid,item.pmAid);
					item._start_last = item.startTime - item.now;
					item._end_last = item.endTime - item.now;
					return item;
				});
			}
		)
	}

	$interval(()=>{
		scope.rows = scope.rows.map(row => {
			row._start_last > 0 && (row._start_last -= 1000);
			row._end_last > 0 && (row._end_last -= 1000);
			return row;
		})
	},1000);

}])