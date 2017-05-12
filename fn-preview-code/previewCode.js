function escapeHtml(text)
{
	var map = {
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		'"': '&quot;',
		"'": '&#039;'
	};

	return text.replace(/[&<>"']/g, function (m)
	{
		return map[m];
	});
}
function previewCode($codeParent, $demoCode, demoTitle)
{
	var codeString = $demoCode.html(),
			cleanCode = $.trim(escapeHtml(codeString)),
	codeTemplate = '<h3 class="h3-title">' + demoTitle + '</h3><pre><code>' + cleanCode + '</code></pre>';
	$codeParent.append(codeTemplate);
}
function previewAll($codeParent, $demoHTML, $demoCSS, $demoJS, titleHTML, titleCSS, titleJS)
{
	$codeParent && previewCode($codeParent, $demoHTML, titleHTML || 'HTML');
	$demoCSS && previewCode($codeParent, $demoCSS, titleCSS || 'CSS');
	$demoJS && previewCode($codeParent, $demoJS, titleJS || 'JS');
}
