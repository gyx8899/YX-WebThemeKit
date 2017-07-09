/**
 * Javascript plugin: PreLoader v1.1
 *
 */
;(function ()
{
	this.PreLoader = function (options)
	{
		// Create global element references
		this.preLoader = null;

		// Define option defaults
		var defaults = {
			id: 'preLoader',
			className: 'loader-container',
			content: null,
			animateClassName: '',
			resourcesUrls: [],
			parentNode: null
		};

		// Create options by extending defaults with the passed in arguments
		if (options && typeof options === "object")
		{
			this.options = extendDefaults(defaults, options);
		}

		this.loadResources(this.options.resourcesUrls);

		this.addPreLoader();

		this.endPreLoader();
	};

	// Public Methods
	PreLoader.prototype.loadResources = function (urls)
	{
		for (var i = 0, l = urls.length; i < l; i++)
		{
			loadCSS(urls[i]);
		}
	};

	PreLoader.prototype.addPreLoader = function ()
	{
		var that = this;
		setTimeout(function ()
		{
			var parentNode = document.body;
			if (that.options.parentNode)
			{
				parentNode = that.options.parentNode;
			}
			parentNode.appendChild(that.getNewElement(that.options.id, that.options.className, that.options.content));
		}, 0);
	};

	PreLoader.prototype.getNewElement = function(id, className, content)
	{
		var preLoader = document.createElement("div");
		preLoader.id = id;
		preLoader.className = className;
		if (typeof content === 'string')
		{
			preLoader.innerHTML = content;
		}
		else
		{
			preLoader.appendChild(content);
		}
		return preLoader;
	};

	PreLoader.prototype.endPreLoader = function ()
	{
		var that = this;
		window.onload = function ()
		{
			that.destroy();
		};
	};

	PreLoader.prototype.destroy = function ()
	{
		this._destroy();
	};

	// Private Methods
	PreLoader.prototype._destroy = function ()
	{
		var preLoaderElement = document.getElementById(this.options.id);
		this.options.animateClassName && preLoaderElement.classList.remove(this.options.animateClassName);
		preLoaderElement.parentNode.removeChild(preLoaderElement);
	};

	// Utility methods

	// Utility method to extend defaults with user options
	function extendDefaults(source, properties)
	{
		var property;
		for (property in properties)
		{
			if (properties.hasOwnProperty(property))
			{
				source[property] = properties[property];
			}
		}
		return source;
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
		link.onload = function ()
		{
			callback && (context ? context[callback]() : callback());
		};
		link.onerror = function ()
		{
			console.log("Error load css:" + url);
		};
		document.getElementsByTagName('head')[0].appendChild(link);
	}

	// auto invoke
	new PreLoader({
		content: '<div class="loader"><span></span><span></span><span></span><span></span></div>',
		resourcesUrls: ['https://gyx8899.github.io/YX-WebThemeKit/fn-pre-loader/square-split-combination/preLoader.css']
	});
}());