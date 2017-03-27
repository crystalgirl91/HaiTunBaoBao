angular.module("personal_design", ["ng", "personal", "common"])
.controller("designController", ["$scope", "$API", function(scope, api){
	scope.design = {
		sex: '1'
	}
	scope.submit = () => {
		let dsTip = '';
		let dsMf = parseInt(scope.design.sex);
		let dsJob = scope.design.job;
		let dsMinAge = scope.design.age.split("-")[0];
        let dsMaxAge = scope.design.age.split("-")[1];
        let dsRiskType = scope.design.risktype;
        let dsRemark = scope.design.remark;
		api.insureProposalAuAdd(dsTip, dsMf, dsJob, dsMinAge, dsMaxAge, dsRiskType, dsRemark).then(
			data => {
				location.replace("personal_proposal.html#/proposal/1");
			},
			err => {
				console.log(err);
			}
		);
	};
}])
