'use strict';

/**
 * Qunit integrate plugin v2.0.0.180404_beta
 */
(function (YX) {
	var qUnitFolder = document.createElement('div');
	qUnitFolder.innerHTML = '<div id="qunit"></div><div id="qunit-fixture"></div>';
	document.body.insertBefore(qUnitFolder, document.body.firstChild);

	YX.Util.load.loadCSS('https://code.jquery.com/qunit/qunit-2.4.1.css');
	YX.Util.load.loadScript('https://code.jquery.com/qunit/qunit-2.4.1.js', function () {
		YX.Util.load.loadScript(getRootPath() + '/test.js');
	});
})(window.YX);

//# sourceMappingURL=qunit.js.map