'use strict';

/**
 * Javascript plugin: PreviewCode v2.4
 *
 * Setting in html tag:
 * 1. Required:
 * 1.1 data-toggle="previewCode"
 * 1.2 data-target="#[targetId]" (element querySelector, append preview code to target element)
 *
 * 2. Optional:
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
 *  2.8 hasClass
 *  2.9 addClass
 *  2.10 removeClass
 *  2.11 toggleClass
 * */
(function (global) {

	global.PreviewCode = function (elements, options) {
		this.options = deepExtend({}, PreviewCode.DEFAULTS, options);

		var that = this,
				urls = [that.options.highlight.css, that.options.highlight.js].concat(that.options.highlight.others);
		loadResources(urls, function () {
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
		var elementArray = getElements(elements || document.querySelectorAll('[data-toggle="previewCode"]'));
		elementArray.forEach(function (element) {
			previewElementCode(element);
		});
	};

	// Functions: init Highlight
	function initHighlight()
	{
		hljs.configure({tabReplace: '  '});
		// hljs.initHighlightingOnLoad();
	}

	function highlightCode(codeElement)
	{
		hljs.highlightBlock(codeElement.querySelector('pre code'));
	}

	// Functions: Process code
	function previewElementCode(element)
	{
		var dataTargetValue = element.getAttribute('data-target'),
				targetElement = dataTargetValue === 'self' ? element : document.querySelector(dataTargetValue),
				previewPosition = element.getAttribute('data-position') || 'append',
				previewFetch = element.getAttribute('data-fetch'),
				previewHTML = getPreviewElementHTML(element),
				previewTitle = getPreviewTitle(element),
				elementTag = element.tagName.toLowerCase(),
				elementLink = '';
		if (previewFetch === 'file')
		{
			if (elementTag === 'script')
			{
				elementLink = element.src;
			}
			else if (elementTag === 'link')
			{
				elementLink = element.href;
			}
			else if (element.getAttribute('data-src'))
			{
				elementLink = element.getAttribute('data-src');
			}
		}
		else
		{
			if (elementTag === 'script' && element.src || elementTag === 'link' && element.href)
			{
				previewHTML = filterTagAttrData(element.outerHTML);
			}
		}
		var positionInfo = {
			parentElement: targetElement,
			position: previewPosition,
			isCollapsed: element.getAttribute('data-collapse') === 'on'
		};
		if (elementLink)
		{
			getFileContent(elementLink, function (data) {
				addPreviewCode(positionInfo, data, getFileNameFromURL(elementLink).baseName);
			}, null);
		}
		else
		{
			addPreviewCode(positionInfo, previewHTML, previewTitle);
		}
	}

	function addPreviewCode(positionInfo, codeString, demoTitle)
	{
		var codeContent = trimPrevSpace(escapeHTML(codeString)),
				codeElement = document.createElement('div'),
				previewTitle = demoTitle === '' ? '' : '<div class="preview-title">' + '<span>' + demoTitle + '</span>' + '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAiBAMAAADIaRbxAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAbUExURQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJRR4iAAAAAIdFJOUwF5q/XXRBg3BwRgrQAAAGRJREFUKBVjYBiSoEQA7uwUBTBTohEmwuZhAGYydQhAhVKaAyAsDagiNg9TqBRMEVwJAwNEEUIJAwNEEZISiCJkJRBFKEpAilCVgBSJwNwCdQCDRgfMLTARJnQlDAziMLmhSAMAhrURVl4zt/IAAAAASUVORK5CYII=">' + '</div>';
		codeElement.className = "preview-code";
		codeElement.innerHTML = previewTitle + '<pre><code>' + codeContent + '</code></pre>';

		if (positionInfo.isCollapsed)
		{
			addClass(codeElement, 'collapse');
		}

		var previewCodeElement = addElement(positionInfo.parentElement, codeElement, positionInfo.position);
		demoTitle !== '' && bindClickEvent(previewCodeElement, '.preview-title');
		highlightCode(previewCodeElement);
	}

	function filterTagAttrData(tagStr)
	{
		var tagStrArray1 = tagStr.split('>');
		if (tagStrArray1.length < 2)
		{
			return tagStr;
		}
		var attrDataStr = tagStrArray1[0].split(' ').filter(function (t) {
			return t.indexOf('data-') === -1;
		}).join(' ');

		return [attrDataStr].concat(tagStrArray1.slice(1)).join('>');
	}

	function getPreviewTitle(element)
	{
		var previewTitle = element.getAttribute('data-title');
		if (previewTitle === 'false')
		{
			previewTitle = '';
		}
		else if (!previewTitle)
		{
			var elementTag = element.tagName.toLowerCase();
			if (elementTag === 'style' || elementTag === 'link')
			{
				previewTitle = 'CSS';
				var href = element.getAttribute('href');
				if (elementTag === 'link' && href !== null)
				{
					previewTitle = getFileNameFromURL(href).name;
				}
			}
			else if (elementTag === 'script')
			{
				previewTitle = 'JS';
				var src = element.getAttribute('src');
				if (src !== null)
				{
					previewTitle = getFileNameFromURL(src).name;
				}
			}
			else
			{
				previewTitle = 'HTML';
			}
		}
		return previewTitle;
	}

	function getPreviewElementHTML(element)
	{
		var previewCodeElement = element.cloneNode(true),
				elementHTML = '';

		if (previewCodeElement.getAttribute('data-tag') === 'show')
		{
			delete previewCodeElement.dataset['toggle'];
			delete previewCodeElement.dataset['target'];
			delete previewCodeElement.dataset['title'];
			delete previewCodeElement.dataset['position'];
			delete previewCodeElement.dataset['fetch'];
			delete previewCodeElement.dataset['collapse'];
			delete previewCodeElement.dataset['tag'];
			elementHTML = previewCodeElement.outerHTML;
		}
		else
		{
			elementHTML = previewCodeElement.innerHTML;
		}
		return elementHTML;
	}

	function trimPrevSpace(str)
	{
		var strArray = str.split('\n'),
				beginIndex = getFirstNonSpaceValueIndex(strArray),
				resultStr = '';
		if (beginIndex !== -1)
		{
			var newStrArray = [],
					reverseStrArray = strArray.slice(0).reverse(),
					endIndex = strArray.length - getFirstNonSpaceValueIndex(reverseStrArray),
					commonPreSpace = /(^\s*)/g.exec(strArray[beginIndex])[0];
			for (var i = beginIndex, j = 0; i < endIndex; i++)
			{
				newStrArray[j++] = strArray[i].replace(commonPreSpace, '');
			}
			resultStr = newStrArray.join('\n');
		}
		return resultStr;
	}

	function getFirstNonSpaceValueIndex(array)
	{
		for (var i = 0, l = array.length; i < l; i++)
		{
			// Filter space line
			if (/^[\s|\t]+$/.test(array[i]) === false && array[i] !== '')
			{
				return i;
			}
		}
		return -1;
	}

	function bindClickEvent(parentElement, selector)
	{
		parentElement.querySelector(selector).addEventListener('click', function () {
			toggleClass(parentElement, 'collapse');
		});
	}
})(window);

//# sourceMappingURL=previewCode.js.map