/**!
 * YX Common Library v1.1.2.180720_beta
 */
(function () {
	let YX = {};

	/********************************************************************************************************************/
	/**
	 * Util
	 * @type {{}}
	 */
	YX.Util = {};

	/**
	 * Util.array
	 * @type {{}}
	 */
	YX.Util.array = {};

	/***
	 * uniqueArray
	 * @param {Array} sourceArray
	 * @returns {Array}
	 */
	function uniqueArray(sourceArray)
	{
		return [...new Set(sourceArray)];
	}

	YX.Util.array.uniqueArray = uniqueArray;

	/**
	 * Get array item string which spilt with ',';
	 * @param array
	 * @returns {string}
	 */
	function getArrayString(array)
	{
		return array.map(function (arrayItem) {
			if (Array.isArray(arrayItem))
			{
				arrayItem = '[' + getArrayString(arrayItem) + ']';
			}
			else if (typeof arrayItem === 'object')
			{
				arrayItem = JSON.stringify(arrayItem);
			}
			return arrayItem.toString();
		}).join(',');
	}

	YX.Util.array.getArrayString = getArrayString;

	/********************************************************************************************************************/
	/**
	 * Util.string
	 * @type {{}}
	 */
	YX.Util.string = {};

	/**
	 * Capitalize the first word
	 * @param string
	 * @return {string}
	 */
	function titleCase(string)
	{
		return string.charAt(0).toUpperCase() + string.slice(1);
	}

	YX.Util.string.titleCase = titleCase;

	/***
	 * escapeHTML
	 * @param {string} str
	 * @returns {void|string}
	 */
	function escapeHTML(str)
	{
		let map = {
			'&': '&amp;',
			'<': '&lt;',
			'>': '&gt;',
			'"': '&quot;',
			"'": '&#039;'
		};

		return str.replace(/[&<>"']/g, function (m) {
			return map[m];
		});
	}

	YX.Util.string.escapeHTML = escapeHTML;

	/**
	 * Escape string for js parameter
	 * @param str
	 * @return {*}
	 */
	function escapeJS(str)
	{
		return escapeHTML(str.replace(/[\\]/g, '\\\\').replace(/["]/g, '\\\"').replace(/[']/g, "\\\'"));
	}

	YX.Util.string.escapeJS = escapeJS;

	/********************************************************************************************************************/
	/**
	 * Util.navigator
	 * @type {{}}
	 */
	YX.Util.navigator = {};

	/**
	 * Check browser language setting which has zh[-CN/TW/HK]
	 * @return {boolean}
	 */
	function isZHLanguage()
	{
		let browserLanguage = window.navigator.languages ? window.navigator.languages : window.navigator.browserLanguage;
		return browserLanguage.some(language => {
			return language.indexOf('zh') === 0;
		});
	}

	YX.Util.navigator.isZHLanguage = isZHLanguage;

	/********************************************************************************************************************/
	/**
	 * Util.url
	 * @type {{}}
	 */
	YX.Util.url = {};

	/***
	 * getFileNameFromURL
	 * @param {string} url
	 * @returns {object} {name: '', simpleBaseName: '', extensionName: '', baseName: ''}
	 */
	function getFileNameFromURL(url)
	{
		let fileNameSplit = url.split('/').pop().split('#')[0].split('?')[0].split('.');
		return {
			name: fileNameSplit.join('.'),
			simpleBaseName: fileNameSplit[0],
			extensionName: fileNameSplit.length > 1 ? fileNameSplit[fileNameSplit.length - 1] : '',
			baseName: fileNameSplit.length > 1 ? fileNameSplit.splice(0, fileNameSplit.length - 1).join('.') : fileNameSplit[0],
		};
	}

	YX.Util.url.getFileNameFromURL = getFileNameFromURL;

	/***
	 * getUrlQueryParams
	 * @param {string} url
	 * @returns {object}
	 */
	function getUrlQueryParams(url)
	{
		let query = {},
				searchStr = url ? (url.indexOf('?') !== -1 ? url.split('?')[1] : '') : window.location.search.substring(1),
				queryParams = searchStr.split("&");
		for (let i = 0; i < queryParams.length; i++)
		{
			let queryParam = queryParams[i].split("=");
			if (queryParam.length > 1)
			{
				query[queryParam[0]] = decodeURIComponent(queryParam[1]);
			}
		}
		return query;
	}

	YX.Util.url.getUrlQueryParams = getUrlQueryParams;

	/***
	 * getQueryParamValue
	 * @param param
	 * @returns {*}
	 */
	function getQueryParamValue(param)
	{
		let query = window.location.search.substring(1);
		let queryParams = query.split("&");
		for (let i = 0; i < queryParams.length; i++)
		{
			let queryParam = queryParams[i].split("=");
			if (queryParam.length > 1 && queryParam[0] === param)
			{
				return decodeURIComponent(queryParam[1]);
			}
		}
		return false;
	}

	YX.Util.url.getQueryParamValue = getQueryParamValue;

	/***
	 * getUrlTypeInfo
	 * @param {string} url
	 * @returns {object}
	 */
	function getUrlTypeInfo(url)
	{
		// Current only support js and css resources;
		let fileExtensionName = getFileNameFromURL(url).extensionName;
		if (fileExtensionName)
		{
			let urlType = {
				'js': {
					name: 'js',
					tagName: 'script',
					urlAttrName: 'src',
					loadFn: 'loadScript',
					loadFnPromise: 'loadScriptWithPromise'
				},
				'css': {
					name: 'css',
					tagName: 'link',
					urlAttrName: 'href',
					loadFn: 'loadCSS',
					loadFnPromise: 'loadCSSWithPromise'
				}
			};
			return urlType[fileExtensionName];
		}
		return null;
	}

	YX.Util.url.getUrlTypeInfo = getUrlTypeInfo;

	/***
	 * getCurrentScript in Page
	 * @param {string} scriptName
	 * @returns {Element || null}
	 */
	function getCurrentScript(scriptName)
	{
		let allScripts = document.getElementsByTagName("script");

		if (scriptName)
		{
			for (let i = 0; i < allScripts.length; i++)
			{
				let script = allScripts.item(i);

				if (script.src && script.src.match(scriptName))
				{
					return script;
				}
			}
		}
		else
		{
			if (document.currentScript)
			{
				return document.currentScript;
			}
			else
			{
				return allScripts[allScripts.length - 1];
			}
		}
		return null;
	}

	YX.Util.url.getCurrentScript = getCurrentScript;

	/**
	 * getCurrentScriptParameter
	 * @return {Object}
	 */
	function getCurrentScriptParameter()
	{
		let currentScript = getCurrentScript();
		return currentScript ? getUrlQueryParams(currentScript.src) : {};
	}

	YX.Util.url.getCurrentScriptParameter = getCurrentScriptParameter;

	/***
	 * getCurrentScriptPath in Page
	 * @param {string} scriptName
	 * @returns {null|string}
	 */
	function getCurrentScriptPath(scriptName)
	{
		let script = getCurrentScript(scriptName);
		return script ? script.src : '';
	}

	YX.Util.url.getCurrentScriptPath = getCurrentScriptPath;

	/***
	 * getRootPath
	 * @returns {string}
	 */
	function getRootPath()
	{
		let href = window.document.location.href,
				pathName = window.document.location.pathname,
				localhostPath = href.substring(0, href.indexOf(pathName)),
				projectName = pathName.substring(0, pathName.substr(1).lastIndexOf('/') + 1);
		return (localhostPath + projectName);
	}

	YX.Util.url.getRootPath = getRootPath;

	/**
	 * getScriptName
	 * Not support in IE
	 * @return {*}
	 */
	function getScriptName()
	{
		let error = new Error()
				, source
				, lastStackFrameRegex = new RegExp(/.+\/(.*?):\d+(:\d+)*$/)
				, currentStackFrameRegex = new RegExp(/getScriptName \(.+\/(.*):\d+:\d+\)/);

		if ((source = lastStackFrameRegex.exec(error.stack.trim())) && source[1] != "")
			return source[1];
		else if ((source = currentStackFrameRegex.exec(error.stack.trim())))
			return source[1];
		else if (error['fileName'] !== undefined)
			return error['fileName'];
	}

	YX.Util.url.getScriptName = getScriptName;

	/**
	 * getCurrentScriptSrc
	 * @return {string}
	 */
	function getCurrentScriptSrc()
	{
		var scripts = document.getElementsByTagName("script");
		return (document.currentScript || scripts[scripts.length - 1]).src;
	}

	YX.Util.url.getCurrentScriptSrc = getCurrentScriptSrc;

	/**
	 * Check url is exist or not, callback with success state
	 * @param url
	 * @param callback
	 * @param context
	 */
	function isExist(url, callback, context)
	{
		let link = document.createElement("link"),
				isSuccess = true;

		link.onerror = function () {
			isSuccess = false;
			callback && (context ? context[callback]() : callback(isSuccess));
		};
		if (link.readyState)
		{  //IE
			link.onreadystatechange = function () {
				if (link.readyState === "loaded" || link.readyState === "complete")
				{
					link.onreadystatechange = null;
					setTimeout(function () {
						isSuccess && callback && (context ? context[callback]() : callback(isSuccess));
					}, 0);
				}
			};
		}
		else
		{  //Others
			link.onload = function () {
				callback && (context ? context[callback]() : callback(isSuccess));
			};
		}

		link.href = url;
		// TODO: type and rel should be accord to with checked file
		link.type = 'text/css';
		link.rel = 'stylesheet';

		document.querySelector('head').appendChild(link);
	}

	YX.Util.url.isExist = isExist;

	/********************************************************************************************************************/
	/**
	 * Util.load
	 * @type {{}}
	 */
	YX.Util.load = {};

	/***
	 * loadScript
	 * @param {(string)} url string of url
	 * @param {function} [callback] - callback() after script loaded
	 * @param {object} [context] - callback's context
	 * @param {object} info - {isAsync: [true/false], attributes: {}, libName: ""}
	 */
	function loadScript(url, callback, context, info)
	{
		if (!url)
			return;

		if (Array.isArray(url))
		{
			// Process the url and callback if they are array;
			parameterArrayToItem(function (urlParam, callbackParam) {
				loadScript(urlParam, callbackParam, context, info);
			}, url, callback);
		}
		else
		{
			let script = document.createElement("script"),
					isSuccess = true,
					libName = info && info['libName'] ? info['libName'] : getFileNameFromURL(url).name;
			script.type = "text/javascript";
			info && info['isAsync'] && script.setAttribute('async', '');

			if (info && info.attributes)
			{
				for (let attr in info.attributes)
				{
					if (info.attributes.hasOwnProperty(attr))
					{
						script.setAttribute(attr, info.attributes[attr]);
						attr === 'class' && script.setAttribute('className', info.attributes[attr]);
					}
				}
			}

			script.onerror = function () {
				isSuccess = false;
				callback && (context ? context[callback]() : callback(isSuccess));
			};
			if (script.readyState)
			{  //IE
				script.onreadystatechange = function () {
					if (script.readyState === "loaded" || script.readyState === "complete")
					{
						script.onreadystatechange = null;
						setTimeout(function () {
							isSuccess && callback && (context ? context[callback]() : callback(isSuccess));
						}, 0);
					}
				};
			}
			else
			{  //Others
				script.onload = function () {
					callback && (context ? context[callback]() : callback(isSuccess));
				};
			}

			script.src = url;

			document.body.appendChild(document.createComment(" Script " + libName + " *** JS "));
			document.body.appendChild(script);
		}
	}

	YX.Util.load.loadScript = loadScript;

	/***
	 * loadScript with Promise
	 * @param url
	 * @returns {Promise}
	 */
	function loadScriptWithPromise(url, type)
	{
		return new Promise(function (resolve, reject) {
			if (!url)
			{
				reject(new Error("url is null!"));
			}
			if (checkResourceLoaded(url))
			{
				resolve(true);
			}

			let script = document.createElement("script"),
					isSuccess = true;
			script.type = type ? type : "text/javascript";

			script.onerror = function () {
				isSuccess = false;
				reject();
			};
			if (script.readyState)
			{  //IE
				script.onreadystatechange = function () {
					if (script.readyState === "loaded" || script.readyState === "complete")
					{
						script.onreadystatechange = null;
						setTimeout(function () {
							resolve(true);
						}, 0);
					}
				};
			}
			else
			{  //Others
				script.onload = function () {
					resolve(true);
				};
			}

			script.src = url;

			document.body.appendChild(document.createComment(" Script " + getFileNameFromURL(url).name + " *** JS "));
			document.body.appendChild(script);
		});
	}

	YX.Util.load.loadScriptWithPromise = loadScriptWithPromise;

	/***
	 * loadCSS
	 * @param {(string|string[])} url string or an array of urls
	 * @param {function} [callback] - callback() after script loaded
	 * @param {object} [context] - callback's context
	 */
	function loadCSS(url, callback, context)
	{
		if (!url)
			return;

		if (Array.isArray(url))
		{
			// Process the url and callback if they are array;
			parameterArrayToItem(function (urlParam, callbackParam) {
				loadCSS(urlParam, callbackParam);
			}, url, callback);
		}
		else
		{
			let link = document.createElement('link');
			link.rel = 'stylesheet';
			link.type = 'text/css';
			link.href = url;
			link.onload = function () {
				callback && (context ? context[callback]() : callback());
			};
			link.onerror = function () {
				console.log("Error load css:" + url);
			};

			document.getElementsByTagName('head')[0].appendChild(document.createComment(" Style " + getFileNameFromURL(url).name + " *** CSS "));
			document.getElementsByTagName('head')[0].appendChild(link);
		}
	}

	YX.Util.load.loadCSS = loadCSS;

	/***
	 * loadCSS with Promise
	 * @param url
	 * @returns {Promise}
	 */
	function loadCSSWithPromise(url)
	{
		return new Promise(function (resolve, reject) {
			if (!url)
			{
				reject(new Error("url is null!"));
			}
			if (checkResourceLoaded(url))
			{
				resolve(true);
			}

			let link = document.createElement('link');
			link.rel = 'stylesheet';
			link.type = 'text/css';
			link.href = url;
			link.onload = function () {
				resolve(true);
			};
			link.onerror = function (error) {
				reject(new Error(error));
			};

			document.getElementsByTagName('head')[0].appendChild(document.createComment(" Style " + getFileNameFromURL(url).name + " *** CSS "));
			document.getElementsByTagName('head')[0].appendChild(link);
		});
	}

	YX.Util.load.loadCSSWithPromise = loadCSSWithPromise;

	/***
	 * Load resource: support url types - js, css
	 * @param {string} url
	 * @param {function} [callback] - callback() after resource loaded
	 */
	function loadResource(url, callback)
	{
		if (!checkResourceLoaded(url))
		{
			YX.Util.load[getUrlTypeInfo(url).loadFn](url, callback);
		}
		else
		{
			callback && callback();
		}
	}

	YX.Util.load.loadResource = loadResource;

	/***
	 * loadResources: support url, js, css
	 * @param {string[]} urls - an array of urls
	 * @param {function} [callback] - callback() after url loaded
	 */
	function loadResources(urls, callback)
	{
		if (urls !== null && urls !== '')
		{
			if (Array.isArray(urls))
			{
				urls = urls.filter(function (url) {
					return (String(url) === url && url !== '');
				});
				if (urls.length === 0)
				{
					callback && callback();
				}
				else if (urls.length === 1)
				{
					loadResource(urls[0], callback);
				}
				else
				{
					if (callback)
					{
						loadUrls(urls, callback);
					}
					else
					{
						urls.map(function (url) {
							loadResource(url);
						})
					}
				}
			}
			else if (String(urls) === urls)
			{
				loadResource(urls, callback);
			}
		}
		else
		{
			callback && callback();
		}
	}

	YX.Util.load.loadResources = loadResources;

	/***
	 * checkResourceLoaded
	 * @param {string} url
	 * @returns {boolean}
	 */
	function checkResourceLoaded(url)
	{
		let type = getUrlTypeInfo(url),
				typeSelector = type['tagName'] || '[src]',
				allUrls = Array.prototype.slice.call(document.querySelectorAll(typeSelector))
						.map(function (scriptElement) {
							return scriptElement[type['urlAttrName']];
						});
		return allUrls.indexOf(url) !== -1;
	}

	YX.Util.load.checkResourceLoaded = checkResourceLoaded;

	/***
	 * loadUrls with Promise if it is supported
	 * @param {string[]} urls - an array of urls
	 * @param {function} [callback] - callback() after url loaded
	 */
	function loadUrls(urls, callback)
	{
		let unLoadedResourcesInfo = urls.filter(function (url) {
			return !checkResourceLoaded(url);
		}).map(function (resource) {
			let resourceInfo = getUrlTypeInfo(resource);
			resourceInfo.url = resource;
			return resourceInfo;
		});
		// If support Promise, use Promise
		if (typeof Promise !== "undefined" && Promise.toString().indexOf("[native code]") !== -1)
		{
			let resourcePromise = unLoadedResourcesInfo.map(function (resourceInfo) {
				return YX.Util.load[resourceInfo.loadFnPromise](resourceInfo.url);
			});
			Promise.all(resourcePromise).then(function () {
				callback && callback();
			}).catch(function (error) {
				console.log("Error: in load resources! " + error);
			});
		}
		else
		{
			unLoadedResourcesInfo.forEach(function (resourceInfo) {
				YX.Util.load[resourceInfo.loadFn](resourceInfo.url);
			});
			callback && callback();
		}
	}

	YX.Util.load.loadUrls = loadUrls;

	/***
	 * Use XDomainRequest when browser <= IE9, otherwise use XMLHttpRequest(not support < IE9);
	 * @param {string} url
	 * @param {function} callback
	 * @param {object} context: callback's context
	 */
	function getFileContent(url, callback, context)
	{
		if (document.documentMode <= 9 && window.XDomainRequest)
		{
			xdrGetRequest(url, callback, context)
		}
		else
		{
			xmlHTTPGetRequest(url, callback, context);
		}

		/***
		 * xdrGetRequest: send get request in IE <= 9
		 * @param {string} url
		 * @param {function} callback
		 * @param {object} context: callback's context
		 *
		 * XDomainRequest is an implementation of HTTP access control (CORS) that worked in Internet Explorer 8 and 9.
		 * It was removed in Internet Explorer 10 in favor of using XMLHttpRequest with proper CORS;
		 * https://developer.mozilla.org/zh-CN/docs/Web/API/XDomainRequest
		 */
		function xdrGetRequest(url, callback, context)
		{
			let xdr = new XDomainRequest();
			if (xdr)
			{
				xdr.onload = function () {
					callback && (context ? context[callback](xdr.responseText) : callback(xdr.responseText));
				};
				xdr.onerror = function () {
					/* error handling here */
				};
				xdr.open('GET', url);
				xdr.send();
			}
		}

		/***
		 * XMLHttpRequest: send get request in IE >= 10, or other browsers
		 * @param {string} url
		 * @param {function} callback
		 * @param {object} context: callback's context
		 */
		function xmlHTTPGetRequest(url, callback, context)
		{
			let request = new XMLHttpRequest();
			request.open('GET', url, true);
			request.onload = function () {
				if (request.status >= 200 && request.status < 400)
				{
					// Success
					callback && (context ? context[callback](request.responseText) : callback(request.responseText));
				}
				else
				{
					// We reached our target server, but it returned an error
				}
			};
			request.onerror = function () {
				// There was a connection error of some sort
			};
			request.send();
		}
	}

	YX.Util.load.getFileContent = getFileContent;

	/***
	 * Ajax request: dependency jQuery
	 * @param {string} url
	 * @param {function} callback
	 * @param {object} context: callback's context
	 */
	function getFileContentWithAjax(url, callback, context)
	{
		$.ajax({
			url: url,
			success: function (data) {
				callback && (context ? context[callback](data) : callback(data));
			}
		});
	}

	YX.Util.load.getFileContentWithAjax = getFileContentWithAjax;

	/********************************************************************************************************************/

	YX.Util.tool = {};

	/**
	 * Throttle, specially in onResize event function;
	 * @param method
	 * @param context
	 * @param {number} [timeout]
	 */
	function throttle(method, context, timeout)
	{
		timeout = (timeout || timeout === 0) ? timeout : 100;
		if (method.tId)
		{
			clearTimeout(method.tId);
		}
		method.tId = setTimeout(function () {
			method.call(context);
		}, timeout);
	}

	YX.Util.tool.throttle = throttle;

	/**
	 * Custom console log modal in function
	 * @param fnArguments
	 */
	function consoleLog(fnArguments)
	{
		let typeStyle = [
			'font-size: 14px; color: #8665D5',
			'font-size: 14px; color: #406AD5',
			'font-size: 14px; color: #E9AC32',
			'font-size: 14px; color: #3AC1D9',
			'font-size: 14px; color: #FF7979',
			'font-size: 14px; color: #39D084',
			'font-size: 14px; color: #FF8E66',
			'font-size: 14px; color: #44B1E6',
			'font-size: 14px; color: #9e5648',
			'font-size: 14px; color: #406ad5',
			'font-size: 14px; color: #purple',
			'font-size: 14px; color: #red',
			'font-size: 14px; color: #teal',
			'font-size: 14px; color: #yellow'
		];
		if (!window.consoleLogTypes)
		{
			window.consoleLogTypes = {};
		}
		if (window.console && window.debug !== false)
		{
			let fnName = fnArguments.callee ? fnArguments.callee.name : '',
					fnArgumentsArray = Array.prototype.slice.call(fnArguments, 0),
					fnArgumentsString = getArrayString(fnArgumentsArray),
					argumentsArray = Array.prototype.slice.call(arguments, 0),
					surplusArgumentString = argumentsArray.length > 1 && argumentsArray.shift() && getArrayString(argumentsArray);
			if (!window.consoleLogTypes[fnName])
			{
				window.consoleLogTypes[fnName] = {
					typeCount: 0,
					typeInfo: {}
				};
			}
			if (!window.consoleLogTypes[fnName].typeInfo[argumentsArray[0]])
			{
				window.consoleLogTypes[fnName].typeInfo[argumentsArray[0]] = typeStyle[window.consoleLogTypes[fnName].typeCount];
				window.consoleLogTypes[fnName].typeCount++;
			}
			if (window.consoleLogTypes.lastType !== fnName)
			{
				window.console.groupEnd();
				window.console.group(fnName);
				window.consoleLogTypes.lastType = fnName;
			}
			window.console.log('%c%s', window.consoleLogTypes[fnName].typeInfo[argumentsArray[0]], fnName + ': (' + fnArgumentsString + ') ' + surplusArgumentString);
		}
	}

	YX.Util.tool.consoleLog = consoleLog;

	/**
	 * Dynamic set callback function in window
	 * @param typeName
	 * @returns {*}
	 */
	function setCallback(typeName)
	{
		let typeCallback = getCallbackName(typeName);
		if (!window[typeCallback])
		{
			window[typeCallback] = function (data) {
				window[typeName] = data;
			};
			return typeCallback;
		}
		return null;
	}

	YX.Util.tool.setCallback = setCallback;

	/**
	 * getCallbackName
	 * @param typeName
	 * @returns {string}
	 */
	function getCallbackName(typeName)
	{
		return typeName + "Callback";
	}

	YX.Util.tool.getCallbackName = getCallbackName;

	/**
	 * deepExtend - deep copy with out jQuery
	 * @param out
	 * @returns {*|{}}
	 */
	function deepExtend(out) // arguments: (source, source1, source2, ...)
	{
		out = out || {};

		for (let i = 1; i < arguments.length; i++)
		{
			let obj = arguments[i];

			if (!obj)
				continue;

			for (let key in obj)
			{
				if (obj.hasOwnProperty(key))
				{
					if (typeof obj[key] === 'object'
							&& obj[key] !== null
							&& !Array.isArray(obj[key])
							&& !(obj[key] instanceof Date)
							&& !(obj[key] === 'function'))
					{
						out[key] = deepExtend(out[key], obj[key]);
					}
					else
						out[key] = obj[key];
				}
			}
		}
		return out;
	}

	YX.Util.tool.deepExtend = deepExtend;

	/**
	 * Tools for processing function who has parameter array
	 * @param fn
	 * @param param1
	 * @param param2
	 */
	function parameterArrayToItem(fn, param1, param2)
	{
		let param2IsArray = Array.isArray(param2),
				param2ArrayLength = param2IsArray && param2.length || 0;
		for (let i = 0, length = param1.length; i < length; i++)
		{
			let param2Item = (param2IsArray && i < param2ArrayLength) ? param2[i] : null;
			fn && fn(param1[i], param2Item);
		}
	}

	YX.Util.tool.parameterArrayToItem = parameterArrayToItem;

	/********************************************************************************************************************/

	YX.Util.html = {};

	/**
	 * Initialize template with template/templateData and source data
	 * @param {string} template
	 * @param {object} templateData
	 * @param {object} [sourceData], for external data process from templateData function
	 * @returns {string}
	 */
	function initTemplate(template, templateData, sourceData)
	{
		let result = template;
		for (let key in templateData)
		{
			if (templateData.hasOwnProperty(key))
			{
				let dataValue = templateData[key];
				// Process source data to required data if the templateData key's value is function
				if (typeof templateData[key] === 'function')
				{
					dataValue = templateData[key](sourceData);
				}
				result = result.replace(new RegExp('{{' + key + '}}', "g"), dataValue);
			}
		}
		return result;
	}

	YX.Util.html.initTemplate = initTemplate;

	/**
	 * Render template with data and put it to target element
	 * @param targetElement
	 * @param template
	 * @param sourceData
	 * @param templateDataFn
	 * @param [position], values=[update,beforebegin,afterbegin,beforeend,afterend], default update
	 */
	function renderTemplate(targetElement, template, sourceData, templateDataFn, position)
	{
		let resultHtml = '';
		for (let i = 0; i < sourceData.length; i++)
		{
			resultHtml += initTemplate(template, templateDataFn(sourceData[i]), sourceData[i]);
		}
		if (!position || position === 'update')
		{
			targetElement.innerHTML = resultHtml;
		}
		else
		{
			targetElement.insertAdjacentHTML(position, resultHtml);
		}
	}

	YX.Util.html.renderTemplate = renderTemplate;

	/********************************************************************************************************************/

	YX.Util.regExp = {};

	/***
	 * regExpG
	 * @param expStr
	 * @returns {RegExp}
	 */
	function regExpG(expStr)
	{
		return new RegExp(expStr, "g");
	}

	YX.Util.regExp.regExpG = regExpG;

	/***
	 * isURL
	 * @param url
	 * @returns {boolean}
	 */
	function isURL(url)
	{
		let expression = /(((http|ftp|https):\/\/)?([\w\-_]+(\.(?!(\d)+)[\w\-_]+))+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?)|(\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*)/g;
		return (new RegExp(expression)).test(url);
	}

	YX.Util.regExp.isURL = isURL;

	/********************************************************************************************************************/

	YX.Util.element = {};

	/**
	 * getElements
	 * @param elements
	 * @returns {Array}
	 */
	function getElements(elements)
	{
		let resultElement = [];
		if (elements === undefined || elements === null)
		{
			resultElement = [];
		}
		else if (elements.jquery)
		{
			resultElement = elements.length > 1 ? elements.get() : [elements[0]];
		}
		else if (elements instanceof window.NodeList || elements instanceof NodeList || elements instanceof HTMLCollection)
		{
			resultElement = Array.prototype.slice.call(elements);
		}
		else if (Array.isArray(elements))
		{
			resultElement = elements.filter(function (element) {
				return element.nodeType === 1;
			});
		}
		else if (elements.nodeType === 1)
		{
			resultElement = [elements];
		}
		return resultElement;
	}

	YX.Util.element.getElements = getElements;

	/**
	 * getSelectorsElements
	 * @param selectorString
	 * @returns {*}
	 */
	function getSelectorsElements(selectorString)
	{
		if (!selectorString || (selectorString && selectorString.trim() === ''))
		{
			return [document];
		}
		let selectorsElements = [],
				selectorsArray = selectorString.split(',').map(function (selectorStringItem) {
					return selectorStringItem.trim();
				});
		selectorsArray = uniqueArray(selectorsArray);
		for (let i = 0, l = selectorsArray.length; i < l; i++)
		{
			if (selectorsArray[i] === 'document')
			{
				selectorsElements.push(document);
			}
			else
			{
				let scopeNodeList = convertNodeListToArray(document.querySelectorAll(selectorsArray[i]));
				selectorsElements = selectorsElements.concat(scopeNodeList);
			}
		}
		return selectorsElements;
	}

	YX.Util.element.getSelectorsElements = getSelectorsElements;

	/**
	 * findParent
	 * @param element
	 * @param selector
	 * @returns {*}
	 */
	function findParent(element, selector)
	{
		while ((element = element.parentElement) && !matches(element, selector))
		{
		}
		return element;
	}

	YX.Util.element.findParent = findParent;

	/**
	 * matches
	 * @param el
	 * @param selector
	 * @returns {boolean | *}
	 */
	function matches(el, selector)
	{
		return (el.matches || el.matchesSelector || el.msMatchesSelector || el.mozMatchesSelector || el.webkitMatchesSelector || el.oMatchesSelector).call(el, selector);
	}

	YX.Util.element.matches = matches;

	/***
	 * Get element's closet class parent element
	 * @param {element} element
	 * @param {string} className
	 * @returns {element}
	 */
	function closet(element, className)
	{
		let closetElement = null;
		if (hasClass(element, className))
		{
			closetElement = element;
		}
		else
		{
			closetElement = findParent(element, '.' + className);
		}
		return closetElement;
	}

	YX.Util.element.closet = closet;

	/***
	 * Check element has parentElement
	 * @param el
	 * @param parentElement
	 * @returns {boolean}
	 */
	function hasCloset(el, parentElement)
	{
		if (el === parentElement)
		{
			return true;
		}
		if (parentElement === undefined)
		{
			return false;
		}

		let parents = [], p = el.parentNode;
		while (p !== parentElement && p.parentNode)
		{
			let o = p;
			parents.push(o);
			p = o.parentNode;
		}
		return p === parentElement;
	}

	YX.Util.element.hasCloset = hasCloset;

	/***
	 * Convert JS selector elements to array
	 * @param {elements} nodeList
	 * @returns {Array}
	 */
	function convertNodeListToArray(nodeList)
	{
		let resultArray = [];
		for (let i = 0, l = nodeList.length; i < l; i++)
		{
			resultArray[i] = nodeList[i];
		}
		return resultArray;
	}

	YX.Util.element.convertNodeListToArray = convertNodeListToArray;

	/***
	 *
	 * Copy html element to clipboard
	 * @param {element} element - html element
	 */
	function copyElementToClipboard(element)
	{
		let selection = window.getSelection(),    // Save the selection.
				range = document.createRange(),
				isSuccess = false;
		range.selectNodeContents(element);
		selection.removeAllRanges();          // Remove all ranges from the selection.
		selection.addRange(range);            // Add the new range.

		isSuccess = document.execCommand('copy');
		window.getSelection().removeAllRanges();
		return isSuccess;
	}

	YX.Util.element.copyElementToClipboard = copyElementToClipboard;

	/**
	 * Insert style to head
	 * @param {string} cssText - style string
	 */
	function insertStyleToHead(cssText)
	{
		let head = document.head || document.getElementsByTagName('head')[0],
				style = document.createElement('style');

		style.type = 'text/css';
		if (style.styleSheet)
		{
			style.styleSheet.cssText = cssText;
		}
		else
		{
			style.appendChild(document.createTextNode(cssText));
		}

		head.appendChild(style);
	}

	YX.Util.element.insertStyleToHead = insertStyleToHead;

	/**
	 * Create one html tag element with tagInfo
	 * @param {string} tagName - html tag name
	 * @param {object} tagInfo - tag's attributes and style object, such as { attr: {}, style: {} }
	 * @return {element} html tag element.
	 */
	function createTagElement(tagName, tagInfo)
	{
		let tagElement = document.createElement(tagName);

		Object.keys(tagInfo.attr).forEach(function (key) {
			tagElement.setAttribute(key, tagInfo.attr[key]);
		});

		Object.keys(tagInfo.style).forEach(function (key) {
			tagElement.style[key] = tagInfo.style[key];
		});

		return tagElement;
	}

	YX.Util.element.createTagElement = createTagElement;

	/**
	 * addChildElement
	 * @param targetElement
	 * @param addedElement
	 * @param position
	 * @return resultAddedElement
	 */
	function addElement(targetElement, addedElement, position)
	{
		let resultAddedElement = null;
		switch (position && position.toLowerCase())
		{
			case 'replace':
				targetElement.innerHTML = '';
				resultAddedElement = targetElement.appendChild(addedElement);
				break;
			case 'prepend':
				resultAddedElement = targetElement.insertBefore(addedElement, targetElement.firstChild);
				break;
			case 'insertbefore':
				targetElement.insertAdjacentHTML('beforebegin', addedElement.outerHTML);
				resultAddedElement = targetElement.previousSibling;
				break;
			case 'insertafter':
				targetElement.insertAdjacentHTML('afterend', addedElement.outerHTML);
				resultAddedElement = targetElement.nextSibling;
				break;
			default: //'append'
				resultAddedElement = targetElement.appendChild(addedElement);
		}
		return resultAddedElement;
	}

	YX.Util.element.addElement = addElement;

	/**
	 * hasClass
	 * @param element
	 * @param className
	 * @returns {boolean}
	 */
	function hasClass(element, className)
	{
		if (element.classList)
			return element.classList.contains(className);
		else
			return new RegExp('(^| )' + className + '( |$)', 'gi').test(element.className);
	}

	YX.Util.element.hasClass = hasClass;

	/**
	 * addClass
	 * @param element
	 * @param className
	 */
	function addClass(element, className)
	{
		if (!hasClass(element, className))
		{
			if (element.classList)
				element.classList.add(className);
			else
				element.className += ' ' + className;
		}
	}

	YX.Util.element.addClass = addClass;

	/**
	 * removeClass
	 * @param element
	 * @param className
	 */
	function removeClass(element, className)
	{
		if (hasClass(element, className))
		{
			if (element.classList)
				element.classList.remove(className);
			else
				element.className = element.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
		}
	}

	YX.Util.element.removeClass = removeClass;

	/**
	 * toggleClass
	 * @param element
	 * @param className
	 */
	function toggleClass(element, className)
	{
		if (hasClass(element, className))
		{
			removeClass(element, className);
		}
		else
		{
			addClass(element, className);
		}
	}

	YX.Util.element.toggleClass = toggleClass;

	/********************************************************************************************************************/

	YX.Util.page = {};

	/**
	 * scrollListToIndex
	 * @param listFolder
	 * @param index
	 * @param toTopIndex
	 * @param duration
	 */
	function scrollListToIndex(listFolder, index, toTopIndex, duration)
	{
		if (index === 0)
		{
			scrollTo(listFolder, 0, duration);
		}
		else
		{
			let listItems = listFolder.childNodes,
					scrollOffset = 0,
					contentHeight = 0,
					scrollToCenter = 0;
			duration = (duration === undefined ? 500 : duration);
			for (let i = 0, l = listItems.length; i < l; i++)
			{
				let listItemHeight = listItems[i].offsetHeight;
				if (i < index)
				{
					scrollOffset += listItemHeight;
					if (i > toTopIndex - 1)
					{
						scrollToCenter += listItems[i - toTopIndex].offsetHeight;
					}
				}
				contentHeight += listItemHeight;
			}
			scrollOffset = scrollToCenter;
			if (scrollOffset + listFolder.offsetHeight > contentHeight)
			{
				scrollOffset = contentHeight - listFolder.offsetHeight;
			}
			scrollTo(listFolder, scrollOffset, duration);
		}
	}

	YX.Util.page.scrollListToIndex = scrollListToIndex;

	/**
	 * scrollTo
	 * @param element
	 * @param to
	 * @param duration
	 */
	function scrollTo(element, to, duration)
	{
		if (duration <= 0) return;
		let difference = to - element.scrollTop;
		let perTick = difference / duration * 10;

		setTimeout(function () {
			element.scrollTop = element.scrollTop + perTick;
			if (element.scrollTop === to) return;
			scrollTo(element, to, duration - 10);
		}, 10);
	}

	YX.Util.page.scrollTo = scrollTo;

	/********************************************************************************************************************/

	YX.Util.event = {};

	/**
	 * delegate element event
	 * @param element
	 * @param eventName
	 * @param selector
	 * @param handler
	 */
	function delegate(element, eventName, selector, handler)
	{
		let possibleTargets = element.querySelectorAll(selector);
		element.addEventListener(eventName, listenerHandler);

		function listenerHandler(event)
		{
			let target = event.target;

			for (let i = 0, l = possibleTargets.length; i < l; i++)
			{
				let el = target,
						p = possibleTargets[i];

				while (el && el !== element)
				{
					if (el === p)
					{
						return handler.call(p, event);
					}
					el = el.parentNode;
				}
			}
		}
	}

	YX.Util.event.delegate = delegate;

	/**
	 * bindClickIgnoreDrag
	 * @param elements
	 * @param callback
	 * @param isBind
	 */
	function bindClickIgnoreDrag(elements, callback, isBind)
	{
		let eventListenerName = isBind !== false ? 'on' : 'off',
				mouseDownX = 0,
				mouseDownY = 0;

		[].forEach.call(elements, function (element) {
			extendOnOff(element)[eventListenerName]('mousedown', mouseDownHandler);
		});

		function mouseDownHandler(event)
		{
			mouseDownX = event.pageX;
			mouseDownY = event.pageY;
			event.target.addEventListener('mouseup', mouseUpMoveHandler);
			event.target.addEventListener('mousemove', mouseUpMoveHandler);
		}

		function mouseUpMoveHandler(event)
		{
			if (event.type === 'mouseup' && event.which <= 1) //only for left key
			{
				callback(event);
			}
			else if (event.type === 'mousemove' && event.pageX === mouseDownX && event.pageY === mouseDownY)
			{
				return;
			}
			event.target.removeEventListener('mouseup', mouseUpMoveHandler);
			event.target.removeEventListener('mousemove', mouseUpMoveHandler);
		}
	}

	YX.Util.event.bindClickIgnoreDrag = bindClickIgnoreDrag;

	/**
	 * triggerEvent
	 * @param element
	 * @param eventName
	 * @param data
	 */
	function triggerEvent(element, eventName, data)
	{
		let event = null;
		if (window.CustomEvent)
		{
			event = new CustomEvent(eventName, {detail: data});
		}
		else
		{
			event = document.createEvent('CustomEvent');
			event.initCustomEvent(eventName, true, true, data);
		}

		element.dispatchEvent(event);
	}

	YX.Util.event.triggerEvent = triggerEvent;

	/**
	 * Extend on/off methods
	 * @param el: element
	 * @returns {*}
	 */
	function extendOnOff(el)
	{
		if (el.length === 0)
			return null;
		let events = {
			on: function (event, callback, opts) {
				if (!this.namespaces) // save the namespaces on the DOM element itself
					this.namespaces = {};

				this.namespaces[event] = callback;
				let options = opts || false;

				this.addEventListener(event.split('.')[0], callback, options);
				return this;
			},
			off: function (event) {
				this.removeEventListener(event.split('.')[0], this.namespaces[event]);
				delete this.namespaces[event];
				return this;
			}
		};

		// Extend the DOM with these above custom methods
		if (!el.isExtendOnOff)
		{
			el.on = Element.prototype.on = events.on;
			el.off = Element.prototype.off = events.off;
			el.isExtendOnOff = true;
		}
		return el;
	}

	YX.Util.event.extendOnOff = extendOnOff;

	/**
	 * mouseTouchTrack
	 * @param element
	 * @param infoCallback
	 */
	function mouseTouchTrack(element, infoCallback)
	{
		let touchStartBeginTime = 0,
				lastEventType = '';

		element.onclick = trackEvent;
		element.ontouchstart = trackEvent;
		element.ontouchend = trackEvent;
		element.ontouchmove = trackEvent;
		element.onmousedown = trackEvent;
		element.onmouseenter = trackEvent;
		element.onmouseleave = trackEvent;
		element.onmousemove = trackEvent;
		element.onmouseout = trackEvent;
		element.onmouseover = trackEvent;
		element.onmouseup = trackEvent;

		function trackEvent(event)
		{
			if (event.type === "touchstart")
			{
				touchStartBeginTime = Date.now();
			}
			if (event.type !== lastEventType)
			{
				infoCallback = infoCallback ? infoCallback : console.log;
				infoCallback(arguments, event.type, Date.now() - touchStartBeginTime);

				lastEventType = event.type;
			}
		}
	}

	YX.Util.event.mouseTouchTrack = mouseTouchTrack;

	YX.Util.event.notification = (option, spopOption) => {
		let showNotification = (option) => {
			if (option.registration)
			{
				let {title, registration} = option;
				registration.showNotification(title, option);
			}
			else
			{
				new Notification(option.title, option);
			}
		};
		if (!("Notification" in window))
		{
			YX.Plugin.spop(spopOption);
		}
		else if (Notification.permission === "granted")
		{
			showNotification(option);
		}
		else if (Notification.permission !== 'denied')
		{
			Notification.requestPermission(function (permission) {
				if (permission === "granted")
				{
					showNotification(option);
				}
				else
				{
					YX.Plugin.spop(spopOption);
				}
			});
		}
		else
		{
			YX.Plugin.spop(spopOption);
		}
	};

	/********************************************************************************************************************/

	YX.Plugin = {};

	YX.Plugin.spop = (options) => {
		const commonPath = 'https://gyx8899.github.io/YX-WebThemeKit/';
		const spopScript = commonPath + 'theme-pop/spop/spop.min.js';
		const spopStyle = commonPath + 'theme-pop/spop/spop.min.css';
		Promise.all([YX.Util.load.loadScriptWithPromise(spopScript), YX.Util.load.loadCSSWithPromise(spopStyle)])
				.then((results) => {
					if (results[0] && results[1])
					{
						spop(options);
					}
				});
	};

	/********************************************************************************************************************/

	window.YX = YX;

	// Compatible with webpack
	if (typeof exports === 'object' && typeof module === 'object')
	{
		module.exports = YX;
	}
})();