loadScript('https://gyx8899.github.io/YX-WebThemeKit/theme-header-footer/header-footer.js', headerFooterOwlCallback);
function headerFooterOwlCallback(type, options, config)
{
	if (headerFooterOwlCallbackCustom)
	{
		headerFooterOwlCallbackCustom();
	}
	else
	{
		type = type || 'owl';
		$.applyHeaderFooter(type, options, config);
	}
}