(function () {
	var siteInfo = [{
		name: 'YX-JS-ToolKit',
		pathNameRoot: 'YX-JS-ToolKit',
		trackID: 'UA-104315567-1'
	}, {
		name: 'YX-WebThemeKit',
		pathNameRoot: 'YX-WebThemeKit',
		trackID: 'UA-104315567-2'
	}],
		currentSiteInfo = siteInfo.filter(function (site) {
		return site.pathNameRoot === document.location.pathname.split('/')[1];
	})[0],
		pathName = document.location.pathname,
		page = document.location.href;
	if (currentSiteInfo && pathName.indexOf(currentSiteInfo.pathNameRoot.toLowerCase() + '/') > -1)
	{
		page = pathName.replace('/' + currentSiteInfo.pathNameRoot + '/', '')
				.replace('/index.html', '')
				.replace('.html', '');
		page = page || currentSiteInfo.name; // set default page name
	}
	(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
	  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
	  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
	  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
	ga('create', currentSiteInfo.trackID, 'auto');
	ga('send', 'pageview', page);
})();