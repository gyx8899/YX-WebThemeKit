// Apply HeaderFooter Template;
(function ($)
{
	function headerFooter(type, themeData, config)
	{
		this.typeIndex = headerFooter.DEFAULTS.types.indexOf(type);
		this.typeIndex = this.typeIndex != -1 ? this.typeIndex : 0;
		this.typeOptions = {
			html: headerFooter.DEFAULTS.html[this.typeIndex],
			css: headerFooter.DEFAULTS.css[this.typeIndex],
			js: headerFooter.DEFAULTS.js[this.typeIndex]
		};
		this.config = config || headerFooter.DEFAULTS.config;
		this.themeData = $.extend({}, headerFooter.DEFAULTS.themeData[this.typeIndex], themeData);

		this._applyTheme();
	}

	headerFooter.DEFAULTS = {
		pluginFileName: 'header-footer.js',
		types: ['owl'],
		html: [['owl.html']],
		css: [["owl.css"]],
		js: [['owl.js']],
		config: {tag: ['header', 'footer']},
		themeData: [{
			title: '',
			subTitle: '',
			menuItems: '',
			referrer: '',
			referrerName: '',
			rootLink: '',
			author: 'Steper Kuo',
			authorLink: 'mailto:gyx8899@126.com'
		}]
	};
	headerFooter.prototype._applyTheme = function ()
	{
		this._initDefaultData();

		loadCSS(this.typeOptions.css);
		loadScript(this.typeOptions.js);

		this._loadThemeHTML(this.typeOptions.html[0]);
	};

	headerFooter.prototype._initDefaultData = function ()
	{
		// Init theme links
		var currentLink = this._getScriptURLWithFileName(headerFooter.DEFAULTS.pluginFileName);
		var rootLink = this._getParentPathOffSubTrial(currentLink, headerFooter.DEFAULTS.pluginFileName);
		this.themeData.rootLink = rootLink;
		this.typeOptions.html = this._getURLsWithRootLinkAndFileNames(rootLink, this.typeOptions.html);
		this.typeOptions.css = this._getURLsWithRootLinkAndFileNames(rootLink, this.typeOptions.css);
		this.typeOptions.js = this._getURLsWithRootLinkAndFileNames(rootLink, this.typeOptions.js);

		// Init data from page
		var element = document.querySelector('meta[name="author"]');
		this.themeData.author = (element && element.getAttribute("content")) || '';
		this.themeData.title = $('title').text();

		var pathNameItems = window.location.href.split('/');
		var referrer = pathNameItems.slice(0, pathNameItems.length - 2).join('/') + '/';
		this.themeData.referrer = referrer;
		this.themeData.referrerName = referrer.length > 0 ? '< Back' : '';
	};

	headerFooter.prototype._getURLsWithRootLinkAndFileNames = function (rootLink, fileNames)
	{
		var fileURLs = [];
		for (var i = 0, length = fileNames.length; i < length; i++)
		{
			fileURLs[i] = (fileNames[i].indexOf('http') == -1) ? (rootLink + fileNames[i]) : fileNames[i];
		}
		return fileURLs;
	};

	headerFooter.prototype._loadThemeHTML = function (url)
	{
		getFileContent(url, 'applyTemplate', this);
	};

	headerFooter.prototype.applyTemplate = function (data)
	{
		var sourceHtml = $('<textarea />').text(data.toString()).val();
		for(var i = 0; i < this.config.tag.length; i++)
		{
			this._replaceTag(this.config.tag[i], sourceHtml);
		}
	};

	headerFooter.prototype._replaceTag = function (tag, sourceHTML)
	{
		var tagHTMLArray = regExpG("<" + tag + ".*(?=)(.|\n)*?</" + tag + ">").exec(sourceHTML),
				tagTemplate = tagHTMLArray && tagHTMLArray[0];
		tagTemplate && this._applyData(tag, tagTemplate);
	};

	headerFooter.prototype._applyData = function (tag, template)
	{
		var comment = "<!-- " + tag + " -->",
				tagHTML = replaceTemplateExpressionWithData(template, this.themeData),
				resultHTML = comment + tagHTML;
		if ((tag == 'header' || tag == 'footer') && $(tag).length > 0)
		{
			$(tag).remove();
		}
		var $main = $('main');
		if ($main.length > 0)
		{
			if (tag == 'header')
			{
				$main.before(resultHTML);
			}
			else if (tag == 'footer')
			{
				$main.after(resultHTML);
			}
			else
			{
				$main.prepend(resultHTML);
			}
		}
		else
		{
			if (tag == 'header')
			{
				$('body').prepend(resultHTML);
			}
			else if (tag == 'footer')
			{
				$('body').append(resultHTML);
			}
			else
			{
				$('header').after(resultHTML);
			}
		}
	};

	headerFooter.prototype._getScriptURLWithFileName = function (jsFileName)
	{
		var scripts = document.getElementsByTagName("script");

		for (var i = 0; i < scripts.length; i++)
		{
			var script = scripts.item(i);

			if (script.src && script.src.match(jsFileName))
			{
				return script.src;
			}
		}
	};

	headerFooter.prototype._getParentPathOffSubTrial = function (url, subTrial)
	{
		return url.replace(subTrial, '');
	};

	$.extend({
		applyHeaderFooter: function (type, options, config)
		{
			"use strict";
			new headerFooter(type, options, config);
		}
	})
})(jQuery);