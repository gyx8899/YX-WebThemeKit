(function () {
	var qUnitFolder = document.createElement('div');
	qUnitFolder.innerHTML = '<div id="qunit"></div><div id="qunit-fixture"></div>';
	document.body.insertBefore(qUnitFolder, document.body.firstChild);

	loadCSS('https://code.jquery.com/qunit/qunit-2.4.1.css');
	loadScript('https://code.jquery.com/qunit/qunit-2.4.1.js', function () {
		loadScript(getRootPath() + '/test.js');
	});
})();