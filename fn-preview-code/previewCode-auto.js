loadScript('https://gyx8899.github.io/YX-WebThemeKit/fn-preview-code/previewCode.js', previewCodeCallback);
if (typeof previewCodeCallback !== "function")
{
	function previewCodeCallback($codeParent, $demoHTML, $demoCSS, $demoJS, titleHTML, titleCSS, titleJS)
	{
		$codeParent = $codeParent || $('#demoWrap');
		$demoHTML = $demoHTML || $('#demoHTML');
		$demoCSS = $demoCSS || $('#demoCSS');
		$demoJS = $demoJS || $('#demoJS');
		previewAll($codeParent, $demoHTML, $demoCSS, $demoJS, titleHTML, titleCSS, titleJS);
	}
}