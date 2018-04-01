(function () {
	let owlTheme = {
				url: 'https://gyx8899.github.io/YX-WebThemeKit/theme-header-footer/headerFooter.js',
				options: {
					html: 'owl/owl.html',
					css: ["owl/owl.css"],
					js: ["owl/owl.js"],
					themeData: {
						title: document.querySelector('title').text,
						menuItems: '',
						path: '',
						author: 'Steper Kuo',
						authorLink: 'https://github.com/gyx8899'
					}
				}
			}, siteInfo = [{
				name: 'YX-JS-ToolKit',
				theme: owlTheme
			}, {
				name: 'YX-WebThemeKit',
				theme: owlTheme
			}, {
				name: 'YX-CSS-ToolKit',
				theme: owlTheme
			}, {
				name: 'Others',
				theme: owlTheme
			}],
			siteHeaderFooterConfig = siteInfo.filter(function (site) {
				return site.name.toLowerCase() === siteConfig.name.toLowerCase();
			})[0];

	loadScript(siteHeaderFooterConfig.theme.url, scriptLoadedCallback);

	function scriptLoadedCallback()
	{
		return new HeaderFooter(siteHeaderFooterConfig.theme.options);
	}
})();