/**
 * Javascript plugin: PreviewCode v2.3
 *
 * Setting in html tag:
 * 1. Required:
 * 1.1 data-toggle="previewCode"
 * 1.2 data-target="#[targetId]" (append preview code to target)
 *
 * 2. Optional:
 * 2.1 data-title="titleAboveCode"
 * 2.2 data-position="append"(default), "prepend", "insertBefore", "insertAfter"
 * 2.3 data-fetch="file" //Available for <script>-src and <link>-href, fetch file content; (default not fetch file)
 *
 * Support: Any html tag, especially support <link> with href, <script> with src;
 *
 * Dependency:
 * 1. highlight, https://highlightjs.org/
 * 2. common.js, for loading resource file (https://gyx8899.github.io/YX-JS-ToolKit/asset/js/common.js)
 *
 * */
(function () {

	this.PreviewCode = function (elements, options) {
		this.options = deepExtend(PreviewCode.DEFAULTS, options);

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
		initHighlight: null
	};

	PreviewCode.prototype._init = function (elements) {
		if (elements)
		{
			if (elements.jquery)
			{
				elements = elements.length > 1 ? elements.get() : elements[0];
			}
			if (NodeList.prototype.isPrototypeOf(elements) || Array.isArray(elements))
			{
				for (var i = 0, l = elements.length; i < l; i++)
				{
					previewElementCode(elements[i]);
				}
			}
			else if (elements.nodeType)
			{
				previewElementCode(elements);
			}
		}
		else
		{
			Array.prototype.slice.call(document.querySelectorAll('[data-toggle="previewCode"]'))
					.forEach(function (element) {
						previewElementCode(element);
					});
		}

		if (this.options.initHighlight)
		{
			this.options.initHighlight();
		}
		else
		{
			initHighlight();
		}
	};

	// Functions: init Highlight
	function initHighlight()
	{
		hljs.configure({tabReplace: '  '});
		hljs.initHighlightingOnLoad();
	}

	// Functions: Process code
	function previewElementCode(element)
	{
		var targetElement = document.querySelector(element.getAttribute('data-target')),
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
		}
		else
		{
			if((elementTag === 'script' && element.src) || (elementTag === 'link' && element.href))
			{
				previewHTML = filterTagAttrData(element.outerHTML);
			}
		}
		if (elementLink)
		{
			getFileContent(elementLink, function (data) {
				var positionInfo = {parentElement: targetElement, position: previewPosition};
				addPreviewCode(positionInfo, data, getFileNameFromURL(elementLink));
			}, null);
		}
		else
		{
			var positionInfo = {parentElement: targetElement, position: previewPosition};
			addPreviewCode(positionInfo, previewHTML, previewTitle);
		}
	}

	function addPreviewCode(positionInfo, codeString, demoTitle)
	{
		var codeContent = trimPrevSpace(escapeHTML(codeString)),
				codeElement = document.createElement('div');
		codeElement.className = "preview-code";
		codeElement.innerHTML = '<h3 class="h3-title">' + demoTitle + '</h3><pre><code>' + codeContent + '</code></pre>';
		addChild(positionInfo.parentElement, positionInfo.position, codeElement);
	}

	function addChild(parentElement, position, childElement)
	{
		switch (position.toLowerCase()){
			case 'prepend':
				parentElement.insertBefore(childElement, parentElement.firstChild);
				break;
			case 'insertbefore':
				parentElement.insertAdjacentHTML('beforebegin', childElement.outerHTML);
				break;
			case 'insertafter':
				parentElement.insertAdjacentHTML('afterend', childElement.outerHTML);
				break;
			default: //'append'
				parentElement.appendChild(childElement);
		}
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
		if (!previewTitle)
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

	// Util Functions

	function escapeHTML(text)
	{
		var map = {
			'&': '&amp;',
			'<': '&lt;',
			'>': '&gt;',
			'"': '&quot;',
			"'": '&#039;'
		};

		return text.replace(/[&<>"']/g, function (m) {
			return map[m];
		});
	}

	function getFileContent(url, callback, context)
	{
		$.ajax({
			url: url,
			success: function (data) {
				callback && (context ? context[callback](data) : callback(data));
			}
		});
	}

	// Deep copy
	function deepExtend(out) // arguments: (source, source1, source2, ...)
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
})();