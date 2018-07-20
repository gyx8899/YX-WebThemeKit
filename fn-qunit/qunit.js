/**!
 * Qunit integrate plugin v2.1.0.180720_beta | https://github.com/gyx8899/YX-WebThemeKit/tree/master/fn-qunit
 * Copyright (c) 2018 Kate Kuo @Steper
 */
(function (YX) {
	let qUnitFolder = document.createElement('div');
	qUnitFolder.innerHTML = '<div id="qunit"></div><div id="qunit-fixture"></div>';
	document.body.insertBefore(qUnitFolder, document.body.firstChild);

	YX.Util.load.loadCSS('https://code.jquery.com/qunit/qunit-2.4.1.css');
	YX.Util.load.loadScript('https://code.jquery.com/qunit/qunit-2.4.1.js', () => {
		let paramQUnit = siteConfig.queryParams.qunit;
		let testFileName = (paramQUnit === 'true' || paramQUnit === '') ? 'test.js' : (paramQUnit.indexOf('.js') > 0 ? paramQUnit : (paramQUnit + '.js'));
		YX.Util.load.loadScript(YX.Util.url.getRootPath() + '/' + testFileName);
	});
})(window.YX);