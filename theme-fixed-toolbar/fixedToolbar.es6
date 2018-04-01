(function () {
	loadCSS('https://gyx8899.github.io/YX-WebThemeKit/theme-fixed-toolbar/fixedToolbar.css', initFixedToolbar);

	function initFixedToolbar()
	{
		let toolbar = document.createElement('div');
		toolbar.className = 'ui-toolbar';

		let toolItems = document.createElement('ul');
		toolItems.className = 'tool-list';
		toolItems.appendChild(toolbarItem(scrollToTopItem()));

		toolbar.appendChild(toolItems);
		document.body.appendChild(toolbar);
	}

	function toolbarItem(itemElement)
	{
		let toolItem = document.createElement('li');
		toolItem.className = 'tool-item';

		toolItem.appendChild(itemElement);
		return toolItem;
	}

	function scrollToTopItem()
	{
		let item = document.createElement('a');
		item.className = 'item-scroll-top';
		item.href = 'javascript: void(0);';
		item.style.display = "none";

		let img = document.createElement('img');
		img.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAGgSURBVHhe7dVNauNAEIBRM2cIA7PK3Qw2voVPkmtlE8hVZtTQxQjHUWSr9df9HhQktiNT9S1yAAAAAAAAAADqdT6fX9LkX1nT6XT608V4T5N+zi+zhuPx+NqF+Ojmb56P9Fp+myXlGJ+9GDGfoixsIEaMKEsZESNGlLk9ECNGlLk8ESNGlNImxIgRpZSRMdL7P35GlInGxkife+Sz+fE84pkDizKTKYcVpbASBxWlkJKHFGWiOQ4oypPmPJwoD1riYKKMtOShRPnBGgcS5RtrHkaUG1s4iCjZlg7RfJQtHqDZKFtevLkoe1i4mSh7WrT6KHtcsNooe16suig1LFRNlGoW6ex+l5pihN3uVGOMsLvdao4RdrNjCzHC5ndtKUbY7M4txgib273lGGEzNxDjv9VvIcZXq91EjO8tfpvL5fI7PfDmC26nyRhhbJR0y/wnz7ter7+6h73dPLw/TccII6K8pVvmj08zEEWMnoEo5WKEO1HEuONOlPIxQi+KGAN6UeaLEdIXFPnnVLl0o9ljAAAAAAAAAAAAAAAAAEMOh3+vasvzIz6WPgAAAABJRU5ErkJggg==";

		item.appendChild(img);

		let that = this;
		window.onscroll = function () {
			throttle(isShowScrollToTop, that);
		};

		return item;

		function scrollToTop()
		{
			let scrollTopValue = document.documentElement.scrollTop || document.body.scrollTop;
			if (scrollTopValue > 0)
			{
				// window.requestAnimationFrame(scrollToTop);
				// window.scrollTo(0, scrollTopValue - scrollTopValue / 8);
				$('html, body').animate({scrollTop: 0}, 300);
			}
		}

		function throttle(method, context)
		{
			if (method.tId)
			{
				clearTimeout(method.tId);
			}
			method.tId = setTimeout(function () {
				method.call(context);
			}, 100);
		}

		function isShowScrollToTop()
		{
			let scrollTopValue = document.documentElement.scrollTop || document.body.scrollTop,
					scrollTopItem = document.querySelector('.ui-toolbar .item-scroll-top');
			if (scrollTopValue > 150)
			{
				scrollTopItem.style.display = "list-item";
				scrollTopItem.onclick = scrollToTop;
			}
			else
			{
				scrollTopItem.style.display = "none";
				scrollTopItem.onclick = null;
			}
		}
	}
})();