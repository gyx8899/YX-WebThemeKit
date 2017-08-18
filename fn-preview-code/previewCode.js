/**
 * Auto preview code
 * Setting in html tag:
 * 1. Required:
 * 1.1 data-toggle="previewCode"
 * 1.2 data-target="#[targetId]" (append preview code to target)
 * 2. Optional:
 * 2.1 data-title="titleAboveCode"
 *
 * Support: Any html tag, especially support <link> with href, <script> with src;
 * Not Support: IE (Promise not support IE)
 * */
(function () {

	this.PreviewCode = function (elements) {
		var defaults = {
			resources: ['https://gyx8899.github.io/YX-WebThemeKit/fn-preview-code/previewCode.css',
				'https://gyx8899.github.io/YX-WebThemeKit/fn-preview-code/highlight.js'],
			resourceType: {
				css: {type: 'css', tagName: 'link', url: ''},
				js: {type: 'js', tagName: 'script', url: ''}
			}
		};
		this._loadResources(elements, defaults);
	};

	PreviewCode.prototype._loadResources = function (elements, defaults) {
		var that = this,
				unLoadedResources = defaults.resources.filter(function (resource) {
					return !checkResourceLoaded(resource);
				});
		if (unLoadedResources.length)
		{
			var unLoadedResourcesInfo = unLoadedResources.map(function (resource) {
						var type = getUrlType(resource),
								resourceInfo = JSON.parse(JSON.stringify(defaults.resourceType[type.name]));
						resourceInfo.url = resource;
						return resourceInfo;
					}),
					resourcePromise = unLoadedResourcesInfo.map(function (resourceInfo) {
						if (resourceInfo.type === 'js')
						{
							return loadScript(resourceInfo.url);
						}
						else if (resourceInfo.type === 'css')
						{
							return loadCSS(resourceInfo.url);
						}
					});
			Promise.all(resourcePromise).then(function () {
				that._init(elements);
			}).catch(function (error) {
				console.log("Error: in load resources! " + error);
			});
		}
		else
		{
			that._init(elements);
		}
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
	};

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
	function getFileNameFromURL(url)
	{
		return url.split('/').pop().split('#')[0].split('?')[0];
	}

	function checkResourceLoaded(url)
	{
		var type = getUrlType(url),
				typeSelector = type['tagName'] || '[src]',
				allUrls = Array.prototype.slice.call(document.querySelectorAll(typeSelector))
						.map(function (scriptElement) {
							return scriptElement[type['urlAttrName']];
						});
		return allUrls.indexOf(url) !== -1;
	}

	function getUrlType(url)
	{
		// Current only support js and css resources;
		var types = {
					'js': {name: 'js', tagName: 'script', urlAttrName: 'src'},
					'css': {name: 'css', tagName: 'link', urlAttrName: 'href'}
				},
				resourceName = getFileNameFromURL(url),
				resourceNameSplitArray = resourceName.split('.');
		if (resourceNameSplitArray.length === 1)
		{
			return null;
		}
		else
		{
			return types[resourceNameSplitArray[resourceNameSplitArray.length - 1]];
		}
	}

	// loadCSS with Promise
	function loadCSS(url)
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

	// loadScript with Promise
	function loadScript(url)
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
})();