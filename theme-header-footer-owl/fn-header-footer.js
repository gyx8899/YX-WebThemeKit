var defaultData = {
	html: ['owl.html'],
	css: ["owl.css"],
	js: [],
	themeData: {
		title: '',
		menuItems: '',
		author: 'Steper Kuo',
		rootLink: '',
		authorLink: 'mailto:gyx8899@126.com'
	},
	replacement: ["title", "menuItems", "authorLink", "author", "rootLink"]
};
function applyTheme(themeData)
{
	initDefaultData();

	defaultData.themeData = $.extend({}, defaultData.themeData, themeData);

	loadLinkCSS(defaultData.css);
	loadScritJS(defaultData.js);
	loadThemeHTML(defaultData.html[0]);
}
function initDefaultData()
{
	// Init theme links
	var rootLink = getParentPathOffSubTrial(getScriptURLWithFileName('header-footer.js'), 'header-footer.js');
	defaultData.themeData.rootLink = rootLink;
	defaultData.html = processorResource(rootLink, defaultData.html);
	defaultData.css = processorResource(rootLink, defaultData.css);
	defaultData.js = processorResource(rootLink, defaultData.js);

	// Init data from page
	var element = document.querySelector('meta[name="author"]');
	defaultData.themeData.author = element && element.getAttribute("content");
	defaultData.themeData.title = $('title').text();
}
function processorResource(rootLink, resourceArray)
{
	for (var i = 0, length = resourceArray.length; i < length; i++)
	{
		resourceArray[i] = rootLink + resourceArray[i];
	}
	return resourceArray;
}
function loadThemeHTML(url)
{
	$.ajax({
		url: url,
		success: function (data)
		{
			getTemplate(data);
		}
	});
}
function getTemplate(data)
{
	var sourceHtml = $('<textarea />').text(data.toString()).val();
	replaceTag('header', sourceHtml);
	replaceTag('footer', sourceHtml);
}
function replaceTag(tag, sourceHTML)
{
	var tagHTMLArray = regExpG("<" + tag + ".*(?=)(.|\n)*?</" + tag + ">").exec(sourceHTML),
			tagTemplate = tagHTMLArray && tagHTMLArray[0];
	tagTemplate && applyData(tag, tagTemplate);
}
function applyData(tag, template)
{
	var comment = "<!-- " + tag + " -->", tagHTML = replaceDataArray(template, defaultData.replacement, defaultData.themeData);
	if ($(tag).length > 0)
	{
		$(tag).remove();
	}
	if ($('main').length > 0)
	{
		if (tag == 'header')
		{
			$('main').before(comment + tagHTML);
		}
		else
		{
			$('main').after(comment + tagHTML);
		}
	}
	else
	{
		if (tag == 'header')
		{
			$('body').prepend(comment + tagHTML);
		}
		else
		{
			$('body').append(comment + tagHTML);
		}
	}

}
function replaceDataArray(template, placeholders, themeData)
{
	var resultTemplate = template, dataItem;
	for (var i = 0, length = placeholders.length; i < length; i++)
	{
		dataItem = placeholders[i];
		resultTemplate = resultTemplate.replace(regExpG("{{" + dataItem + "}}"), themeData[dataItem] || '');
	}
	return resultTemplate;
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
function getParentPathOffSubTrial(url, subTrial)
{
	return url.replace(subTrial, '');
}
function getScriptURLWithFileName(jsFileName)
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