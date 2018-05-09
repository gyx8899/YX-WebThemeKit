/**
 * Fixed Toolbar Plugin v2.0.0.180509_beta
 * Auto add toolbar on bottom right;
 */
(function (YX) {
	YX.Util.load.loadCSS('https://gyx8899.github.io/YX-WebThemeKit/theme-fixed-toolbar/fixedToolbar.css', initFixedToolbar);

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
		item.href = '#';
		item.style.display = "none";
		item.style.backgroundColor = "#1ccacd";

		let img = document.createElement('img');
		img.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAADOUlEQVR4Xu3cTWrbUBiF4auuIRR3VApdRKehXUmtgr0Ky6uwoUpX0pJpFlEIHdWUrKEqApsKI1tX1v15P/tkmujq3PP4k+QEp3D6QjVQoNIojBMI7EUgEIHAGoDF0YQIBNYALI4mRCCwBmBxNCECgTUAi6MJEQisAVgcTYhAYA3A4mhCBAJrABZHEyIQWAOwOJoQgYRvoGmau3bVoihewq+edkXzE9I0zRvn3I99bR+LovidtsKwZzMNMp/P39Z1/d05935fy8+yLD89PDz8CltTutXMguwxHp1z747qei7L8t4qikmQMxgHG7Mo5kA8MEyjmAIZgWEWxQzIBRgmUUyATMAwh4IH8cR43jd//MTVfQAzcaNHg/hitI+5bfN1Xfc9BptCwYKMwTi857jkmHRv+fzOhASZUuyUY/0qi/tTOJAQhYZYI27tp1dHgYQsMuRaKXEwIDEKjLFmbBwESMziYq4dAyc7SIrCUpwjFE5WkJRFpTzXFJxsIDkKynHOsThZQHIWk/PcPjjJQQiFEDKcwkkKQiqClKWLkwyEWAAxUxIQ4sYPr0patuggtA33XbtJGaOCkDY69IRDyRoNhLLBIYju9wmZo4AQNjYGgoQSHMQyBuFGHxTkGjByowQDuSaMnChBQK4RIxfKZJBrxsiBMgnkFjBSo1wMcksYKVEuArlFjFQoo0FuGSMFyigQYfx/Tx+rC2+QWAEu/RUH4bgYnXiBxDgxodAQGUJ3MwiyWCxebzabp55Pu3b3Y+KzFyEApvw9Zblcfthut3/O5RgEqarq1Wq1+uqc+3xioZvGGHGj/7Zer79UVfV3Ekh78BkUYXTaPXP58sJolxqckMP5elCE0fNS70HxxhgFcjQp95b/W0Kse0nP5evR5zLVzeM9Id1J2e12d0M3p9ibpq/fPgzNZrOXoXvG8T5Gg9CLsJ5PIDBBgQgE1gAsjiZEILAGYHE0IQKBNQCLowkRCKwBWBxNiEBgDcDiaEIEAmsAFkcTIhBYA7A4mhCBwBqAxdGECATWACyOJkQgsAZgcTQhAoE1AIujCREIrAFYHE2IQGANwOJoQgQCawAWRxMiEFgDsDiaEBjIP7OC4YMmwR/OAAAAAElFTkSuQmCC";

		item.appendChild(img);

		let that = this;
		window.onscroll = function () {
			YX.Util.tool.throttle(isShowScrollToTop, that);
		};

		return item;

		function scrollToTop()
		{
			let cosParameter = window.scrollY / 2,
					scrollCount = 0,
					oldTimestamp = performance.now();

			function step(newTimestamp)
			{
				scrollCount += Math.PI / (300 / (newTimestamp - oldTimestamp));
				if (scrollCount >= Math.PI)
				{
					window.scrollTo(0, 0);
				}
				if (window.scrollY === 0)
				{
					return;
				}
				window.scrollTo(0, Math.round(cosParameter + cosParameter * Math.cos(scrollCount)));
				oldTimestamp = newTimestamp;
				window.requestAnimationFrame(step);
			}

			window.requestAnimationFrame(step);
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
})(window.YX);