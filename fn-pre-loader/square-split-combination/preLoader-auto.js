/**
 * Javascript plugin: PreLoader v1.3
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

		// Define option defaults
		var defaults = {
			id: 'preLoader',
			coverLay: false,
			coverLayInfo: {
				backgroundColor: '#fff'
			},
			imageAnimate: false,
			imageAnimateInfo: {
				positionX: 'center', // center, left, right
				positionY: 'center', // center, top, bottom
				width: 50,
				height: 50,
				src: ''
			},
			endLoader: false, // on document.readyState = "complete"
			loaderHTML: false,
			loaderHTMLInfo: {
				parentNode: null, // default value: document.body
				content: ''  // element or html string
			},
			loaderCSS: false,
			loaderCSSInfo: {
				cssUrl: ''  // Support url string and array
			},
			loaderJS: false,
			loaderJSInfo: {
				jsUrl: ''  // Support url string and array
			}
		};

		// Create options by extending defaults with the passed in arguments
		if (options && typeof options === "object")
		{
			this.options = deepExtend(defaults, options);
		}
		this.preLoaderElement = this._getPreLoader();

		this._addPreLoader();

		this.options.loaderCSS && this._loadResources(this.options.loaderCSSInfo.cssUrl, loadCSS);
		this.options.loaderJS && this._loadResources(this.options.loaderJSInfo.jsUrl, loadJS);

		this.options.endLoader && this._endPreLoaderOnLoaded();
	};

	// Private Methods
	PreLoader.prototype.destroy = function () {
		this._destroy();
	};

	// Public Methods
	PreLoader.prototype._loadResources = function (url, loadFn) {
		if (url != null && url != '')
		{
			if (Array.isArray(url))
			{
				for (var i = 0, l = url.length; i < l; i++)
				{
					loadFn(url[i]);
				}
			}
			else
			{
				loadFn(url);
			}
		}
		else
		{
			console && console.log("URL: " + url + " is not a valid url!");
		}
	};

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
		if (parentNode != null)
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
		var that = this,
				oldWindowOnLoad = window.onload;
		window.onload = function () {
			oldWindowOnLoad && oldWindowOnLoad();
			that.destroy();
		};
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
					if (typeof obj[key] === 'object')
						out[key] = arguments.callee(out[key], obj[key]);
					else
						out[key] = obj[key];
				}
			}
		}
		return out;
	}

	/*
	 * Functions: Dynamic load files in page;
	 * */
	function loadCSS(url, callback, context)
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

	function loadJS(url, callback, context)
	{
		var script = document.createElement("script");
		script.type = "text/javascript";

		if (script.readyState)
		{  //IE
			script.onreadystatechange = function () {
				if (script.readyState == "loaded" || script.readyState == "complete")
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
}());

// Instance PreLoader immediately
var preLoader = new PreLoader({
	endLoader: true,
	coverLay: true,
	loaderHTML: true,
	loaderHTMLInfo: {
		// content: '<div class="loader-container"><div class="loader"><span></span><span></span><span></span><span></span></div></div>'  // element or html string
		content: '<div class="loader"><span></span><span></span><span></span><span></span></div>'  // element or html string
	},
	loaderCSS: true,
	loaderCSSInfo: {
		cssUrl: 'https://gyx8899.github.io/YX-WebThemeKit/fn-pre-loader/square-split-combination/preLoader.css'  // Support url string and array
	}
});