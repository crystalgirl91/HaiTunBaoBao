"use strict";
let path = require("path");
let webpack = require("webpack");
let ExtractTextPlugin = require("extract-text-webpack-plugin");

//let extractJade = new ExtractTextPlugin("./[name].html");
let extractCSS = new ExtractTextPlugin("./css/[name].css");

let devMode = process.env.NODE_ENV !== "production";
let devServerPort = process;
console.log(process.argv);

let plugins = [
	extractCSS,
	new webpack.optimize.CommonsChunkPlugin("common", "js/common.js")
];

if(!devMode){
	plugins.push(
		new webpack.optimize.UglifyJsPlugin({
			compress: { warnings: false }
		})
	);
}

module.exports = {
	context: `${__dirname}`,
	entry: {

		/* 关于我们大类 */
		about:
			[ "./src/js/about.js", "./src/less/about.less" ],
		join:
			["./src/js/join.js", "./src/less/join.less"],
		contact:
			["./src/js/contact.js", "./src/less/contact.less"],
		announces:
			["./src/js/announces.js", "./src/less/announces.less"],
		announce:
			["./src/js/announce.js", "./src/less/announce.less"],
		qa:
			["./src/js/qa.js", "./src/less/qa.less"],
		/* 关于我们大类 end */

		/* 风险热点 */
		index:
			[ "./src/js/index.js", "./src/less/index.less" ],
		posts:
			[ './src/js/posts.js', "./src/less/posts.less"],
		post:
			[ "./src/js/post.js", "./src/less/post.less"],
		/* 风险热点end */

		/* 我的账户大类 */
		personal_account:
			["./src/less/personal_common.less", "./src/less/personal_account.less", "./src/js/personal.js", "./src/js/personal_account.js"],
		personal_store:
			["./src/less/personal_common.less", "./src/less/personal_store.less", "./src/js/personal.js", "./src/js/personal_store.js"],
		personal_baobao:
			["./src/less/personal_common.less", "./src/less/personal_baobao.less", "./src/js/personal.js", "./src/js/personal_baobao.js"],
		personal_design:
			["./src/less/personal_common.less", "./src/less/personal_design.less", "./src/js/personal.js", "./src/js/personal_design.js"],
		personal_proposal:
			["./src/less/personal_common.less", "./src/less/personal_proposal.less", "./src/js/personal.js", "./src/js/personal_proposal.js"],
		personal_claimfor:
			["./src/less/personal_common.less", "./src/less/personal_claimfor.less", "./src/js/personal.js", "./src/js/personal_claimfor.js"],
		personal_myclaimfor:
			["./src/less/personal_common.less", "./src/less/personal_myclaimfor.less", "./src/js/personal.js", "./src/js/personal_myclaimfor.js"],
		personal_jf:
			["./src/less/personal_common.less", "./src/less/personal_jf.less", "./src/js/personal.js", "./src/js/personal_jf.js"],
		personal_coupon:
			["./src/less/personal_common.less", "./src/less/personal_coupon.less", "./src/js/personal.js", "./src/js/personal_coupon.js"],
		personal_infor:
			["./src/less/personal_common.less", "./src/less/personal_infor.less", "./src/js/personal.js", "./src/js/personal_infor.js"],
		personal_address:
			["./src/less/personal_common.less", "./src/less/personal_address.less", "./src/js/personal.js", "./src/js/personal_address.js"],
		personal_editPassword:
			["./src/less/personal_common.less", "./src/less/personal_editPassword.less", "./src/js/personal.js", "./src/js/personal_editPassword.js"],
		personal_editPhone:
			["./src/less/personal_common.less", "./src/less/personal_editPhone.less", "./src/js/personal.js", "./src/js/personal_editPhone.js"],
		personal_editEmail:
			["./src/less/personal_common.less", "./src/less/personal_editEmail.less", "./src/js/personal.js", "./src/js/personal_editEmail.js"],
		claim_step:
			["./src/less/personal_common.less", "./src/less/claim_step.less", "./src/js/personal.js", "./src/js/claim_step.js"],
		personal_distribution:
			["./src/less/personal_common.less", "./src/less/personal_distribution.less", "./src/js/personal.js", "./src/js/personal_distribution.js"],
		personal_message:
			["./src/less/personal_common.less", "./src/less/personal_message.less", "./src/js/personal.js", "./src/js/personal_message.js"],
		personal_message_detail:
			["./src/less/personal_common.less", "./src/less/personal_message_detail.less", "./src/js/personal.js", "./src/js/personal_message_detail.js"],

		/* 我的账户大类结束 */

		/* 积分商城 */
		credits:
			["./src/js/credits.js","./src/less/credits.less"],
		credits_order:
			["./src/js/credits_order.js","./src/less/credits.less"],
		credits_exchange:
			["./src/less/credits.less","./src/js/credits_exchange.js"],
		credits_pay_success:
			["./src/less/products_pay_success.less","./src/js/credits_pay_success.js"],
		credits_pay_failure:
			["./src/less/products_pay_failure.less","./src/js/credits_pay_failure.js"],
		// credits_pay:
		// 	["./src/less/credits_pay.less","./src/js/credits_pay.js"],
		credits_records:
			["./src/less/credits_records.less","./src/js/credits_records.js"],

		lottery: ['./src/less/lottery.less', './src/js/lottery.js'],
		/* 积分商城end */

		/* 产品中心 */
		products:
			["./src/js/products.js","./src/less/products.less"],
		products_insurance:
			["./src/js/products_insurance.js","./src/less/products_insurance.less"],
		// products_mutual:
		// 	["./src/js/products_mutual.js","./src/less/products_mutual.less"],
		products_control:
			["./src/js/products_control.js","./src/less/products_control.less"],
		products_other:
			["./src/js/products_other.js","./src/less/products_other.less"],
		products_other_success:
			["./src/js/products_other_success.js","./src/less/products_pay_success.less"],
		products_control_order:
			["./src/js/products_control_order.js","./src/less/products_control_order.less"],
		products_insurance_order:
			["./src/js/products_insurance_order.js","./src/less/products_order.less"],
		products_other_order:
			["./src/js/products_other_order.js","./src/less/products_other_order.less"],
		// products_mutual_order:
		// 	["./src/js/products_mutual_order.js","./src/less/products_order.less"],
		products_pay:
			["./src/js/products_pay.js","./src/less/products_pay.less"],
		products_seckill:
			["./src/js/products_seckill.js","./src/less/products.less"],
		products_seckill_control:
			["./src/js/products_seckill_control.js","./src/less/products_control.less"],
		products_seckill_insurance:
			["./src/js/products_seckill_insurance.js","./src/less/products_insurance.less"],
		products_seckill_control_order:
			["./src/js/products_seckill_control_order.js","./src/less/products_control_order.less"],
		products_seckill_insurance_order:
			["./src/js/products_seckill_insurance_order.js","./src/less/products_order.less"],
		products_pay_success:
			["./src/js/products_pay_success.js","./src/less/products_pay_success.less"],
		products_pay_failure:
			["./src/js/products_pay_failure.js","./src/less/products_pay_failure.less"],
		products_control_pay_failure:
			["./src/js/products_control_pay_failure.js","./src/less/products_pay_failure.less"],
		risk_result:
			["./src/js/risk_result.js","./src/less/risk_result.less"],
		risk_evaluate:
			["./src/js/risk_evaluate.js","./src/less/risk_evaluate.less"],

		/* 产品中心 end */

		/* 登录 注册 密码类 */
		signin:
			["./src/js/signin.js", "./src/less/signin.less"],

		signup:
			["./src/js/signup.js", "./src/less/signup.less"],

		passwd_reset:
			["./src/js/passwd_reset.js", "./src/less/passwd_reset.less"],
		/* 登录 注册 密码类 end */



		common: [
			"./src/js/common.js",
			"./src/less/common.less"
		]
	},
	output: {
		path: `${__dirname}/built/`,
		publicPath: "/",
		filename: "./js/[name].js"
	},
	devtool: "source-map",
	module: {
		loaders: [
			{ test: require.resolve("jquery"), loader: "expose?$!expose?jQuery" },
			{ test: /\.js$/, exclude: /node_modules/, loader: "babel" },
			{ test: /\.gif|png|jpg|jpeg|svg|ttf|woff2?|eot$/, loader: "file",
				query: {
					name: "img/[hash][name].[ext]"
				}
			},
			// { test: /\.jade$/, include: /tmpl/, loader: "jade" },
			// { test: /\.jade$/, exclude: /tmpl/, loader: extractJade.extract([
			// 	"html", path.join(__dirname, "lib/jade_tmpl")
			// 	]) },
			//{ test: /\.css$/, loader: extractCSS.extract("css-loader") },
//			{ test: /\.less$/, loaders: ["raw?-url", "less"] }
			{ test: /\.less$/, loader: extractCSS.extract(["css", "less"]) }
		]
	},
	plugins: plugins,
	devServer: {
		port: 45678,
		host: "0.0.0.0",
		contentBase: `${__dirname}/src`
		//quiet: true
	}
};

