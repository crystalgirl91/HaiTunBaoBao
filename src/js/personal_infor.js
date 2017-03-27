angular.module("personal_infor", ["ng", "personal", "common"])
.directive("uploadImg", ["$API", function(api){
	return {
		restrict: "A",
		link: function(scope, element, attrs){

			element.find("input").on("change", function () {
			    var form = element.find("form")[0];
			    console.log(44444,form)
			    if (form.img.files.length) {
			        (function () {
			            var progressbar = $("<div data-progress style='position:absolute;top:0;bottom:0;left:0;right:0;background:transparent;'><em style='width:0%;display:block;height:100%;border-bottom:1px solid green;'></em></div>");
			            var loaded = progressbar.find("em");
			            element.append(progressbar);
			            var upload = api.upload(form);
			            upload.upload.onprogress = function (e) {
			                loaded.css("width", (e.loaded / e.total * 100).toFixed(2) + "%");
			            };
			            upload.onload = function () {
			                try {
			                    var data = JSON.parse(upload.responseText);
			                    api.setHeaderimg(data[0].name).then(function (res) {
			                    	form.reset();
			                        progressbar.remove();
			                    	api.getUserInfo(true).then(
			                    		data => {
			                    			scope.infor = data.model;
			                    		},
			                    		err => {
			                    			console.log(err);
			                    		}
			                    	);
			                    }, function (rej) {
			                        // B.showMessage(rej.errMessage);
			                    });
			                } catch (e) {
			                    // B.showMessage(e.message);
			                }
			            };
			            upload.onerror = function (e) {
			                // B.showMessage("头像上传失败");
			                $("form")[0].reset();
			                progressbar.remove();
			            };
			        })();
			    }
			});
		}
	};
}])
.controller("inforController", ["$scope", "$API", function(scope, api){
	scope.is_edit = false;
	scope.edit = function(){
		scope.is_edit = !scope.is_edit;
		if(!scope.is_edit)
			scope.infor.nick_name = scope.oldName;
	}
	api.getUserInfo(true).then(
		data => {
			scope.infor = data.model;
			scope.oldName = data.model.nick_name;
		},
		err => {
			console.log(err);
		}
	);
	scope.editName = function(){
		api.setNickname(scope.infor.nick_name).then(
			data => {
				scope.is_edit = !scope.is_edit;
				scope.oldName = scope.infor.nick_name;
			},
			err => {
				console.log(err);
			}
		);
	}

}])
