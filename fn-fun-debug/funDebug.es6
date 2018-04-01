(function () {
	let funDebugLibUrl = "https://js.fundebug.cn/fundebug.0.3.6.min.js",
			funDebugConfig = [{
				name: 'YX-JS-ToolKit',
				apikey: 'f3b60739271056d85641a316cd13350f5960922b510427e3ec514bc3f0a74ac5',
				appversion: '',
				releaseStage: '', // 'development', 'test', 'production'
				silent: false,
				silentResource: false,
				silentHttp: false
			}, {
				name: 'YX-WebThemeKit',
				apikey: 'af39dba572be6c381017954d7728bd8282cb5d56ee452fb31127ea8458a5a016',
				appversion: '',
				releaseStage: '', // 'development', 'test', 'production'
				silent: false,
				silentResource: false,
				silentHttp: false
			}, {
				name: 'YX-CSS-ToolKit',
				apikey: '3aa41ba4e15588c7c9d11bc4f227d38165095a36ee1619ac0cb06ac163005376',
				appversion: '',
				releaseStage: '', // 'development', 'test', 'production'
				silent: false,
				silentResource: false,
				silentHttp: false
			}, {
				name: 'Others',
				apikey: '77900ef947409eaa50cf1ad42697c12eadd3600dbd0a8d4c112eef36fca21fee',
				appversion: '',
				releaseStage: '', // 'development', 'test', 'production'
				silent: false,
				silentResource: false,
				silentHttp: false
			}],

			siteFunDebugConfig = funDebugConfig.filter(function (site) {
				return site.name.toLowerCase() === siteConfig.name.toLowerCase();
			})[0];

	loadScript(funDebugLibUrl, null, null, {attributes: siteFunDebugConfig, isAsync: true});
})();