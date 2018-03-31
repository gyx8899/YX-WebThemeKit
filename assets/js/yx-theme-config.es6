;(function (global) {
	let YX_SITE_CONFIG = [{
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

	initSiteParams();

	enableServiceWorker();

	global.addEventListener("load", loadConfigWhenLoaded, false);

	siteConfig && loadConfigs(siteConfig.config, true);

	function initSiteParams()
	{
		siteConfig.queryParams = getUrlQueryParams();
	}

	/**
	 * Enable PWA server worker when it is available
	 */
	function enableServiceWorker()
	{
		if ('serviceWorker' in navigator)
		{
			window.addEventListener('load', function () {
				navigator.serviceWorker.register(window.location.origin + '/' + siteConfig.pathNameRoot + '/assets/js/sw.js', {scope: '/'})
						.then(function (registration) {
							// 注册成功
							console.log('ServiceWorker registration successful with scope: ', registration.scope);
						})
						.catch(function (err) {
							// 注册失败:(
							console.log('ServiceWorker registration failed: ', err);
						});
			});
		}
	}

	/***
	 * Load site config components
	 * @param {Object} configInfo
	 * @param {Boolean} isFirstScreen, true: load resource before dom ready, false: load resource after dom ready
	 */
	function loadConfigs(configInfo, isFirstScreen)
	{
		for (let config in configInfo)
		{
			if (configInfo.hasOwnProperty(config) &&
					configInfo[config] &&
					((isFirstScreen && configUrl[config].firstScreen) || (!isFirstScreen && !configUrl[config].firstScreen)))
			{
				loadScript(configUrl[config].url, null, null, !isFirstScreen);
			}
		}
	}

	/***
	 * Load previewCode component when dom has 'data-toggle="previewCode"'
	 */
	function loadPreviewCode()
	{
		if (document.querySelectorAll('[data-toggle="previewCode"]').length)
		{
			loadScript(configUrl['previewCode'].url, function () {
				return new PreviewCode();
			}, null, true);
		}
	}

	/***
	 * Load QUnit when url has param '&qunit=true
	 */
	function loadQUnit()
	{
		if (getQueryParamValue('qunit') === 'true')
		{
			loadScript(configUrl['qUnit'].url, null, null, true);
		}
	}

	/**
	 * Load Dev resource when url has param '&env=dev'
	 */
	function loadDev()
	{
		if (siteConfig.name === 'YX-WebThemeKit' && siteConfig.queryParams['env'] === 'dev')
		{
			Object.keys(configUrl).forEach(function (key) {
				configUrl[key].url = configUrl[key].url.replace('https://gyx8899.github.io', '../../..');
			});
		}
	}

	/***
	 * Load config components after dom ready
	 */
	function loadConfigWhenLoaded()
	{
		loadDev();
		siteConfig && loadConfigs(siteConfig.config, false);
		loadPreviewCode();
		loadQUnit();
	}

	global.siteConfig = siteConfig;
})(window);