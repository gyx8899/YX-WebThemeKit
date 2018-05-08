'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * PreviewCode Plugin v3.0.2.180507_beta
 *
 * Setting in html tag:
 * 1. Required:
 * 1.1 data-toggle="previewCode"
 *
 * 2. Optional:
 * 2.0 data-target="#[targetId]" // default with not set, and it will be current element. or element querySelector, append preview code to target element)
 * 2.1 data-title="titleAboveCode" // "false" will not show title
 * 2.2 data-position="append"(default), "prepend", "insertBefore", "insertAfter"
 * 2.3 data-fetch="file" //Available for <script>-src and <link>-href, fetch file content; (default not fetch file)
 * 2.4 data-src="url" // set url to load script/style in current element
 * 2.5 data-collapse="on" // set collapse on, default collapse off
 * 2.6 data-tag="show" // show the wrapper tag, default not show (For data-fetch not set)
 *
 * Support: Any html tag, especially support <link> with href, <script> with src;
 *
 * Dependency:
 * 1. highlight, https://highlightjs.org/
 * 2. common.js, for loading resource file (https://gyx8899.github.io/YX-JS-ToolKit/assets/js/common.js)
 *  2.1 loadResources
 *  2.2 getFileNameFromURL
 *  2.3 deepExtend
 *  2.4 escapeHTML
 *  2.5 getFileContent
 *  2.6 addElement
 *  2.7 getElements
 *  2.8 addClass
 *  2.9 toggleClass
 * */
(function (root, factory) {
	if (typeof define === 'function' && define.amd) {
		define(['yx'], factory);
		// define(['jquery', 'underscore'], factory);
	} else if ((typeof module === 'undefined' ? 'undefined' : _typeof(module)) === 'object' && module.exports) {
		module.exports = factory(require('yx'));
		// module.exports = factory(require('jquery'), require('underscore'));
	} else {
		root.PreviewCode = factory(root.YX);
		// root.PreviewCode = factory(root.jQuery, root._);
	}
})(window, function (YX) {

	var PreviewCode = function PreviewCode(elements, options) {
		this.options = YX.Util.tool.deepExtend({}, PreviewCode.DEFAULTS, options);

		var that = this,
		    urls = [that.options.highlight.css, that.options.highlight.js].concat(that.options.highlight.others);
		YX.Util.load.loadResources(urls, function () {
			that._init(elements);
		});
	};

	PreviewCode.DEFAULTS = {
		highlight: {
			css: 'https://gyx8899.github.io/YX-WebThemeKit/fn-preview-code/previewCode.css',
			js: 'https://gyx8899.github.io/YX-WebThemeKit/fn-preview-code/highlight.js',
			others: []
		},
		initHighlight: initHighlight
	};

	PreviewCode.prototype._init = function (elements) {
		this.options.initHighlight();
		var elementArray = YX.Util.element.getElements(elements || document.querySelectorAll('[data-toggle="previewCode"]'));
		elementArray.forEach(function (element) {
			previewElementCode(element);
		});
	};

	// Functions: init Highlight
	function initHighlight() {
		hljs.configure({ tabReplace: '  ' });
		// hljs.initHighlightingOnLoad();
	}

	function highlightCode(codeElement) {
		hljs.highlightBlock(codeElement.querySelector('pre code'));
	}

	// Functions: Process code
	function previewElementCode(element) {
		var dataTargetValue = element.getAttribute('data-target'),
		    targetElement = !dataTargetValue ? element : document.querySelector(dataTargetValue),
				previewPosition = !dataTargetValue && !element.getAttribute('data-position') ? 'replace' : element.getAttribute('data-position') || 'append',
		    previewFetch = element.getAttribute('data-fetch'),
		    previewHTML = getPreviewElementHTML(element),
		    previewTitle = getPreviewTitle(element),
		    elementTag = element.tagName.toLowerCase(),
		    elementLink = '';
		if (previewFetch === 'file') {
			if (elementTag === 'script') {
				elementLink = element.src;
			} else if (elementTag === 'link') {
				elementLink = element.href;
			} else if (element.getAttribute('data-src')) {
				elementLink = element.getAttribute('data-src');
			}
		} else {
			if (elementTag === 'script' && element.src || elementTag === 'link' && element.href) {
				previewHTML = filterTagAttrData(element.outerHTML);
			}
		}
		var positionInfo = {
			parentElement: targetElement,
			position: previewPosition,
			isCollapsed: element.getAttribute('data-collapse') === 'on'
		};
		if (elementLink) {
			YX.Util.load.getFileContent(elementLink, function (data) {
				addPreviewCode(positionInfo, data, YX.Util.url.getFileNameFromURL(elementLink).baseName);
			}, null);
		} else {
			addPreviewCode(positionInfo, previewHTML, previewTitle);
		}
	}

	function addPreviewCode(positionInfo, codeString, demoTitle) {
		var codeContent = trimPrevSpace(YX.Util.string.escapeHTML(codeString)),
		    codeElement = document.createElement('div'),
		    previewTitle = demoTitle === '' ? '' : '<div class="preview-title">' + '<span>' + demoTitle + '</span>' + '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAiBAMAAADIaRbxAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAbUExURQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJRR4iAAAAAIdFJOUwF5q/XXRBg3BwRgrQAAAGRJREFUKBVjYBiSoEQA7uwUBTBTohEmwuZhAGYydQhAhVKaAyAsDagiNg9TqBRMEVwJAwNEEUIJAwNEEZISiCJkJRBFKEpAilCVgBSJwNwCdQCDRgfMLTARJnQlDAziMLmhSAMAhrURVl4zt/IAAAAASUVORK5CYII=">' + '</div>';
		codeElement.className = "preview-code";
		codeElement.innerHTML = previewTitle + '<pre><code>' + codeContent + '</code></pre>';

		if (positionInfo.isCollapsed) {
			YX.Util.element.addClass(codeElement, 'collapse');
		}

		var previewCodeElement = YX.Util.element.addElement(positionInfo.parentElement, codeElement, positionInfo.position);
		demoTitle !== '' && bindClickEvent(previewCodeElement, '.preview-title');
		highlightCode(previewCodeElement);
	}

	function filterTagAttrData(tagStr) {
		var tagStrArray1 = tagStr.split('>');
		if (tagStrArray1.length < 2) {
			return tagStr;
		}
		var attrDataStr = tagStrArray1[0].split(' ').filter(function (t) {
			return t.indexOf('data-') === -1;
		}).join(' ');

		return [attrDataStr].concat(tagStrArray1.slice(1)).join('>');
	}

	function getPreviewTitle(element) {
		var previewTitle = element.getAttribute('data-title');
		if (previewTitle === 'false') {
			previewTitle = '';
		} else if (!previewTitle) {
			var elementTag = element.tagName.toLowerCase();
			if (elementTag === 'style' || elementTag === 'link') {
				previewTitle = 'CSS';
				var href = element.getAttribute('href');
				if (elementTag === 'link' && href !== null) {
					previewTitle = YX.Util.url.getFileNameFromURL(href).name;
				}
			} else if (elementTag === 'script') {
				previewTitle = 'JS';
				var src = element.getAttribute('src');
				if (src !== null) {
					previewTitle = YX.Util.url.getFileNameFromURL(src).name;
				}
			} else {
				previewTitle = 'HTML';
			}
		}
		return previewTitle;
	}

	function getPreviewElementHTML(element) {
		var previewCodeElement = element.cloneNode(true),
		    elementHTML = '';

		if (previewCodeElement.getAttribute('data-tag') === 'show') {
			delete previewCodeElement.dataset['toggle'];
			delete previewCodeElement.dataset['target'];
			delete previewCodeElement.dataset['title'];
			delete previewCodeElement.dataset['position'];
			delete previewCodeElement.dataset['fetch'];
			delete previewCodeElement.dataset['collapse'];
			delete previewCodeElement.dataset['tag'];
			elementHTML = previewCodeElement.outerHTML;
		} else {
			elementHTML = previewCodeElement.innerHTML;
		}
		return elementHTML;
	}

	function trimPrevSpace(str) {
		var strArray = str.split('\n'),
		    beginIndex = getFirstNonSpaceValueIndex(strArray),
		    resultStr = '';
		if (beginIndex !== -1) {
			var newStrArray = [],
			    reverseStrArray = strArray.slice(0).reverse(),
			    endIndex = strArray.length - getFirstNonSpaceValueIndex(reverseStrArray),
			    commonPreSpace = /(^\s*)/g.exec(strArray[beginIndex])[0];
			for (var i = beginIndex, j = 0; i < endIndex; i++) {
				newStrArray[j++] = strArray[i].replace(commonPreSpace, '');
			}
			resultStr = newStrArray.join('\n');
		}
		return resultStr;
	}

	function getFirstNonSpaceValueIndex(array) {
		for (var i = 0, l = array.length; i < l; i++) {
			// Filter space line
			if (/^[\s|\t]+$/.test(array[i]) === false && array[i] !== '') {
				return i;
			}
		}
		return -1;
	}

	function bindClickEvent(parentElement, selector) {
		parentElement.querySelector(selector).addEventListener('click', function () {
			YX.Util.element.toggleClass(parentElement, 'collapse');
		});
	}

	return PreviewCode;
});

/**
 * Auto previewCode if previewCode.js?auto=true
 */
(function () {
	if (YX && YX.Util.url.getUrlQueryParams(getScriptName())['auto'] === 'true')
	{
		setTimeout(function () {
			new PreviewCode();
		});
	}

	/**
	 * getScriptName
	 * @return {*}
	 */
	function getScriptName()
	{
		var error = new Error(),
				source = void 0,
				lastStackFrameRegex = new RegExp(/.+\/(.*?):\d+(:\d+)*$/),
				currentStackFrameRegex = new RegExp(/getScriptName \(.+\/(.*):\d+:\d+\)/);

		if (error.stack && (source = lastStackFrameRegex.exec(error.stack.trim())) && source.length > 1 && source[1] !== "") return source[1];
		else if (error.stack && (source = currentStackFrameRegex.exec(error.stack.trim()))) return source[1];
		else if (error['fileName'] !== undefined) return error['fileName'];
	}
})();

//# sourceMappingURL=previewCode.js.map