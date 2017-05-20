loadCSS('https://gyx8899.github.io/YX-WebThemeKit/fn-pre-loader/square-split-combination/preLoader.css');
setTimeout(function ()
{
	$('body').prepend('<div id="preloader"><div class="loader"><span></span><span></span><span></span><span></span></div></div>');
});

$(document).ready(function ()
{
	completePreLoader();
});
function completePreLoader()
{
	setTimeout(function ()
	{
		$('#preloader').remove();
	});
}