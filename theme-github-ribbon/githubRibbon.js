/**!
 * GitHub ribbon plugin v2.1.0.180720_beta | https://github.com/gyx8899/YX-WebThemeKit/tree/master/theme-github-ribbon
 * Copyright (c) 2018 Kate Kuo @Steper
 */
(function (global, YX) {
	let githubAuthor = "gyx8899",
			ribbonConfig = [{
				name: 'YX-JS-ToolKit',
				repo: 'YX-JS-ToolKit'
			}, {
				name: 'YX-WebThemeKit',
				repo: 'YX-WebThemeKit'
			}, {
				name: 'YX-CSS-ToolKit',
				repo: 'YX-CSS-ToolKit'
			}],
			siteRibbonConfig = ribbonConfig.filter((site) => {
				return site.name.toLowerCase() === global.siteConfig.name.toLowerCase();
			})[0],
			githubLink = document.createElement('a'),
			githubRibbon = document.createElement('div');

	githubLink.setAttribute('id', 'githubRibbonId');
	githubLink.setAttribute('target', '_blank');
	githubLink.setAttribute('href', 'https://github.com/' + githubAuthor + '/' + siteRibbonConfig.repo);
	githubLink.setAttribute('style', 'display: block;position: relative;text-decoration: none;text-align: center;font-weight: bold;overflow: hidden;background: rgb(243, 117, 0);color: rgb(255, 255, 255);line-height: 30px;font-size: 12px;text-shadow: rgba(0, 0, 0, 0.3) 2px 0px 21px;transform: rotate(45deg);box-shadow: rgba(0, 0, 0, 0.8) 2px 2px 8px;width: 260px;transition: 0.5s;');
	githubRibbon.setAttribute('style', 'position: fixed; top: -70px; right: -70px; width: 260px; height: 260px; z-index: 9999; display: flex; align-items: center;');
	githubLink.innerHTML = 'Fork me on GitHub';
	githubRibbon.innerHTML = githubLink.outerHTML;

	document.body.appendChild(githubRibbon);

	// Set hover style and hide github ribbon when window.width < 768px
	YX.Util.element.insertStyleToHead('#githubRibbonId:hover{background: rgb(204, 17, 17) !important;}@media (max-width: 767px){#githubRibbonId{display: none !important;}}');
})(window, window.YX);