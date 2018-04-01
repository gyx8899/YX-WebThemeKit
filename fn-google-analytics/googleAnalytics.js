'use strict';

(function () {
	var googleAnalyticsConfig = [{
				name: 'YX-JS-ToolKit',
				trackID: 'UA-104315567-1'
			}, {
				name: 'YX-WebThemeKit',
				trackID: 'UA-104315567-2'
			}, {
				name: 'YX-CSS-ToolKit',
				trackID: 'UA-104315567-3'
			}],
			siteGoogleAnalyticsConfig = googleAnalyticsConfig.filter(function (site) {
				return site.name.toLowerCase() === siteConfig.name.toLowerCase();
			})[0],
			pathName = document.location.pathname,
			page = pathName.replace('/' + pathName.split('/')[1] + '/', '').replace('/index.html', '').replace('index.html', '').replace('.html', '') || siteGoogleAnalyticsConfig.name; // Default page name

	(function (i, s, o, g, r, a, m) {
		i['GoogleAnalyticsObject'] = r;
		i[r] = i[r] || function () {
			(i[r].q = i[r].q || []).push(arguments);
		}, i[r].l = 1 * new Date();
		a = s.createElement(o), m = s.getElementsByTagName(o)[0];
		a.async = 1;
		a.src = g;
		m.parentNode.insertBefore(a, m);
	})(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');
	ga('create', siteGoogleAnalyticsConfig.trackID, 'auto');
	ga('send', 'pageview', page);
})();

//# sourceMappingURL=googleAnalytics.js.map