/**
 * Javascript Plugin: Common header/Footer V2.0
 * Required:
 * 1. html file: contain <header> <footer>;
 * 2. css file: <header> <footer> style file;
 * 3. js file: <header> <footer> script file;
 *
 * Dependency:
 * 1. common.js functions
 *  1.1 deepExtend
 *  1.2 getCurrentScriptPath
 *  1.3 getFileContent
 *  1.4 parameterArrayToItem
 *  1.5 loadCSS
 *  1.6 loadScript
 *  1.7 initTemplate
 *
 * **/
(function () {
	this.HeaderFooter = function (options) {
		options = this._processOptions(options);

		this.options = deepExtend({}, HeaderFooter.DEFAULTS, options);

		this._getAndApplyTheme();

		loadCSS(this.options.css);
		loadScript(this.options.js);
	};

	HeaderFooter.DEFAULTS = {
		html: null,
		css: null,
		js: null,
		themeData: null
	};

	HeaderFooter.prototype._processOptions = function (options) {
		var scriptName = 'headerFooter.js',
				path = getCurrentScriptPath(scriptName),
				parentPath = path && path.replace(scriptName, '');
		options.html = parentPath + options.html;
		options.css = options.css.map(function (styleName) {
			return parentPath + styleName;
		});
		options.js = options.js.map(function (scriptName) {
			return parentPath + scriptName;
		});
		options.themeData.path = parentPath;
		return options;
	};

	HeaderFooter.prototype._getAndApplyTheme = function () {
		getFileContent(this.options.html, 'applyThemeData', this);
	};

	HeaderFooter.prototype.applyThemeData = function (data) {
		var textArea = document.createElement('textarea');
		textArea.innerText = data.toString();
		var sourceHtml = textArea.value;

		this._applyThemeTag('header', sourceHtml);
		this._applyThemeTag('footer', sourceHtml);
	};

	HeaderFooter.prototype._applyThemeTag = function (tag, sourceHTML) {
		var tagHTMLArray = regExpG("<" + tag + "[^>]*>((.|\n)*?)<\/" + tag + ">").exec(sourceHTML),
				tagTemplate = tagHTMLArray && tagHTMLArray[0];
		tagTemplate && this._applyTagWithTemplate(tag, tagTemplate);
	};

	HeaderFooter.prototype._applyTagWithTemplate = function (tag, template) {
		var commentElement = document.createComment(' ' + tag + ' '),
				tagElement = document.querySelector(tag),
				tagElementWrapper = document.createElement('div'),
				body = document.body;
		tagElementWrapper.innerHTML = initTemplate(template, this.options.themeData);

		// Remove native tag
		tagElement && tagElement.parentNode.removeChild(tagElement);

		if (tag === 'header')
		{
			if (body.firstChild)
			{
				body.insertBefore(tagElementWrapper.firstChild, body.firstChild);
				body.insertBefore(commentElement, body.firstChild);
			}
			else
			{
				body.appendChild(commentElement);
				body.appendChild(tagElementWrapper.firstChild);
			}
		}
		else if (tag === 'footer')
		{
			body.appendChild(commentElement);
			body.appendChild(tagElementWrapper.firstChild);
		}
	};
})();