(function () {
	var siteInfo = [{
				name: 'YX-JS-ToolKit',
				pathNameRoot: 'YX-JS-ToolKit',
				theme: 'https://gyx8899.github.io/YX-WebThemeKit/theme-header-footer/owl/headerFooter-auto.js'
			}, {
				name: 'YX-WebThemeKit',
				pathNameRoot: 'YX-WebThemeKit',
				theme: 'https://gyx8899.github.io/YX-WebThemeKit/theme-header-footer/owl/headerFooter-auto.js'
			}, {
				name: 'YX-CSS-ToolKit',
				pathNameRoot: 'YX-CSS-ToolKit',
				theme: 'https://gyx8899.github.io/YX-WebThemeKit/theme-header-footer/owl/headerFooter-auto.js'
			}, {
				name: 'Others',
				pathNameRoot: '',
				theme: 'https://gyx8899.github.io/YX-WebThemeKit/theme-header-footer/owl/headerFooter-auto.js'
			}],
			pathName = document.location.pathname,
			currentSiteInfo = siteInfo.filter(function (site) {
				return site.pathNameRoot.toLowerCase() === pathName.split('/')[1].toLowerCase();
			})[0] || siteInfo[siteInfo.length - 1];

	loadScript(currentSiteInfo.theme);

	function loadScript(url)
	{
		var script = document.createElement("script");
		script.type = "text/javascript";
		script.src = url;
		document.body.appendChild(script);
	}
})();