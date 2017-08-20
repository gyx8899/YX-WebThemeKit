/**
 * Javascript plugin: PreviewCode v2.1
 *
 * Setting in html tag:
 * 1. Required:
 * 1.1 data-toggle="previewCode"
 * 1.2 data-target="#[targetId]" (append preview code to target)
 *
 * 2. Optional:
 * 2.1 data-title="titleAboveCode"
 *
 * Support: Any html tag, especially support <link> with href, <script> with src;
 * Not Support: IE (Promise not support in IE)
 *
 * Dependency: highlight
 * https://highlightjs.org/
 *
 * */
(function () {

	this.PreviewCode = function (elements, options) {
		this.options = deepExtend(PreviewCode.DEFAULTS, options);

		var that = this,
				urls = [that.options.highlight.css, that.options.highlight.js].concat(that.options.highlight.others);
		new LoadResources(urls, function () {
			that._init(elements);
		});
	};

	PreviewCode.DEFAULTS = {
		highlight: {
			css: 'https://gyx8899.github.io/YX-WebThemeKit/fn-preview-code/previewCode.css',
			js: 'https://gyx8899.github.io/YX-WebThemeKit/fn-preview-code/highlight.js',
			others: []
		},
		initHighlight: null
	};

	PreviewCode.prototype._init = function (elements) {
		if (elements)
		{
			if (elements.jquery)
			{
				elements = elements.length > 1 ? elements.get() : elements[0];
			}
			if (NodeList.prototype.isPrototypeOf(elements) || Array.isArray(elements))
			{
				for (var i = 0, l = elements.length; i < l; i++)
				{
					previewElementCode(elements[i]);
				}
			}
			else if (elements.nodeType)
			{
				previewElementCode(elements);
			}
		}
		else
		{
			Array.prototype.slice.call(document.querySelectorAll('[data-toggle="previewCode"]'))
					.forEach(function (element) {
						previewElementCode(element);
					});
		}

		if (this.options.initHighlight)
		{
			this.options.initHighlight();
		}
		else
		{
			initHighlight();
		}
	};

	// Functions: init Highlight
	function initHighlight()
	{
		hljs.configure({tabReplace: '  '});
		hljs.initHighlightingOnLoad();
	}

	// Functions: Process code
	function previewElementCode(element)
	{
		var targetElement = document.querySelector(element.getAttribute('data-target')),
				previewHTML = element.innerHTML,
				previewTitle = getPreviewTitle(element),
				elementTag = element.tagName.toLowerCase(),
				elementLink = '';
		if (elementTag === 'script')
		{
			elementLink = element.src;
		}
		else if (elementTag === 'link')
		{
			elementLink = element.href;
		}
		if (elementLink)
		{
			getFileContent(elementLink, function (data) {
				addPreviewCode(targetElement, data, getFileNameFromURL(elementLink));
			}, null);
		}
		else
		{
			addPreviewCode(targetElement, previewHTML, previewTitle);
		}
	}

	function addPreviewCode(parentElement, codeString, demoTitle)
	{
		var codeContent = trimPrevSpace(escapeHTML(codeString)),
				codeElement = document.createElement('div');
		codeElement.className = "preview-code";
		codeElement.innerHTML = '<h3 class="h3-title">' + demoTitle + '</h3><pre><code>' + codeContent + '</code></pre>';
		parentElement.appendChild(codeElement);
	}

	function getPreviewTitle(element)
	{
		var previewTitle = element.getAttribute('data-title');
		if (!previewTitle)
		{
			var elementTag = element.tagName.toLowerCase();
			if (elementTag === 'style' || elementTag === 'link')
			{
				previewTitle = 'CSS';
				var href = element.getAttribute('href');
				if (elementTag === 'link' && href !== null)
				{
					previewTitle = getFileNameFromURL(href);
				}
			}
			else if (elementTag === 'script')
			{
				previewTitle = 'JS';
				var src = element.getAttribute('src');
				if (src !== null)
				{
					previewTitle = getFileNameFromURL(src);
				}
			}
			else
			{
				previewTitle = 'HTML';
			}
		}
		return previewTitle;
	}

	function trimPrevSpace(str)
	{
		var strArray = str.split('\n'),
				beginIndex = getFirstNonSpaceValueIndex(strArray),
				resultStr = '';
		if (beginIndex !== -1)
		{
			var newStrArray = [],
					reverseStrArray = strArray.slice(0).reverse(),
					endIndex = strArray.length - getFirstNonSpaceValueIndex(reverseStrArray),
					commonPreSpace = /(^\s*)/g.exec(strArray[beginIndex])[0];
			for (var i = beginIndex, j = 0; i < endIndex; i++)
			{
				newStrArray[j++] = strArray[i].replace(commonPreSpace, '');
			}
			resultStr = newStrArray.join('\n');
		}
		return resultStr;
	}

	function getFirstNonSpaceValueIndex(array)
	{
		for (var i = 0, l = array.length; i < l; i++)
		{
			// Filter space line
			if (/^[\s|\t]+$/.test(array[i]) === false && array[i] != '')
			{
				return i;
			}
		}
		return -1;
	}

	// Util Functions

	function escapeHTML(text)
	{
		var map = {
			'&': '&amp;',
			'<': '&lt;',
			'>': '&gt;',
			'"': '&quot;',
			"'": '&#039;'
		};

		return text.replace(/[&<>"']/g, function (m) {
			return map[m];
		});
	}

	function getFileContent(url, callback, context)
	{
		$.ajax({
			url: url,
			success: function (data) {
				callback && (context ? context[callback](data) : callback(data));
			}
		});
	}

	// Deep copy
	function deepExtend(out) // arguments: (source, source1, source2, ...)
	{
		out = out || {};

		for (var i = 1; i < arguments.length; i++)
		{
			var obj = arguments[i];

			if (!obj)
				continue;

			for (var key in obj)
			{
				if (obj.hasOwnProperty(key))
				{
					if (typeof obj[key] === 'object')
						out[key] = arguments.callee(out[key], obj[key]);
					else
						out[key] = obj[key];
				}
			}
		}
		return out;
	}
})();

