angular.module("personal_message_detail", ["ng", "personal", "common","ngRoute"])

.controller("messageDetailController", ["$scope", "$API", "$location", function(scope, api, $location){
	scope.data = {};
	let msg_aid = $location.search().id;
	scope.type = $location.search().type;
	scope.typeName = $location.search().type=='mess'?'系统消息':'评论我的';
	scope.pageIndex = $location.search().page;

	if(scope.type=='mess'){
		api.getSystemMsgDetail(msg_aid).then(
			data => {
				scope.data = data.model;
			},
			err => {
				console.log(err);
				// alert(err.errMessage);
			}
		)
	}
	else{
		api.getCommentsMsgDetail(msg_aid).then(
			data => {
				scope.data = data.model;
			},
			err => {
				console.log(err);
				// alert(err.errMessage);
			}
		)
	}

}])