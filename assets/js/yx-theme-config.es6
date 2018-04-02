;(function (global) {
	let YX_SITE_CONFIG = [{
				name: 'YX-JS-ToolKit',
				pathNameRoot: 'YX-JS-ToolKit',
				config: {
					themeHeaderFooter: true,
					googleAnalytics: true,
					githubRibbon: true,
					fixedToolbar: true
				}
			}, {
				name: 'YX-WebThemeKit',
				pathNameRoot: 'YX-WebThemeKit',
				config: {
					themeHeaderFooter: true,
					googleAnalytics: true,
					githubRibbon: true,
					fixedToolbar: true
				}
			}, {
				name: 'YX-CSS-ToolKit',
				pathNameRoot: 'YX-CSS-ToolKit',
				config: {
					themeHeaderFooter: true,
					googleAnalytics: true,
					githubRibbon: true,
					fixedToolbar: true
				}
			}],

			configUrl = {
				themeHeaderFooter: {
					firstScreen: true,
					url: 'https://gyx8899.github.io/YX-WebThemeKit/theme-header-footer/headerFooter.min.js'
				},
				googleAnalytics: {
					url: 'https://gyx8899.github.io/YX-WebThemeKit/fn-google-analytics/googleAnalytics.min.js'
				},
				githubRibbon: {
					url: 'https://gyx8899.github.io/YX-WebThemeKit/theme-github-ribbon/githubRibbon.min.js'
				},
				fixedToolbar: {
					url: 'https://gyx8899.github.io/YX-WebThemeKit/theme-fixed-toolbar/fixedToolbar.min.js'
				},
				previewCode: {
					url: 'https://gyx8899.github.io/YX-WebThemeKit/fn-preview-code/previewCode.min.js'
				},
				qUnit: {
					url: 'https://gyx8899.github.io/YX-WebThemeKit/fn-qunit/qunit.min.js'
				},
				disqus: {
					url: 'https://gyx8899.github.io/YX-WebThemeKit/fn-disqus/disqus.min.js'
				}
			},

			sitePathName = document.location.pathname,
			siteConfig = YX_SITE_CONFIG.filter(function (site) {
				return site.pathNameRoot.toLowerCase() === sitePathName.split('/')[1].toLowerCase();
			})[0];

	initSiteParams();

	loadDev();

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
			global.addEventListener('load', function () {
				navigator.serviceWorker.register(global.location.origin + '/' + siteConfig.pathNameRoot + '/service-worker.js', {scope: '/' + siteConfig.pathNameRoot + '/'})
						.then(function (registration) {
							// Registration successful
							console.log('ServiceWorker registration successful with scope: ', registration.scope);
						})
						.catch(function (err) {
							// Registration failed
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
				loadScript(configUrl[config].url, null, null, {isAsync: !isFirstScreen});
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
			}, null, {isAsync: true});
		}
	}

	/***
	 * Load QUnit when url has param '&qunit=true
	 */
	function loadQUnit()
	{
		if (getQueryParamValue('qunit') === 'true')
		{
			loadScript(configUrl['qUnit'].url, null, null, {isAsync: true});
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

	function loadDisqus()
	{
		if (isZHLanguage())
		{
			// TODO: discuss plugin in China
		}
		else
		{
			loadScript(configUrl['disqus'].url, null, null, {isAsync: true});
		}
	}

	/***
	 * Load config components after dom ready
	 */
	function loadConfigWhenLoaded()
	{
		siteConfig && loadConfigs(siteConfig.config, false);
		loadPreviewCode();
		loadQUnit();
		loadDisqus();
	}

	global.siteConfig = siteConfig;
})(window);