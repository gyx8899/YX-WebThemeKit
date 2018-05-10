/**
 * Site Config v1.0.2.180508_beta
 */
(function (root, factory) {
	if (typeof define === 'function' && define.amd)
	{
		define(['yx'], factory);
		// define(['jquery', 'underscore'], factory);
	}
	else if (typeof module === 'object' && module.exports)
	{
		module.exports = factory(require('yx'));
		// module.exports = factory(require('jquery'), require('underscore'));
	}
	else
	{
		root.siteConfig = factory(root.YX);
		// root.SiteConfig = factory(root.jQuery, root._);
	}
}(window, function (YX) {
	let DEFAULT_CONFIG = {
				headerFooter: true,
				googleAnalytics: true,
				githubRibbon: true,
				fixedToolbar: true,
				previewCode: true,
				qUnit: true,
				disqus: true
			},
			YX_SITE_CONFIG = [{
				name: 'YX-JS-ToolKit',
				pathNameRoot: 'YX-JS-ToolKit',
				customConfig: {},
			}, {
				name: 'YX-WebThemeKit',
				pathNameRoot: 'YX-WebThemeKit',
				customConfig: {},
			}, {
				name: 'YX-CSS-ToolKit',
				pathNameRoot: 'YX-CSS-ToolKit',
				customConfig: {},
			}, {
				name: 'Others',
				pathNameRoot: '',
				customConfig: {},
			}],
			configUrl = {
				headerFooter: {
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
					url: 'https://gyx8899.github.io/YX-WebThemeKit/fn-preview-code/previewCode.min.js?init=auto',
					condition: () => document.querySelectorAll('[data-toggle="previewCode"]').length
				},
				qUnit: {
					url: 'https://gyx8899.github.io/YX-WebThemeKit/fn-qunit/qunit.min.js',
					condition: () => siteConfig.queryParams['qunit'] === 'true'
				},
				disqus: {
					url: 'https://gyx8899.github.io/YX-WebThemeKit/fn-disqus/disqus.min.js',
					condition: () => !YX.Util.navigator.isZHLanguage()
				}
			},

			sitePathName = document.location.pathname,
			siteConfig = YX_SITE_CONFIG.filter(function (site) {
				return site.pathNameRoot.toLowerCase() === sitePathName.split('/')[1].toLowerCase();
			})[0] || YX_SITE_CONFIG[YX_SITE_CONFIG.length - 1];

	siteConfig.queryParams = YX.Util.url.getUrlQueryParams();

	handleParameters();

	enableServiceWorker();

	window.addEventListener("load", () => siteConfig && loadConfigs(siteConfig, false), false);

	siteConfig && loadConfigs(siteConfig, true);

	/**
	 * Enable PWA server worker when it is available
	 */
	function enableServiceWorker()
	{
		if ('serviceWorker' in navigator)
		{
			window.addEventListener('load', function () {
				let pathNameRoot = siteConfig.pathNameRoot ? siteConfig.pathNameRoot + '/' : '',
						swPath = this.location.origin + '/' + pathNameRoot + 'service-worker.js',
						swScope = '/' + pathNameRoot;
				navigator.serviceWorker.register(swPath, {scope: swScope})
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
		for (let config in DEFAULT_CONFIG)
		{
			if (((configInfo.customConfig && configInfo.customConfig.hasOwnProperty(config)) ? configInfo.customConfig[config] : DEFAULT_CONFIG[config]) &&
					((isFirstScreen && configUrl[config].firstScreen) || (!isFirstScreen && !configUrl[config].firstScreen)) &&
					(!configUrl[config].condition || configUrl[config].condition()))
			{
				YX.Util.load.loadScript(configUrl[config].url, null, null, {isAsync: !isFirstScreen});
			}
		}
	}

	/**
	 * Load Dev resource when url has param '&env=dev'
	 */
	function handleParameters()
	{
		// Handle page parameters
		if (siteConfig.name === 'YX-WebThemeKit' &&
				(siteConfig.queryParams['env'] === 'dev' || siteConfig.queryParams['_ijt'] !== ''))
		{
			Object.keys(configUrl).forEach(function (key) {
				configUrl[key].url = configUrl[key].url.replace('https://gyx8899.github.io/', '../../../');
			});
		}

		// Handle theme config parameters
		let themeConfigParams = YX.Util.url.getUrlQueryParams(getScriptName());
		if (themeConfigParams['ignore'])
		{
			themeConfigParams['ignore'].split(',').forEach(themeName => {
				configUrl[themeName].url = '';
			})
		}
	}

	/**
	 * getScriptName
	 * @return {*}
	 */
	function getScriptName()
	{
		let error = new Error()
				, source
				, lastStackFrameRegex = new RegExp(/.+\/(.*?):\d+(:\d+)*$/)
				, currentStackFrameRegex = new RegExp(/getScriptName \(.+\/(.*):\d+:\d+\)/);

		if (error.stack && (source = lastStackFrameRegex.exec(error.stack.trim())) && (source.length > 1 && source[1] !== ""))
			return source[1];
		else if (error.stack && (source = currentStackFrameRegex.exec(error.stack.trim())))
			return source[1];
		else if (error['fileName'] !== undefined)
			return error['fileName'];
	}

	return siteConfig;
}));