/**
 * Javascript plugin: PreviewCode v2.4
 *
 * Setting in html tag:
 * 1. Required:
 * 1.1 data-toggle="previewCode"
 * 1.2 data-target="#[targetId]" (append preview code to target)
 *
 * 2. Optional:
 * 2.1 data-title="titleAboveCode" // "false" will not show title
 * 2.2 data-position="append"(default), "prepend", "insertBefore", "insertAfter"
 * 2.3 data-fetch="file" //Available for <script>-src and <link>-href, fetch file content; (default not fetch file)
 * 2.4 data-src="url" // set url to load script/style in current element
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
 *  2.6 addChildElement
 *  2.7 getElements
 *  2.8 hasClass
 *  2.9 addClass
 *  2.10 removeClass
 * */
(function () {

	this.PreviewCode = function (elements, options) {
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
				previewHTML = element.innerHTML,
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
			if ((elementTag === 'script' && element.src) || (elementTag === 'link' && element.href))
			{
				previewHTML = filterTagAttrData(element.outerHTML);
			}
		}
		var positionInfo = {parentElement: targetElement, position: previewPosition};
		if (elementLink)
		{
			getFileContent(elementLink, function (data) {
				addPreviewCode(positionInfo, data, getFileNameFromURL(elementLink));
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
				previewTitle = '<div class="preview-title">' +
						'<span>' + demoTitle + '</span>' +
						'<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAiBAMAAADIaRbxAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAbUExURQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJRR4iAAAAAIdFJOUwF5q/XXRBg3BwRgrQAAAGRJREFUKBVjYBiSoEQA7uwUBTBTohEmwuZhAGYydQhAhVKaAyAsDagiNg9TqBRMEVwJAwNEEUIJAwNEEZISiCJkJRBFKEpAilCVgBSJwNwCdQCDRgfMLTARJnQlDAziMLmhSAMAhrURVl4zt/IAAAAASUVORK5CYII=">' +
						'</div>';
		codeElement.className = "preview-code";
		codeElement.innerHTML = previewTitle + '<pre><code>' + codeContent + '</code></pre>';

		addChildElement(positionInfo.parentElement, codeElement, positionInfo.position);
		bindClickEvent(codeElement, '.preview-title');
		highlightCode(codeElement);
	}

	function filterTagAttrData(tagStr)
	{
		var tagStrArray1 = tagStr.split('>');
		if (tagStrArray1.length < 2)
		{
			return tagStr;
		}
		var attrDataStr = tagStrArray1[0].split(' ').filter(function (t) {
			return (t.indexOf('data-') === -1);
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
					previewTitle = getFileNameFromURL(href);
				}
			}
			else if (elementTag === 'script')
			{
				previewTitle = 'JS';
				var src = element.getAttribute('src');
				if (src !== null)
				{
					previewTitle = getFileNameFromURL(src);
				}
			}
			else
			{
				previewTitle = 'HTML';
			}
		}
		return previewTitle;
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
})();