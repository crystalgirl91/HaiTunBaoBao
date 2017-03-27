angular.module("index", ["ng", "ngAnimate", "common"])
.config(["$sceProvider", function($sceProvider){
	$sceProvider.enabled(false);
}])
.controller("hotNewsController", ["$scope", "$API", function(scope, api){
	let news = scope.news = [];
	scope.index = 1;
	scope.size = 4;
	scope.pages = Number.POSITIVE_INFINITY;

	scope.loadmore = function(){
		scope.index ++;
		getData();
	};

	getData();

	function getData(){
		api.listhotnews(scope.index, scope.size).then(
			data => {
				scope.pages = data.model.pages;
				data.model.list.forEach(post => {
					if(post.img.indexOf('/img/sys_img/') > 0){
						post.orgImg = post.img
						let imgUrlInfo = post.orgImg.split('.')
						let ext = imgUrlInfo.pop()
						post.img = imgUrlInfo.join('.') + '_P_S.' + ext
					}
					news.push(post);
				})
			},
			err => {
				console.log(err);
			}
		);
	}
	scope.addFavorite = function(post){
		api.addFavorite('Z', post.news_aid).then(
			data => {
				console.log(data);
				post.fav_aid = data.model.fav_aid
				post.isFavorite = '1'
			},
			err => {
				if(err.errCode === 2000){
					scope.$root.$broadcast("globalTips", 'warn', '请先登录');
					sessionStorage.login_return = location.href;
				}
			}
		)
	}
	scope.delFavorite = function(post){
		api.isFavorite('Z', post.news_aid).then(data => {
			if(data.model.fav_aid){
				api.delFavorite(data.model.fav_aid).then(
					data => {
						post.isFavorite = '0'
					},
					err => {
						if(err.errCode === 2000){
							scope.$root.$broadcast("globalTips", 'warn', '请先登录');
							sessionStorage.login_return = location.href;
						}
					}
				)
			}
			else{
				post.isFavorite = '0'
			}
		})
	}
}])
.controller("noticesController", ["$scope", "$API", function(scope, api){
	let notices = scope.notices = [];

	api.listNotices(1, 6).then(
		res => {
			notices.push.apply(notices, res.model.list);
		},
		err => {

		}
	);
}])
.controller('partnerListController', ['$scope', function(scope){
	scope.list = [
		{ name: '人保', url: 'http://www.picc.com.cn' },
		{ name: '中国人寿', url: 'http://www.chinalife.com.cn' },
		{ name: '平安保险', url: '' },
		{ name: '太平洋保险', url: 'http://www.cpic.com.cn' },
		{ name: '永安保险', url: 'http://www.yaic.com.cn' },
		{ name: '大地保险', url: 'http://www.95590.cn' },
		{ name: '安诚保险', url: 'http://www.e-acic.com' },
		{ name: '天安保险', url: 'http://www.95505.com.cn' }
	]
}])
.controller('advSliderController', ['$scope', '$API', function(scope, api){
	let adv_items = scope.adv_items = [];
	scope.active = 0;
	scope.interval = 5000;
	api.listadvert(1, 10).then(data => {
		data.model.list.forEach(item => {
			switch(item.bar_type){
				case "url":
					item.link_url = item.bar_url;
				break;
				case "z":
					item.link_url = "post.html?id=" + item.bar_url;
				break;
				case 'n':
					item.link_url = "products_insurance.html?prodAid=" + item.bar_url;
				break;
				case 'c':
					item.link_url = "products_control.html?prodAid=" + item.bar_url;
				break;
				default:
					item.link_url = "javascript:";
				break;
			}
			adv_items.push(item);
		})
	});
}])

