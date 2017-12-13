(function () {
	loadScript('https://gyx8899.github.io/YX-WebThemeKit/theme-header-footer/headerFooter.js', scriptLoadedCallback);

	function scriptLoadedCallback()
	{
		var options = {
			// fileName with relative path
			html: 'owl/owl.html',
			css: ["owl/owl.css"],
			js: ["owl/owl.js"],
			themeData: {
				title: document.querySelector('title').text,
				menuItems: '',
				path: '',
				author: 'Steper Kuo',
				authorLink: 'mailto:gyx8899@126.com'
			}
		};
		return new HeaderFooter(options);
	}

	function loadScript(url, callback, context)
	{
		var script = document.createElement("script");
		script.type = "text/javascript";

		if (script.readyState)
		{  //IE
			script.onreadystatechange = function () {
				if (script.readyState === "loaded" || script.readyState === "complete")
				{
					script.onreadystatechange = null;
					callback && (context ? context[callback]() : callback());
				}
			};
		}
		else
		{  //Others
			script.onload = function () {
				callback && (context ? context[callback]() : callback());
			};
		}

		script.src = url;
		document.body.appendChild(document.createComment(" Script HeaderFooter Theme *** JS "));
		document.body.appendChild(script);
	}
})();