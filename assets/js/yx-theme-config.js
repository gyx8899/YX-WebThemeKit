(function () {
	var YX_SITE_CONFIG = [{
				name: 'YX-JS-ToolKit',
				pathNameRoot: 'YX-JS-ToolKit',
				config: {
					themeHeaderFooter: true,
					googleAnalytics: true,
					funDebug: true,
					githubRibbon: true,
					fixedToolbar: true
				}
			}, {
				name: 'YX-WebThemeKit',
				pathNameRoot: 'YX-WebThemeKit',
				config: {
					themeHeaderFooter: true,
					googleAnalytics: true,
					funDebug: true,
					githubRibbon: true,
					fixedToolbar: true
				}
			}, {
				name: 'YX-CSS-ToolKit',
				pathNameRoot: 'YX-CSS-ToolKit',
				config: {
					themeHeaderFooter: true,
					googleAnalytics: true,
					funDebug: true,
					githubRibbon: true,
					fixedToolbar: true
				}
			}],

			configUrl = {
				themeHeaderFooter: 'https://gyx8899.github.io/YX-WebThemeKit/theme-header-footer/headerFooter-auto.js',
				googleAnalytics: 'https://gyx8899.github.io/YX-WebThemeKit/fn-google-analytics/googleAnalytics.js',
				funDebug: 'https://gyx8899.github.io/YX-WebThemeKit/fn-fun-debug/funDebug.js',
				githubRibbon: 'https://gyx8899.github.io/YX-WebThemeKit/theme-github-ribbon/githubRibbon.js',
				fixedToolbar: 'https://gyx8899.github.io/YX-WebThemeKit/theme-fixed-toolbar/fixedToolbar.js',
				previewCode: 'https://gyx8899.github.io/YX-WebThemeKit/fn-preview-code/previewCode.js',
				qUnit: 'https://gyx8899.github.io/YX-WebThemeKit/fn-qunit/qunit.js'
			},

			sitePathName = document.location.pathname,
			siteConfig = YX_SITE_CONFIG.filter(function (site) {
				return site.pathNameRoot.toLowerCase() === sitePathName.split('/')[1].toLowerCase();
			})[0];

	if (siteConfig)
	{
		for (var config in siteConfig.config)
		{
			if (siteConfig.config.hasOwnProperty(config))
			{
				siteConfig.config[config] && loadScript(configUrl[config]);
			}
		}
	}

	// Load previewCode when has 'data-toggle="previewCode"'
	setTimeout(function () {
		if (document.querySelectorAll('[data-toggle="previewCode"]').length)
		{
			loadScript(configUrl['previewCode'], function () {
				return new PreviewCode();
			});
		}
	}, 0);

	// Load qunit when url has param '&qunit=true
	if (getQueryParamValue('qunit') === 'true')
	{
		loadScript(configUrl['qUnit']);
	}

	window.siteConfig = siteConfig;
})();