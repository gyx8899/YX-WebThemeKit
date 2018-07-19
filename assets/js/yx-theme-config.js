/**!
 * siteConfig v1.1.0.180718_beta
 */
(function (YX) {
	let DEFAULT_CONFIG = {
				headerFooter: true,
				googleAnalytics: true,
				githubRibbon: true,
				fixedToolbar: true,
				previewCode: true,
				qUnit: true,
				disqus: true,
				serviceWorker: true
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
				customConfig: {
					serviceWorker: false
				},
			}, {
				name: 'Others',
				pathNameRoot: '',
				customConfig: {
					headerFooter: false,
					googleAnalytics: false,
					githubRibbon: false,
					serviceWorker: false
				},
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
					condition: () => siteConfig.queryParams['qunit'] !== undefined
				},
				disqus: {
					url: 'https://gyx8899.github.io/YX-WebThemeKit/fn-disqus/disqus.min.js',
					condition: () => !YX.Util.navigator.isZHLanguage()
				},
				serviceWorker: {
					condition: () => enableServiceWorker()
				}
			},

			sitePathName = document.location.pathname,
			siteConfig = YX_SITE_CONFIG.filter(function (site) {
				return site.pathNameRoot.toLowerCase() === sitePathName.split('/')[1].toLowerCase();
			})[0] || YX_SITE_CONFIG[YX_SITE_CONFIG.length - 1];

	siteConfig.queryParams = YX.Util.url.getUrlQueryParams();

	handleParameters();

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
			let isConfigTrue = (configInfo.customConfig && configInfo.customConfig.hasOwnProperty(config)) ? configInfo.customConfig[config] : DEFAULT_CONFIG[config],
					isInSameScreen = (isFirstScreen && configUrl[config].firstScreen) || (!isFirstScreen && !configUrl[config].firstScreen),
					isNoCondition = !configUrl[config].condition,
					isMatchCondition = !isNoCondition && configUrl[config].condition();
			if (isConfigTrue && isInSameScreen && (isNoCondition || isMatchCondition))
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
		if (siteConfig.queryParams['env'] === 'dev'
				|| (siteConfig.name === 'YX-WebThemeKit' && siteConfig.queryParams['_ijt'] !== ''))
		{
			// Intellij IDEA
			let replacedPath = 'https://gyx8899.github.io/',
					newPath = '../../../';
			if ((location.hostname === '127.0.0.1' || location.hostname === 'localhost') && !siteConfig.queryParams['_ijt'])
			{
				replacedPath += 'YX-WebThemeKit';
				newPath = location.origin;
				siteConfig.customConfig.headerFooter = true;
			}
			Object.keys(configUrl).forEach(function (key) {
				if (configUrl[key].url)
				{
					configUrl[key].url = configUrl[key].url.replace(replacedPath, newPath).replace('.min.js', '.js');
					if (siteConfig.queryParams['min'] === 'false')
					{
						configUrl[key].url = configUrl[key].url.replace('.min.js', '.js')
					}
				}
			});
		}

		// Note: Use double quotes, not single quotes;
		// Handle ?assign=true&aaa=123&bbb="234"&ccc=true&ddd=["a", 2, true]&&eee={"ab": true}
		let isAssignEnabled = siteConfig.queryParams['assign'];
		if (isAssignEnabled === 'true')
		{
			document.onreadystatechange = function () {
				if (document.readyState === 'interactive')
				{
					let params = siteConfig.queryParams;
					for (let key in params)
					{
						if (window[key] !== undefined && params.hasOwnProperty(key))
						{
							window[key] = JSON.parse(decodeURIComponent(params[key]));
						}
					}
				}
			};
		}

		// Note: Use double quotes, not single quotes;
		// Handle ?apply=initState(1, "abc", {"a": true})
		let paramsApply = siteConfig.queryParams['apply'];
		if (paramsApply !== undefined)
		{
			paramsApply = decodeURIComponent(paramsApply);
			let funcName = paramsApply.split('(')[0],
					params = JSON.parse('[' + paramsApply.substring(funcName.length + 1, paramsApply.length - 1) + ']');
			window.addEventListener('load', () => {
				window[funcName](...params);
			});
		}

		// Handle theme config parameters
		let themeConfigParams = YX.Util.url.getUrlQueryParams(getScriptName());
		if (themeConfigParams['config'])
		{
			themeConfigParams['config'].split(',').forEach(themeName => {
				siteConfig.customConfig[themeName] = true;
			})
		}
		if (themeConfigParams['ignore'])
		{
			themeConfigParams['ignore'].split(',').forEach(themeName => {
				siteConfig.customConfig[themeName] = false;
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

	window.siteConfig = siteConfig;

	// Compatible with webpack
	if (typeof exports === 'object' && typeof module === 'object')
	{
		module.exports = siteConfig;
	}
})(window.YX);