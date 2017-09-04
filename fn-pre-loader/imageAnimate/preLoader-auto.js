/**
 * Javascript plugin: PreLoader v1.7
 */
;(function () {
	this.PreLoader = function (options) {
		// Create global element references
		this.preLoaderElement = null;
		this.positionValue = {
			'center': '50%',
			'left': '0%',
			'top': '0%',
			'right': '100%',
			'bottom': '100%'
		};
		this.offsetValue = {
			'center': -0.5,
			'left': 0,
			'right': -1
		};

		// Create options by extending defaults with the passed in arguments
		this.options = deepExtend(PreLoader.DEFAULTS, options);
		this.preLoaderElement = this._getPreLoader();

		this._addPreLoader();

		loadResources(this.options.resources);

		this.options.endLoader && this._endPreLoaderOnLoaded();
	};

	PreLoader.DEFAULTS = {
		id: 'preLoader',
		// Custom overlay, default true
		coverLay: true,
		coverLayInfo: {
			backgroundColor: '#fff'
		},
		// Custom with image, default none
		imageAnimate: false,
		imageAnimateInfo: {
			positionX: 'center', // center, left, right
			positionY: 'center', // center, top, bottom
			width: 50,
			height: 50,
			src: ''
		},
		// Enable endLoader in document readyState = "complete", default true
		endLoader: true,
		// Custom parent(preload container) and content (preload display)
		loaderHTML: false,
		loaderHTMLInfo: {
			parentNode: null, // default value: document.body
			content: ''  // element or html string
		},
		// Load resources: css, js
		resources: []
	};

	// Public Methods
	PreLoader.prototype.destroy = function () {
		this._destroy();
	};

	// Private Methods
	PreLoader.prototype._getPreLoader = function () {
		var preLoaderElement = null;
		if (this.options.loaderHTML)
		{
			preLoaderElement = this._getDivElement(this.options.id, null, this.options.loaderHTMLInfo.content);
		}
		else if (this.options.imageAnimate)
		{
			preLoaderElement = this._getDivElement(this.options.id);
			var animateInfo = this.options.imageAnimateInfo,
					preLoaderImg = this._getImgElement(animateInfo.src, animateInfo.width, animateInfo.height);
			preLoaderImg.style.position = 'absolute';
			preLoaderImg.style.left = 'calc(' + this.positionValue[animateInfo.positionX] + ' + ' + parseInt(animateInfo.width * this.offsetValue[animateInfo.positionX], 10) + 'px)';
			preLoaderImg.style.top = 'calc(' + this.positionValue[animateInfo.positionY] + ' + ' + parseInt(animateInfo.height * this.offsetValue[animateInfo.positionY], 10) + 'px)';
			preLoaderElement.appendChild(preLoaderImg);
		}
		if (this.options.coverLay)
		{
			preLoaderElement.style.position = 'fixed';
			preLoaderElement.style.left = 0;
			preLoaderElement.style.top = 0;
			preLoaderElement.style.zIndex = 999;
			preLoaderElement.style.width = '100%';
			preLoaderElement.style.height = '100%';
			preLoaderElement.style.backgroundColor = this.options.coverLayInfo.backgroundColor;
		}
		return preLoaderElement;
	};

	PreLoader.prototype._addPreLoader = function () {
		var parentNode = this.options.loaderHTMLInfo.parentNode || document.body;
		if (parentNode !== null)
		{
			parentNode && parentNode.appendChild(this.preLoaderElement);
		}
		else
		{
			var that = this;
			setTimeout(function () {
				that._addPreLoader();
			}, 10);
		}
	};

	PreLoader.prototype._getDivElement = function (id, className, content) {
		var element = document.createElement("div");
		id && (element.id = id);
		className && (element.className = className);
		if (typeof content === 'string')
		{
			element.innerHTML = content;
		}
		else
		{
			content && (element.appendChild(content));
		}
		return element;
	};

	PreLoader.prototype._getImgElement = function (src, width, height) {
		var element = document.createElement("img");
		element.src = src;
		element.style.width = width + 'px';
		element.style.height = height + 'px';
		return element;
	};

	PreLoader.prototype._endPreLoaderOnLoaded = function () {
		var that = this;
		window.addEventListener("load", function () {
			that.destroy();
		}, false);
	};

	// Private Methods
	PreLoader.prototype._destroy = function () {
		var preLoaderElement = document.getElementById(this.options.id);
		// Remove preLoader element from parentNode
		preLoaderElement.parentNode.removeChild(preLoaderElement);
	};

	// Utility method to extend defaults with user options
	function deepExtend(out)
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
					if (typeof obj[key] === 'object' && !Array.isArray(obj[key]))
						out[key] = arguments.callee(out[key], obj[key]);
					else
						out[key] = obj[key];
				}
			}
		}
		return out;
	}

	// Functions: loadResource
	// Copy from common.js (https://gyx8899.github.io/YX-JS-ToolKit/asset/js/common.js)
	var resourceMethod = {
		loadCSS: function (url, callback, context) {
			if (!url)
				return;

			if (Array.isArray(url))
			{
				// Process the url and callback if they are array;
				parameterArrayToItem(arguments.callee, url, callback);
			}
			else
			{
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
		},
		loadScript: function (url, callback, context) {
			if (!url)
				return;

			if (Array.isArray(url))
			{
				// Process the url and callback if they are array;
				parameterArrayToItem(arguments.callee, url, callback);
			}
			else
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
		},
		loadCSSWithPromise: function (url) {
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
		},
		loadScriptWithPromise: function (url) {
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
	};

	function loadResource(url, callback)
	{
		if (!checkResourceLoaded(url))
		{
			resourceMethod[getUrlTypeInfo(url).loadFn](url, callback);
		}
	}

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

	function loadUrls(urls, callback)
	{
		var unLoadedResourcesInfo = urls.map(function (resource) {
			var resourceInfo = getUrlTypeInfo(resource);
			resourceInfo.url = resource;
			return resourceInfo;
		});
		// If support Promise, use Promise
		if (typeof Promise !== "undefined" && Promise.toString().indexOf("[native code]") !== -1)
		{
			var resourcePromise = unLoadedResourcesInfo.map(function (resourceInfo) {
				return resourceMethod[resourceInfo.loadFnPromise](resourceInfo.url);
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
				resourceMethod[resourceInfo.loadFn](resourceInfo.url);
			});
			callback && callback();
		}
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
			var urlType = {
				'js': {
					name: 'js',
					tagName: 'script',
					urlAttrName: 'src',
					loadFn: "loadScript",
					loadFnPromise: "loadScriptWithPromise"
				},
				'css': {
					name: 'css',
					tagName: 'link',
					urlAttrName: 'href',
					loadFn: "loadCSS",
					loadFnPromise: "loadCSSWithPromise"
				}
			};
			return urlType[resourceNameSplitArray.pop()];
		}
		return null;
	}
})();

// Instance PreLoader immediately
new PreLoader({
	imageAnimate: true,
	imageAnimateInfo: {
		src: 'loading-dot-circle-rotate.svg'
	}
});
