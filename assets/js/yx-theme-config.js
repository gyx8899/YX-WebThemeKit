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
				themeHeaderFooter: {
					firstScreen: true,
					url: 'https://gyx8899.github.io/YX-WebThemeKit/theme-header-footer/headerFooter-auto.js'
				},
				googleAnalytics: {
					url: 'https://gyx8899.github.io/YX-WebThemeKit/fn-google-analytics/googleAnalytics.js'
				},
				funDebug: {
					url: 'https://gyx8899.github.io/YX-WebThemeKit/fn-fun-debug/funDebug.js'
				},
				githubRibbon: {
					url: 'https://gyx8899.github.io/YX-WebThemeKit/theme-github-ribbon/githubRibbon.js'
				},
				fixedToolbar: {
					url: 'https://gyx8899.github.io/YX-WebThemeKit/theme-fixed-toolbar/fixedToolbar.js'
				},
				previewCode: {
					url: 'https://gyx8899.github.io/YX-WebThemeKit/fn-preview-code/previewCode.js'
				},
				qUnit: {
					url: 'https://gyx8899.github.io/YX-WebThemeKit/fn-qunit/qunit.js'
				}
			},

			sitePathName = document.location.pathname,
			siteConfig = YX_SITE_CONFIG.filter(function (site) {
				return site.pathNameRoot.toLowerCase() === sitePathName.split('/')[1].toLowerCase();
			})[0];

	window.addEventListener("load", loadConfigWhenLoaded, false);

	siteConfig && loadConfigs(siteConfig.config, true);

	function loadConfigs(configInfo, isFirstScreen)
	{
		for (var config in configInfo)
		{
			if (configInfo.hasOwnProperty(config) &&
					((isFirstScreen && configUrl[config].firstScreen) || (!isFirstScreen && !configUrl[config].firstScreen)))
			{
				loadScript(configUrl[config].url, null, null, !isFirstScreen);
			}
		}
	}

	function loadPreviewCode()
	{
		// Load previewCode when has 'data-toggle="previewCode"'
			if (document.querySelectorAll('[data-toggle="previewCode"]').length)
			{
				loadScript(configUrl['previewCode'].url, function () {
					return new PreviewCode();
				}, null, true);
			}
	}

	function loadQunit()
	{
		// Load qunit when url has param '&qunit=true
		if (getQueryParamValue('qunit') === 'true')
		{
			loadScript(configUrl['qUnit'].url, null, null, true);
		}
	}

	function loadConfigWhenLoaded()
	{
		siteConfig && loadConfigs(siteConfig.config, false);
		loadPreviewCode();
		loadQunit();
	}

	window.siteConfig = siteConfig;
})();