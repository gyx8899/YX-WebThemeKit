(function () {
	var YX_SITE_CONFIG = [{
				name: 'YX-JS-ToolKit',
				pathNameRoot: 'YX-JS-ToolKit',
				config: {
					fixedToolbar: true,
					googleAnalytics: true,
					funDebug: true,
					githubRibbon: true
				}
			}, {
				name: 'YX-WebThemeKit',
				pathNameRoot: 'YX-WebThemeKit',
				config: {
					fixedToolbar: true,
					googleAnalytics: true,
					funDebug: true,
					githubRibbon: true
				}
			}, {
				name: 'YX-CSS-ToolKit',
				pathNameRoot: 'YX-CSS-ToolKit',
				config: {
					fixedToolbar: true,
					googleAnalytics: true,
					funDebug: true,
					githubRibbon: true
				}
			}],

			configUrl = {
				fixedToolbar: 'https://gyx8899.github.io/YX-WebThemeKit/theme-fixed-toolbar/fixedToolbar.js',
				googleAnalytics: 'https://gyx8899.github.io/YX-WebThemeKit/fn-google-analytics/googleAnalytics.js',
				funDebug: 'https://gyx8899.github.io/YX-WebThemeKit/fn-fun-debug/funDebug.js',
				githubRibbon: 'https://gyx8899.github.io/YX-WebThemeKit/theme-github-ribbon/githubRibbon.js'
			},

			sitePathName = document.location.pathname,
			siteConfig = YX_SITE_CONFIG.filter(function (site) {
				return site.pathNameRoot.toLowerCase() === sitePathName.split('/')[1].toLowerCase();
			})[0];

	for (var config in siteConfig.config)
	{
		if (siteConfig.config.hasOwnProperty(config))
		{
			siteConfig.config[config] && loadScript(configUrl[config]);
		}
	}

	window.siteConfig = siteConfig;
})();