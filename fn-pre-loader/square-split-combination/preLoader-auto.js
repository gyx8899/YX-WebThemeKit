loadScriptResource('https://gyx8899.github.io/YX-WebThemeKit/fn-pre-loader/preLoader.js', loadPreLoaderCallback);

function loadPreLoaderCallback()
{
	// Instance PreLoader immediately
	return new PreLoader({
		loaderHTML: true,
		loaderHTMLInfo: {
			// content: '<div class="loader-container"><div class="loader"><span></span><span></span><span></span><span></span></div></div>'  // element or html string
			content: '<div class="loader"><span></span><span></span><span></span><span></span></div>'  // element or html string
		},
		resources: ['https://gyx8899.github.io/YX-WebThemeKit/fn-pre-loader/square-split-combination/preLoader.css']
	});
}

function loadScriptResource(url, callback, context)
{
	if (!url)
		return;

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
	document.body.appendChild(script);
}