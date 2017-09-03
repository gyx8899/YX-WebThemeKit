/**
 * Javascript plugin: PreLoader v1.6
 *
 * Dependency:
 * 1. common.js, for loading resource file (https://gyx8899.github.io/YX-JS-ToolKit/asset/js/common.js)
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
}());