/**
 * Javascript plugin: loadResources V1.3
 * Support list:
 * 1. css file;
 * 2. js file;
 *
 * Params:
 * 1. urls: single url string or url string array;
 * 2. callback: execute when resource success;
 *
 * No support:
 * 1. Not in IE when set callback and url string array;
 *
 * */
(function () {
	this.LoadResources = function (urls, callback) {
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
						var that = this;
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
	};

	LoadResources.DEFAULTS = {
		'js': {
			name: 'js',
			tagName: 'script',
			urlAttrName: 'src',
			loadFnName: 'loadJS',
			loadFnPromiseName: 'loadJStWithPromise'
		},
		'css': {
			name: 'css',
			tagName: 'link',
			urlAttrName: 'href',
			loadFnName: 'loadCSS',
			loadFnPromiseName: 'loadCSSWithPromise'
		}
	};

	// Tools: functions
	function loadResource(url)
	{
		if (!checkResourceLoaded(url))
		{
			eval(getUrlTypeInfo(url).loadFnName)(url);
		}
	}

	function loadUrls(urls, callback)
	{
		var unLoadedResourcesInfo = urls.map(function (resource) {
					var type = getUrlTypeInfo(resource),
							resourceInfo = JSON.parse(JSON.stringify(LoadResources.DEFAULTS[type.name]));
					resourceInfo.url = resource;
					return resourceInfo;
				}),
				resourcePromise = unLoadedResourcesInfo.map(function (resourceInfo) {
					return eval(resourceInfo.loadFnPromiseName)(resourceInfo.url);
				});
		Promise.all(resourcePromise).then(function () {
			callback && callback();
		}).catch(function (error) {
			console.log("Error: in load resources! " + error);
		});
	}

	function loadCSS(url, callback)
	{
		if (!url)
			return;

		var link = document.createElement('link');
		link.rel = 'stylesheet';
		link.type = 'text/css';
		link.href = url;
		link.onload = function () {
			callback && (context ? context[callback]() : callback());
		};
		link.onerror = function () {
			console.log("Error load css:" + url);
		};
		document.getElementsByTagName('head')[0].appendChild(link);
	}

	function loadJS(url, callback)
	{
		var script = document.createElement("script");
		script.type = "text/javascript";

		if (script.readyState)
		{  //IE
			script.onreadystatechange = function () {
				if (script.readyState === "loaded" || script.readyState === "complete")
				{
					script.onreadystatechange = null;
					callback && (context ? context[callback]() : callback());
				}
			};
		}
		else
		{  //Others
			script.onload = function () {
				callback && (context ? context[callback]() : callback());
			};
		}

		script.src = url;
		document.body.appendChild(script);
	}

	function loadCSSWithPromise(url)
	{
		return new Promise(function (resolve, reject) {
			if (!url)
			{
				reject(new Error("url is null!"));
			}

			var link = document.createElement('link');
			link.rel = 'stylesheet';
			link.type = 'text/css';
			link.href = url;
			link.onload = function () {
				resolve();
			};
			link.onerror = function (error) {
				reject(new Error(error));
			};
			document.getElementsByTagName('head')[0].appendChild(link);
		});
	}

	function loadJStWithPromise(url)
	{
		return new Promise(function (resolve, reject) {
			if (!url)
			{
				reject(new Error("url is null!"));
			}

			var script = document.createElement("script");
			script.type = "text/javascript";

			if (script.readyState)
			{  //IE
				script.onreadystatechange = function () {
					if (script.readyState === "loaded" || script.readyState === "complete")
					{
						script.onreadystatechange = null;
						resolve();
					}
				};
			}
			else
			{  //Others
				script.onload = function () {
					resolve();
				};
			}

			script.src = url;
			document.body.appendChild(script);
		});
	}

	function getFileNameFromURL(url)
	{
		return url.split('/').pop().split('#')[0].split('?')[0];
	}

	function checkResourceLoaded(url)
	{
		var type = getUrlTypeInfo(url),
				typeSelector = type['tagName'] || '[src]',
				allUrls = Array.prototype.slice.call(document.querySelectorAll(typeSelector))
						.map(function (scriptElement) {
							return scriptElement[type['urlAttrName']];
						});
		return allUrls.indexOf(url) !== -1;
	}

	function getUrlTypeInfo(url)
	{
		// Current only support js and css resources;
		var resourceName = getFileNameFromURL(url),
				resourceNameSplitArray = resourceName.split('.');
		if (resourceNameSplitArray.length > 1)
		{
			return LoadResources.DEFAULTS[resourceNameSplitArray[resourceNameSplitArray.length - 1]];
		}
		return null;
	}
})();