(function (global) {
	let disqusLibUrl = "https://{{sitename}}.disqus.com/embed.js",
			disqusConfig = [{
				name: 'YX-JS-ToolKit'
			}, {
				name: 'YX-WebThemeKit'
			}, {
				name: 'YX-CSS-ToolKit'
			}],

			siteDisqusConfig = disqusConfig.filter(function (site) {
				return site.name.toLowerCase() === siteConfig.name.toLowerCase();
			})[0],
			libUrl = disqusLibUrl.replace('{{sitename}}', siteDisqusConfig.name),
			libName = "Disqus";

	siteDisqusConfig['data-timestamp'] = new Date().getTime();

	global.disqus_config = function () {
		this.page.url = window.location.href;
		this.page.identifier = window.location.pathname;
	};

	let disqusElement = document.createElement('div');
	disqusElement.className = 'row';
	disqusElement.innerHTML = '<div class="columns"><div id="disqus_thread"></div></div>';
	document.body.querySelector('main').appendChild(disqusElement);

	loadScript(libUrl, null, null, {attributes: siteDisqusConfig, libName: libName});
})(window);
