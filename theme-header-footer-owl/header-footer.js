var defaultThemeData = {
	siteName: 'Site Name',
	menuItems: '',
	author: 'Steper',
	rootLink: '',
	html: ['index.html'],
	css: ["header-footer.css"],
	js:[]
};
function applyTheme(themeTemplateData)
{
	initDefaultData();

	var themeData = $.extend({}, defaultThemeData, themeTemplateData);

	loadLinkCSS(themeData.css);
	loadScritJS(themeData.js);
	loadThemeHTML(themeData.html[0], themeData);
}
function initDefaultData()
{
	var rootLink = getParentPath(getCurrentJSURL('header-footer.js'), 'header-footer.js');
	defaultThemeData.rootLink = rootLink;
	defaultThemeData.html = processorResource(rootLink, defaultThemeData.html);
	defaultThemeData.css = processorResource(rootLink, defaultThemeData.css);
	defaultThemeData.js = processorResource(rootLink, defaultThemeData.js);
}
function processorResource(rootLink, resourceArray)
{
	for(var i = 0, length = resourceArray.length; i < length; i++)
	{
		resourceArray[i] = rootLink + resourceArray[i];
	}
	return resourceArray;
}
function loadThemeHTML(url, themeData)
{
	$.ajax({
		url: url,
		success: function (data)
		{
			getTemplate(data, themeData);
		}
	});
}
function getTemplate(data, themeData)
{
	var sourceHtml = $('<textarea />').text(data.toString()).val();
	applyHeader(sourceHtml, themeData);
	applyFooter(sourceHtml, themeData);
}
function applyHeader(sourceHtml, themeData)
{
	// <header></header>
	var headerHTMLArray = regExpG("<header.*(?=)(.|\n)*?</header>").exec(sourceHtml),
			headerTemplate = headerHTMLArray && headerHTMLArray[0];
	if (headerTemplate)
	{
		var comment = "<!-- header -->",
				headerHTML = headerTemplate.replace(regExpG("{{header-site-name}}"), themeData.siteName)
						.replace(regExpG("{{header-menu-items}}"), themeData.menuItems)
						.replace(regExpG("{{root-link}}"), themeData.rootLink);
		if ($('header').length > 0)
		{
			$('header').remove();
		}
		$('body').prepend(comment + headerHTML);
	}
}
function applyFooter(sourceHtml, themeData)
{
	// <footer></footer>
	var footerHTMLArray = regExpG("<footer.*(?=)(.|\n)*?</footer>").exec(sourceHtml),
			footerTemplate = footerHTMLArray && footerHTMLArray[0];
	if (footerTemplate)
	{
		var comment = "<!-- footer -->",
				footerHTML = footerTemplate.replace("{{footer-connect-name}}", themeData.author)
						.replace(regExpG("{{root-link}}"), themeData.rootLink);
		if ($('footer').length > 0)
		{
			$('footer').remove();
		}
		$('body').append(comment + footerHTML);
	}
}
function loadLinkCSS(linkArray)
{
	for (var i = 0, length = linkArray.length; i < length; i++)
	{
		loadCSS(linkArray[i]);
	}
}
function loadScritJS(scriptArray)
{
	for (var i = 0, length = scriptArray.length; i < length; i++)
	{
		loadScript(scriptArray[i]);
	}
}
function regExpG(expStr)
{
	return new RegExp(expStr, "g");
}
function getParentPath(url, subTrial)
{
	return url.replace(subTrial, '');
}
function getCurrentJSURL(jsFileName)
{
	var scripts = document.getElementsByTagName("script");

	for (var i = 0; i < scripts.length; i++)
	{
		var script = scripts.item(i);

		if (script.src && script.src.match(jsFileName))
		{
			return script.src;
		}
	}
}
function loadCSS(url, callback)
{
	var link = document.createElement('link');
	link.rel = 'stylesheet';
	link.type = 'text/css';
	link.href = url;
	link.onload = function ()
	{
		callback && callback();
	};
	link.onerror = function ()
	{
		console.log("Error load css:" + url);
	};
	document.getElementsByTagName('head')[0].appendChild(link);
}
function loadScript(url, callback)
{
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
				callback && callback();
			}
		};
	}
	else
	{  //Others
		script.onload = function ()
		{
			callback && callback();
		};
	}

	script.src = url;
	document.body.appendChild(script);
}