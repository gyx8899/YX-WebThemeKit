'use strict';

$(document).ready(function () {
	// responsive nav
	var responsiveNav = $('#toggle-nav');
	var navBar = $('.nav-bar');

	responsiveNav.on('click', function (e) {
		e.preventDefault();
		console.log(navBar);
		navBar.toggleClass('active');
	});

	// pseudo active
	if ($('#docs').length)
	{
		var sidenav = $('ul.side-nav').find('a');
		var url = window.location.pathname.split('/');
		url = url[url.length - 1];

		sidenav.each(function (i, e) {
			var active = $(e).attr('href');

			if (active === url)
			{
				$(e).parent('li').addClass('active');
				return false;
			}
		});
	}

	$('[data-image]').each(function (index, srcElement) {
		var dataImage = srcElement.getAttribute('data-image');
		if (dataImage)
		{
			srcElement.setAttribute('src', dataImage);
			srcElement.setAttribute('data-image', '');
		}
	});
});

//# sourceMappingURL=owl.js.map