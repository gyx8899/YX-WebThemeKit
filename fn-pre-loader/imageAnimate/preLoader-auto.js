/**
 * Javascript plugin: PreLoader v1.5
 *
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

		LoadResources(this.options.resources);

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
}());

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

// Instance PreLoader immediately
new PreLoader({
	imageAnimate: true,
	imageAnimateInfo: {
		src: 'loading.svg'
	}
});