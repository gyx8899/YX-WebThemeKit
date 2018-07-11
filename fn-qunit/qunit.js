/**
 * Qunit integrate plugin v2.0.0.180508_beta
 */
(function (YX) {
	let qUnitFolder = document.createElement('div');
	qUnitFolder.innerHTML = '<div id="qunit"></div><div id="qunit-fixture"></div>';
	document.body.insertBefore(qUnitFolder, document.body.firstChild);

	YX.Util.load.loadCSS('https://code.jquery.com/qunit/qunit-2.4.1.css');
	YX.Util.load.loadScript('https://code.jquery.com/qunit/qunit-2.4.1.js', function () {
		let paramQUnit = siteConfig.queryParams.qunit;
		let testFileName = (paramQUnit === 'true' || paramQUnit === '') ? 'test.js' : (paramQUnit.indexOf('.js') > 0 ? paramQUnit : (paramQUnit + '.js'));
		YX.Util.load.loadScript(YX.Util.url.getRootPath() + '/' + testFileName);
	});
})(window.YX);