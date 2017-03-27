angular.module("post", ["ng", "common"])
.config(["$sceProvider", function($sceProvider){
	$sceProvider.enabled(false);
}])
.controller("postController", ["$scope", "$API", "queryParams", (scope, api, params) => {
	let id = params.id
	scope.id = id
	scope.comments = []
	api.getnewsdetail(id).then(
		data => {
			scope.post = data.model;
			switch(scope.post.recommend_protype){
				case 'N':
					scope.recommend_pro_link = `products_insurance.html?prodAid=${scope.post.recommend_proid}`
				break
				case 'C':
					scope.recommend_pro_link = `products_control.html?prodAid=${scope.post.recommend_proid}`
				break
			}
			if(scope.post.recommend_proimg.indexOf('/img/sys_img/') > 0){
				scope.post.org_recommend_proimg = scope.post.recommend_proimg
				let imgUrlInfo = scope.post.org_recommend_proimg.split('.')
				let ext = imgUrlInfo.pop()
				scope.post.recommend_proimg = imgUrlInfo.join('.') + '_P_S.' + ext
			}
		},
		err => {
			
		}
	)
	scope.fav_aid = '-1'
	api.isFavorite('Z', id).then(data => scope.fav_aid = data.model.fav_aid)
	let pagesize = 4;
	scope.page = 1;
	scope.pages;
	scope.comment_count = 0

	scope.get_comments= function(){
		if(scope.page > scope.pages){
			return;
		}
		api.listcomments(id, scope.page, pagesize).then(
			data => {
				scope.page = scope.page + 1;
				scope.pages = data.model.pages;
				scope.comments.push.apply(scope.comments, data.model.list)
				scope.comment_count = data.model.total
			},
			err => {
			}
		)
	}
	scope.update_comments = function(){
		scope.page = 1;
		api.listcomments(id).then(
			data => {
				scope.page = scope.page + 1;
				scope.comments = data.model.list;
			},
			err => {
			}
		)
	}

	scope.get_comments();

	scope.addComment = function(c){
		api.addComments(id,scope.newcomments).then(
			data => scope.update_comments(),
			err => {
				if(err.errCode === 2000){
					scope.$root.$broadcast("globalTips", 'warn', '请先登录');
					sessionStorage.login_return = location.href;
				}
			}
		)
	}

	scope.addCommentToUser = function(c){
		api.addCommentsToUser(c.news_aid,c._response,c.cust_aid,c.cmt_aid).then(
			data => scope.update_comments(),
			err => {
				if(err.errCode === 2000){
					scope.$root.$broadcast("globalTips", 'warn', '请先登录');
					sessionStorage.login_return = location.href;
				}
			}
		);
	}
	scope.addFavorite = function(type, id){
		api.addFavorite(type, id).then(
			data => scope.fav_aid = data.model.fav_aid,
			err => {
				if(err.errCode === 2000){
					scope.$root.$broadcast("globalTips", 'warn', '请先登录');
					sessionStorage.login_return = location.href;
				}
			}
		)
	}
	scope.delFavorite = function(id){
		api.delFavorite(id).then(
			data => scope.fav_aid = '-1',
			err => {
				if(err.errCode === 2000){
					scope.$root.$broadcast("globalTips", 'warn', '请先登录');
					sessionStorage.login_return = location.href;
				}
			}
		)
	}




}])