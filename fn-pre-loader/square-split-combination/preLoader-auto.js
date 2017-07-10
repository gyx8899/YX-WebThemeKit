var preLoaderJSUrl = 'https://gyx8899.github.io/YX-WebThemeKit/fn-pre-loader/square-split-combination/preLoader.js';
loadScript(preLoaderJSUrl, preLoaderCallback);

function preLoaderCallback()
{
	new PreLoader({
		content: '<div class="loader"><span></span><span></span><span></span><span></span></div>',
		resourcesUrls: ['https://gyx8899.github.io/YX-WebThemeKit/fn-pre-loader/square-split-combination/preLoader.css']
	});
}
function loadScript(url, callback, context)
{
	if (!url)
		return;

	var script = document.createElement("script");
	script.type = "text/javascript";

	if (script.readyState)
	{  //IE
		script.onreadystatechange = function ()
		{
			if (script.readyState == "loaded" ||
					script.readyState == "complete")
			{
				script.onreadystatechange = null;
				callback && (context ? context[callback]() : callback());
			}
		};
	}
	else
	{  //Others
		script.onload = function ()
		{
			callback && (context ? context[callback]() : callback());
		};
	}

	script.src = url;
	setTimeout(function ()
	{
		document.body.appendChild(script);
	}, 0);
}
