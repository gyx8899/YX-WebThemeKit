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
	var cleanCode = $.trim(escapeHTML(codeString)),
			codeTemplate = '<h3 class="h3-title">' + demoTitle + '</h3><pre><code>' + cleanCode + '</code></pre>';
	$codeParent.append(codeTemplate);
}
function previewAll($codeParent, $demoHTML, $demoCSS, $demoJS, titleHTML, titleCSS, titleJS)
{
	$codeParent && previewCode($codeParent, $demoHTML, titleHTML || 'HTML');
	$demoCSS && previewCode($codeParent, $demoCSS, titleCSS || 'CSS');
	$demoJS && previewCode($codeParent, $demoJS, titleJS || 'JS');
}
