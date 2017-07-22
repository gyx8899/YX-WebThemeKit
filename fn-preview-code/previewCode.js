loadCSS('https://gyx8899.github.io/YX-WebThemeKit/fn-preview-code/previewCode.css');
loadScript('https://gyx8899.github.io/YX-WebThemeKit/fn-preview-code/highlight.js');

function previewCode($codeParent, $demoCode, demoTitle)
{
	var demoCodeArray = !Array.isArray($demoCode) ? [$demoCode] : $demoCode;
	for (var i = 0; i < demoCodeArray.length; i++)
	{
		var fileSrc = $(demoCodeArray[i]).attr('src');
		if (fileSrc != null)
		{
			getFileContent(fileSrc, function (data) {
				addCodeTemplate($codeParent, data, getFileNameFromURL(fileSrc));
			}, null);
		}
		else
		{
			addCodeTemplate($codeParent, $(demoCodeArray[i]).html(), demoTitle);
		}
	}
}

function addCodeTemplate($codeParent, codeString, demoTitle)
{
	var cleanCode = trimPrevSpace(escapeHTML(codeString)),
			codeTemplate = '<h3 class="h3-title">' + demoTitle + '</h3><pre><code>' + cleanCode + '</code></pre>';
	$codeParent.append(codeTemplate);
}

function trimPrevSpace(str)
{
	var strArray = str.split('\n'),
			beginIndex = getFirstNoSpaceValueIndex(strArray),
			resultStr = '';
	if (beginIndex !== -1)
	{
		var newStrArray = [],
				reverseStrArray = strArray.slice(0).reverse(),
				endIndex = strArray.length - getFirstNoSpaceValueIndex(reverseStrArray),
				commonPreSpace = /(^\s*)/g.exec(strArray[beginIndex])[0];
		for (var i = beginIndex, j = 0; i < endIndex; i++)
		{
			newStrArray[j++] = strArray[i].replace(commonPreSpace, '');
		}
		resultStr = newStrArray.join('\n');
	}
	return resultStr;
}

function getFirstNoSpaceValueIndex(array)
{
	for (var i = 0, l = array.length; i < l; i++)
	{
		// Filter space line
		if (/^[\s|\t]+$/.test(array[i]) === false && array[i] != '')
		{
			return i;
		}
	}
	return -1;
}

function previewAll($codeParent, $demoHTML, $demoCSS, $demoJS, titleHTML, titleCSS, titleJS)
{
	$codeParent && previewCode($codeParent, $demoHTML, titleHTML || 'HTML');
	$demoCSS && previewCode($codeParent, $demoCSS, titleCSS || 'CSS');
	$demoJS && previewCode($codeParent, $demoJS, titleJS || 'JS');
}
