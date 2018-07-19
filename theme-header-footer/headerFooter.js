/**!
 * HeaderFooter plugin v3.1.0.180718_beta
 */
/**
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
 */
(function (YX) {
	let HeaderFooter = function (options) {
		options = this._processOptions(options);

		this.options = YX.Util.tool.deepExtend({}, HeaderFooter.DEFAULTS, options);

		this._getAndApplyTheme();

		YX.Util.load.loadCSS(this.options.css);
		YX.Util.load.loadScript(this.options.js);
	};

	HeaderFooter.DEFAULTS = {
		html: null,
		css: null,
		js: null,
		themeData: null
	};

	HeaderFooter.TYPE_ABBRS = {
		'owl-theme': 'owl-theme'
	};

	HeaderFooter.TYPE_OPTIONS = {
		'owl-theme': {
			html: 'owl/owl.html',
			css: ["owl/owl.css"],
			js: ["owl/owl.min.js"],
			themeData: {
				title: document.querySelector('title').text,
				menuItems: '',
				path: 'theme-header-footer/',
				author: 'Steper Kuo',
				authorLink: 'https://github.com/gyx8899'
			}
		}
	};

	HeaderFooter.prototype._processOptions = function (options) {
		let scriptName = 'headerFooter',
				path = YX.Util.url.getCurrentScriptPath(scriptName),
				parentPath = path && path.split(scriptName)[0];
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
		YX.Util.load.getFileContent(this.options.html, 'applyThemeData', this);
	};

	HeaderFooter.prototype.applyThemeData = function (data) {
		let textArea = document.createElement('textarea');
		textArea.innerText = data.toString();
		let sourceHtml = textArea.value;

		this._applyThemeTag('header', sourceHtml);
		this._applyThemeTag('footer', sourceHtml);
	};

	HeaderFooter.prototype._applyThemeTag = function (tag, sourceHTML) {
		let tagHTMLArray = YX.Util.regExp.regExpG("<" + tag + "[^>]*>((.|\n)*?)<\/" + tag + ">").exec(sourceHTML),
				tagTemplate = tagHTMLArray && tagHTMLArray[0];
		tagTemplate && this._applyTagWithTemplate(tag, tagTemplate);
	};

	HeaderFooter.prototype._applyTagWithTemplate = function (tag, template) {
		let commentElement = document.createComment(' ' + tag + ' '),
				tagElement = document.querySelector(tag),
				tagElementWrapper = document.createElement('div'),
				body = document.body;
		tagElementWrapper.innerHTML = YX.Util.html.initTemplate(template, this.options.themeData);

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

	window.HeaderFooter = HeaderFooter;

	// Compatible with webpack
	if (typeof exports === 'object' && typeof module === 'object')
	{
		module.exports = HeaderFooter;
	}
})(window.YX);

(function (root) {
	let siteInfo = [{
				name: 'YX-JS-ToolKit',
				theme: 'owl-theme'
			}, {
				name: 'YX-WebThemeKit',
				theme: 'owl-theme'
			}, {
				name: 'YX-CSS-ToolKit',
				theme: 'owl-theme'
			}, {
				name: 'Others',
				theme: 'owl-theme'
			}],
			siteHeaderFooterConfig = root.siteConfig && siteInfo.filter(function (site) {
				return root.siteConfig && site.name.toLowerCase() === root.siteConfig.name.toLowerCase();
			})[0] || siteInfo[siteInfo.length - 1];

	// Auto init HeaderFooter
	if (siteHeaderFooterConfig)
	{
		new HeaderFooter(HeaderFooter.TYPE_OPTIONS[siteHeaderFooterConfig.theme]);
	}
})(window);