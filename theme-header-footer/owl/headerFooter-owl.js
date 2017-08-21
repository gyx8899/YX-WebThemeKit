loadScript('https://gyx8899.github.io/YX-WebThemeKit/theme-header-footer/headerFooter.js', headerFooterOwlCallback);
function headerFooterOwlCallback()
{
	var options = {
		// fileName with relative path
		html: 'owl/owl.html',
		css: ["owl/owl.css"],
		js: ["owl/owl.js"],
		themeData: {
			title: document.querySelector('title').text,
			menuItems: '',
			path: '',
			author: 'Steper Kuo',
			authorLink: 'mailto:gyx8899@126.com'
		}
	};
	new HeaderFooter(options);
}