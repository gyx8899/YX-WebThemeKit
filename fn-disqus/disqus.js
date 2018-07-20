/**!
 * Disqus v2.1.0.180720_beta | https://github.com/gyx8899/YX-WebThemeKit/tree/master/fn-disqus
 * Copyright (c) 2018 Kate Kuo @Steper
 */
(function (global, YX) {
	let disqusLibUrl = "https://{{sitename}}.disqus.com/embed.js",
			disqusConfig = [{
				name: 'YX-JS-ToolKit'
			}, {
				name: 'YX-WebThemeKit'
			}, {
				name: 'YX-CSS-ToolKit'
			}],

			siteDisqusConfig = disqusConfig.filter((site) => {
				return site.name.toLowerCase() === siteConfig.name.toLowerCase();
			})[0],
			libUrl = disqusLibUrl.replace('{{sitename}}', siteDisqusConfig.name),
			libName = "Disqus";

	siteDisqusConfig['data-timestamp'] = Date.now();

	global.disqus_config = () => {
		this.page = this.page || {};
		this.page.url = window.location.href;
		this.page.identifier = window.location.pathname;
	};

	let disqusElement = document.createElement('div');
	disqusElement.className = 'row';
	disqusElement.innerHTML = '<div class="columns"><div id="disqus_thread"></div></div>';
	document.body.querySelector('main').appendChild(disqusElement);

	YX.Util.load.loadScript(libUrl, null, null, {attributes: siteDisqusConfig, libName: libName, isAsync: true});
})(window, window.YX);
