if ('serviceWorker' in navigator)
{
	let registerSW = () => {
		let pathNameRoot = siteConfig.pathNameRoot ? siteConfig.pathNameRoot + '/' : '',
				commonPath = window.location.origin + '/' + pathNameRoot,
				swPath = commonPath + 'service-worker.js',
				swScope = '/' + pathNameRoot;
		navigator.serviceWorker.register(swPath, {scope: swScope})
				.then(function (registration) {
					// Registration successful
					console.log('ServiceWorker registration successful with scope: ', registration.scope);

					// updatefound is fired if service-worker.js changes.
					registration.onupdatefound = function () {
						// The updatefound event implies that reg.installing is set;
						// see https://w3c.github.io/ServiceWorker/#service-worker-registration-updatefound-event
						var installingWorker = registration.installing;
						installingWorker.onstatechange = function () {
							switch (installingWorker.state)
							{
								case 'installed':
									const notificationOption = (title, body, isReload, otherOptions = {}) => {
										return {
											tag: isReload ? 'reload-window' : '',
											title: title,
											body: body,
											icon: commonPath + 'assets/img/ms-icon-310x310.png',
											registration: registration,
											...otherOptions
										}
									};
									const spopOption = (title, body, isReload, otherOptions = {}) => {
										return {
											template: `<div ${isReload ? 'onclick="javascript:window.location.reload();"' : ''}>${title ? '<h4 class="spop-title">${title}</h4>' : ''}${body}</div>`,
											position: 'top-center',
											style: 'info',
											...otherOptions
										}
									};
									if (navigator.serviceWorker.controller)
									{
										// At this point, the old content will have been purged and the fresh content will have been added to the cache.
										// It's the perfect time to display a "New content is available; please refresh." message in the page's interface.
										console.log('New or updated content is available.');

										const infoTitle = 'Received Amazing Feature';
										const infoBody = '"New Feature, click to refresh Page!';
										YX.Util.event.notification(notificationOption(infoTitle, infoBody, true), spopOption('', infoBody, true));
									}
									else
									{
										// At this point, everything has been precached. It's the perfect time to display a "Content is cached for offline use." message.
										console.log('Content is now available offline!');

										const infoTitle = 'Ah!';
										const infoBody = 'Content is now available offline!';
										YX.Util.event.notification(notificationOption(infoTitle, infoBody, null, {autoclose: 3000}), spopOption('', infoBody, null, {autoclose: 3000}));
									}
									break;

								case 'redundant':
									console.error('The installing service worker became redundant.');
									const infoTitle = 'Ah!';
									const infoBody = 'Content is redundant!';
									YX.Util.event.notification(notificationOption(infoTitle, infoBody, null, {autoclose: 3000}), spopOption('', infoBody, null, {autoclose: 3000}));
									break;
							}
						};
					};
				})
				.catch(function (err) {
					// Registration failed
					console.log('ServiceWorker registration failed: ', err);
					const infoTitle = 'Ah!';
					const infoBody = 'ServiceWorker registration failed!';
					YX.Util.event.notification(notificationOption(infoTitle, infoBody, null, {autoclose: 3000}), spopOption('', infoBody, null, {autoclose: 3000}));
				});
		navigator.serviceWorker.addEventListener('message', (event) => {
			if (!event.data)
			{
				return;
			}

			switch (event.data)
			{
				case 'reload-window':
					window.location.reload();
					break;
				default:
					// NOOP
					break;
			}
		});
	};
	if (document.readyState !== "complete")
	{
		window.addEventListener('load', registerSW);
	}
	else
	{
		registerSW();
	}
}