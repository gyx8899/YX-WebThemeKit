// Apply HeaderFooter Template;
(function ($)
{
	function headerFooter(type, themeData)
	{
		this.typeIndex = headerFooter.DEFAULTS.types.indexOf(type);
		this.typeIndex = this.typeIndex != -1 ? this.typeIndex : 0;
		this.typeOptions = {
			html: headerFooter.DEFAULTS.html[this.typeIndex],
			css: headerFooter.DEFAULTS.css[this.typeIndex],
			js: headerFooter.DEFAULTS.js[this.typeIndex]
		};
		this.themeData = $.extend({}, headerFooter.DEFAULTS.themeData[this.typeIndex], themeData);

		this._applyTheme();
	}

	headerFooter.DEFAULTS = {
		pluginFileName: 'header-footer.js',
		types: ['owl'],
		html: [['owl.html']],
		css: [["owl.css"]],
		js: [[]],
		themeData: [{
			title: '',
			menuItems: '',
			rootLink: '',
			author: 'Steper Kuo',
			authorLink: 'mailto:gyx8899@126.com'
		}]
	};
	headerFooter.prototype._applyTheme = function ()
	{
		this._initDefaultData();

		loadLinkCSS(this.typeOptions.css);
		loadScritJS(this.typeOptions.js);

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
	};

	headerFooter.prototype._getURLsWithRootLinkAndFileNames = function (rootLink, fileNames)
	{
		var fileURLs = [];
		for (var i = 0, length = fileNames.length; i < length; i++)
		{
			fileURLs[i] = rootLink + fileNames[i];
		}
		return fileURLs;
	};

	headerFooter.prototype._loadThemeHTML = function (url)
	{
		var that = this;
		$.ajax({
			url: url,
			success: function (data)
			{
				that._applyTemplate(data);
			}
		});
	};

	headerFooter.prototype._applyTemplate = function (data)
	{
		var sourceHtml = $('<textarea />').text(data.toString()).val();
		this._replaceTag('header', sourceHtml);
		this._replaceTag('footer', sourceHtml);
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
				tagHTML = this._replaceData(template, this.themeData);
		if ($(tag).length > 0)
		{
			$(tag).remove();
		}
		var $main = $('main');
		if ($main.length > 0)
		{
			if (tag == 'header')
			{
				$main.before(comment + tagHTML);
			}
			else
			{
				$main.after(comment + tagHTML);
			}
		}
		else
		{
			if (tag == 'header')
			{
				$('body').prepend(comment + tagHTML);
			}
			else
			{
				$('body').append(comment + tagHTML);
			}
		}
	};

	headerFooter.prototype._replaceData = function (template, themeData)
	{
		var resultTemplate = template, dataKeys = Object.keys(themeData), dataItem = null;
		for (var i = 0, length = dataKeys.length; i < length; i++)
		{
			dataItem = dataKeys[i];
			resultTemplate = resultTemplate.replace(regExpG("{{" + dataItem + "}}"), themeData[dataItem] || '');
		}
		return resultTemplate;
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
		applyHeaderFooter: function (type, options)
		{
			"use strict";
			new headerFooter(type, options);
		}
	})
})(jQuery);