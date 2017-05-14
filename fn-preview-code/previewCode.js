loadCSS('https://gyx8899.github.io/YX-WebThemeKit/fn-preview-code/previewCode.css');
loadScript('https://gyx8899.github.io/YX-WebThemeKit/fn-preview-code/highlight.js');

function previewCode($codeParent, $demoCode, demoTitle)
{
	var codeString = $demoCode.html(),
			cleanCode = $.trim(escapeHTML(codeString)),
	codeTemplate = '<h3 class="h3-title">' + demoTitle + '</h3><pre><code>' + cleanCode + '</code></pre>';
	$codeParent.append(codeTemplate);
}
function previewAll($codeParent, $demoHTML, $demoCSS, $demoJS, titleHTML, titleCSS, titleJS)
{
	$codeParent && previewCode($codeParent, $demoHTML, titleHTML || 'HTML');
	$demoCSS && previewCode($codeParent, $demoCSS, titleCSS || 'CSS');
	$demoJS && previewCode($codeParent, $demoJS, titleJS || 'JS');
}
