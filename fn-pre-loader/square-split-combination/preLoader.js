loadCSS('https://gyx8899.github.io/YX-WebThemeKit/fn-pre-loader/square-split-combination/preLoader.css');
var preloader = document.createElement("div");
preloader.id = 'preloader';
preloader.innerHTML = '<div class="loader"><span></span><span></span><span></span><span></span></div>';
setTimeout(function()
{
	document.body.appendChild(preloader);
}, 0);
window.onload = function ()
{
	document.getElementById('preloader').style.display = "none";
};