(function () {
	var siteInfo = [{
				name: 'YX-JS-ToolKit',
				pathNameRoot: 'YX-JS-ToolKit',
				trackID: 'UA-104315567-1'
			}, {
				name: 'YX-WebThemeKit',
				pathNameRoot: 'YX-WebThemeKit',
				trackID: 'UA-104315567-2'
			}, {
				name: 'YX-CSS-ToolKit',
				pathNameRoot: 'YX-CSS-ToolKit',
				trackID: 'UA-104315567-3'
			}],
		pathName = document.location.pathname,
		currentSiteInfo = siteInfo.filter(function (site) {
			return site.pathNameRoot.toLowerCase() === pathName.split('/')[1].toLowerCase();
		})[0],
		page = document.location.href;
	if (currentSiteInfo)
	{
		page = pathName.replace('/' + pathName.split('/')[1] + '/', '')
				.replace('/index.html', '')
				.replace('index.html', '')
				.replace('.html', '')
				|| currentSiteInfo.name; // Default page name
	}
	else
	{
		currentSiteInfo = siteInfo[0];  // Default YX-JS-ToolKit
	}
	(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
	  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
	  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
	  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
	ga('create', currentSiteInfo.trackID, 'auto');
	ga('send', 'pageview', page);
})();