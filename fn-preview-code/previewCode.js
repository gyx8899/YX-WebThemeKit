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
			getFileContent(fileSrc, function (data)
			{
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
			spaceLength = /(^\s*)/g.exec(strArray[1])[0].length,
			numberOfLineBreaks = (str.match(/\n/g) || []).length,
			newStrArray = [];
	for (var i = 1, l = numberOfLineBreaks; i < l; i++)
	{
		newStrArray[i - 1] = strArray[i].slice(spaceLength);
	}
	return newStrArray.join('\n');
}

function previewAll($codeParent, $demoHTML, $demoCSS, $demoJS, titleHTML, titleCSS, titleJS)
{
	$codeParent && previewCode($codeParent, $demoHTML, titleHTML || 'HTML');
	$demoCSS && previewCode($codeParent, $demoCSS, titleCSS || 'CSS');
	$demoJS && previewCode($codeParent, $demoJS, titleJS || 'JS');
}
