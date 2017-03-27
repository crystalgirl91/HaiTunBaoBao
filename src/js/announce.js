angular.module("announce", ["ng", "common"])
.config(['$sceProvider', sce => {
	sce.enabled(false);
}])
.controller("announceController", ["$scope", "$API", "queryParams", (scope, api, params) => {
	let id = params.id;
	api.getNoticeDetail(id).then(
		data => {
			scope.post = data.model;
		},
		err => {}
	)

	let pagesize = 4;
	scope.comments = []
	scope.page = 1;
	scope.pages;
	scope.comment_count = 0

	scope.get_comments= function(){
		if(scope.page > scope.pages){
			return;
		}
		api.listNoticeComments(id, scope.page, pagesize).then(
			data => {
				scope.page = scope.page + 1;
				scope.pages = data.model.pages;
				scope.comments.push.apply(scope.comments, data.model.list)
				scope.comment_count = data.model.total
				console.log(data);
			},
			err => {
			}
		)
	}
	scope.update_comments = function(){
		scope.page = 1;
		api.listNoticeComments(id).then(
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
		api.addNoticeComments(id, scope.newcomments).then(
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
		api.addCommentsToUser(c.msg_aid,c._response,c.cust_aid,c.cmt_aid).then(
			data => {
				scope.$root.$broadcast("globalTips", 'info', data.model)
				scope.update_comments()
			},
			err => {
				if(err.errCode === 2000){
					scope.$root.$broadcast("globalTips", 'warn', '请先登录');
					sessionStorage.login_return = location.href;
				}
			}
		);
	}


}])