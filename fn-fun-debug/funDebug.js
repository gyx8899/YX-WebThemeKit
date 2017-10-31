(function () {
	var funDebugLibUrl = "https://og6593g2z.qnssl.com/fundebug.0.3.3.min.js",
			siteInfo = [{
				name: 'YX-JS-ToolKit',
				pathNameRoot: 'YX-JS-ToolKit',
				apikey: 'f3b60739271056d85641a316cd13350f5960922b510427e3ec514bc3f0a74ac5',
				appversion: '',
				releaseStage: '', // 'development', 'test', 'production'
				silent: false,
				silentResource: false,
				silentHttp: false
			}, {
				name: 'YX-WebThemeKit',
				pathNameRoot: 'YX-WebThemeKit',
				apikey: 'af39dba572be6c381017954d7728bd8282cb5d56ee452fb31127ea8458a5a016',
				appversion: '',
				releaseStage: '', // 'development', 'test', 'production'
				silent: false,
				silentResource: false,
				silentHttp: false
			}, {
				name: 'YX-CSS-ToolKit',
				pathNameRoot: 'YX-CSS-ToolKit',
				apikey: '3aa41ba4e15588c7c9d11bc4f227d38165095a36ee1619ac0cb06ac163005376',
				appversion: '',
				releaseStage: '', // 'development', 'test', 'production'
				silent: false,
				silentResource: false,
				silentHttp: false
			}],
			pathName = document.location.pathname,
			currentSiteInfo = siteInfo.filter(function (site) {
				return site.pathNameRoot.toLowerCase() === pathName.split('/')[1].toLowerCase();
			})[0];

	loadScript(funDebugLibUrl, currentSiteInfo);

	function loadScript(url, siteInfo)
	{
		var script = document.createElement("script");
		script.type = "text/javascript";
		script.src = url;
		for (var attr in siteInfo)
		{
			script.setAttribute(attr, siteInfo[attr]);
		}
		document.body.appendChild(script);
	}
})();
