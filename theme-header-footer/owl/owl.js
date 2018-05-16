$(document).ready(function () {
	// responsive nav
	let responsiveNav = $('#toggle-nav');
	let navBar = $('.nav-bar');

	responsiveNav.on('click', function (e) {
		e.preventDefault();
		console.log(navBar);
		navBar.toggleClass('active')
	});

	// pseudo active
	if ($('#docs').length)
	{
		let sidenav = $('ul.side-nav').find('a');
		let url = window.location.pathname.split('/');
		url = url[url.length - 1];

		sidenav.each(function (i, e) {
			let active = $(e).attr('href');

			if (active === url)
			{
				$(e).parent('li').addClass('active');
				return false;
			}
		});
	}

	$('[data-image]').each((index, srcElement) => {
		let dataImage = srcElement.getAttribute('data-image');
		if (dataImage)
		{
			srcElement.setAttribute('src', dataImage);
			srcElement.setAttribute('data-image', '');
		}
	})
});