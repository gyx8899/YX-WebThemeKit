/**!
 * siteConfig v1.2.4.180805_beta | https://github.com/gyx8899/YX-WebThemeKit/tree/master/assets/js
 * Copyright (c) 2018 Kate Kuo @Steper
 */
(function (YX) {
	const COMMON_CONFIG_PATH = 'https://gyx8899.github.io/YX-WebThemeKit/'
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
					url: COMMON_CONFIG_PATH + 'theme-header-footer/headerFooter.min.js'
				},
				googleAnalytics: {
					url: COMMON_CONFIG_PATH + 'fn-google-analytics/googleAnalytics.min.js'
				},
				githubRibbon: {
					url: COMMON_CONFIG_PATH + 'theme-github-ribbon/githubRibbon.min.js'
				},
				fixedToolbar: {
					url: COMMON_CONFIG_PATH + 'theme-fixed-toolbar/fixedToolbar.min.js'
				},
				previewCode: {
					url: COMMON_CONFIG_PATH + 'fn-preview-code/previewCode.min.js?init=auto',
					condition: () => document.querySelectorAll('[data-toggle="previewCode"]').length
				},
				qUnit: {
					url: COMMON_CONFIG_PATH + 'fn-qunit/qunit.min.js',
					condition: () => siteConfig.queryParams['qunit'] !== undefined
				},
				disqus: {
					url: COMMON_CONFIG_PATH + 'fn-disqus/disqus.min.js',
					condition: () => !YX.Util.navigator.isZHLanguage()
				},
				serviceWorker: {
					// url: COMMON_CONFIG_PATH + 'assets/js/sw-register.js?v=' + Date.now(),
					url: COMMON_CONFIG_PATH + 'assets/js/sw-register.js?v=',
					condition: () => ('serviceWorker' in navigator)
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
					isInSameScreen = () => (isFirstScreen && configUrl[config].firstScreen) || (!isFirstScreen && !configUrl[config].firstScreen),
					isNoCondition = () => !configUrl[config].condition,
					isMatchCondition = () => configUrl[config].condition();
			if (isConfigTrue && isInSameScreen() && (isNoCondition() || isMatchCondition()))
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
		let siteConfigParams = siteConfig.queryParams;
		if (siteConfigParams['env'] === 'dev'
				|| (siteConfig.name === 'YX-WebThemeKit' && siteConfigParams['_ijt'] !== ''))
		{
			// Intellij IDEA
			let replacedPath = 'https://gyx8899.github.io/',
					newPath = '../../../';
			if ((location.hostname === '127.0.0.1' || location.hostname === 'localhost') && !siteConfigParams['_ijt'])
			{
				replacedPath += 'YX-WebThemeKit';
				newPath = location.origin;
				siteConfig.customConfig.headerFooter = true;
				siteConfig.customConfig.serviceWorker = true;
			}
			Object.keys(configUrl).forEach(function (key) {
				if (configUrl[key].url)
				{
					configUrl[key].url = configUrl[key].url.replace(replacedPath, newPath).replace('.min.js', '.js');
					if (siteConfigParams['min'] === 'false')
					{
						configUrl[key].url = configUrl[key].url.replace('.min.js', '.js')
					}
				}
			});
		}

		document.onreadystatechange = () => {
			if (document.readyState === 'interactive')
			{
				// Note: Use double quotes, not single quotes;
				// Handle ?assign=true&aaa=123&bbb="234"&ccc=true&ddd=["a", 2, true]&&eee={"ab": true}
				let isAssignEnabled = siteConfigParams['assign'];
				if (isAssignEnabled === 'true')
				{
					let params = siteConfigParams;
					for (let key in params)
					{
						if (window[key] !== undefined && params.hasOwnProperty(key))
						{
							window[key] = JSON.parse(params[key]);
						}
					}
				}

				// Note: Use double quotes, not single quotes;
				// Handle ?apply=initState(1, "abc", {"a": true})
				let paramsApply = siteConfigParams['apply'];
				if (paramsApply !== undefined)
				{
					let funcName = paramsApply.split('(')[0],
							params = JSON.parse('[' + paramsApply.substring(funcName.length + 1, paramsApply.length - 1) + ']');
					window[funcName](...params);
				}
			}
		};

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

		// Handle site config parameters
		if (siteConfigParams['config'])
		{
			siteConfigParams['config'].split(',').forEach(themeName => {
				siteConfig.customConfig[themeName] = true;
			})
		}
		if (siteConfigParams['ignore'])
		{
			siteConfigParams['ignore'].split(',').forEach(themeName => {
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