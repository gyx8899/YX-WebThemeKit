/**
 * Site Config v1.0.1.180407_beta
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
	let YX_SITE_CONFIG = [{
				name: 'YX-JS-ToolKit',
				pathNameRoot: 'YX-JS-ToolKit',
				config: {
					headerFooter: true,
					googleAnalytics: true,
					githubRibbon: true,
					fixedToolbar: true
				}
			}, {
				name: 'YX-WebThemeKit',
				pathNameRoot: 'YX-WebThemeKit',
				config: {
					headerFooter: true,
					googleAnalytics: true,
					githubRibbon: true,
					fixedToolbar: true
				}
			}, {
				name: 'YX-CSS-ToolKit',
				pathNameRoot: 'YX-CSS-ToolKit',
				config: {
					headerFooter: true,
					googleAnalytics: true,
					githubRibbon: true,
					fixedToolbar: true
				}
			}, {
				name: 'Others',
				pathNameRoot: '',
				config: {
					headerFooter: true,
					googleAnalytics: false,
					githubRibbon: false,
					fixedToolbar: true
				}
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
			})[0] || YX_SITE_CONFIG[YX_SITE_CONFIG.length - 1];

	siteConfig.queryParams = YX.Util.url.getUrlQueryParams();

	handleParameters();

	enableServiceWorker();

	window.addEventListener("load", loadConfigWhenLoaded, false);

	siteConfig && loadConfigs(siteConfig.config, true);

	/**
	 * Enable PWA server worker when it is available
	 */
	function enableServiceWorker()
	{
		if ('serviceWorker' in navigator)
		{
			window.addEventListener('load', function () {
				navigator.serviceWorker.register(this.location.origin + '/' + siteConfig.pathNameRoot + '/service-worker.js', {scope: '/' + siteConfig.pathNameRoot + '/'})
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
				YX.Util.load.loadScript(configUrl[config].url, null, null, {isAsync: !isFirstScreen});
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
			YX.Util.load.loadScript(configUrl['previewCode'].url, function () {
				return new PreviewCode();
			}, null, {isAsync: true});
		}
	}

	/***
	 * Load QUnit when url has param '&qunit=true
	 */
	function loadQUnit()
	{
		if (siteConfig.queryParams['qunit'] === 'true')
		{
			YX.Util.load.loadScript(configUrl['qUnit'].url, null, null, {isAsync: true});
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
	 * Load comment component
	 */
	function loadDisqus()
	{
		if (YX.Util.navigator.isZHLanguage())
		{
			// TODO: discuss plugin in China
		}
		else
		{
			YX.Util.load.loadScript(configUrl['disqus'].url, null, null, {isAsync: true});
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