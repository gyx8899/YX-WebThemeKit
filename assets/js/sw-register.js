if ('serviceWorker' in navigator)
{
	let registerSW = () => {
		let pathNameRoot = siteConfig.pathNameRoot ? siteConfig.pathNameRoot + '/' : '',
				commonPath = window.location.origin + '/' + pathNameRoot,
				swPath = commonPath + 'service-worker.js',
				swScope = '/' + pathNameRoot;
		const notificationOption = (title, body, isReload, otherOptions = {}) => {
			return {
				tag: isReload ? 'reload-window' : '',
				title: title,
				body: body,
				icon: commonPath + 'assets/img/ms-icon-310x310.png',
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
									if (navigator.serviceWorker.controller)
									{
										// At this point, the old content will have been purged and the fresh content will have been added to the cache.
										// It's the perfect time to display a "New content is available; please refresh." message in the page's interface.
										console.log('ServiceWorker installed!');}
									else
									{
										// At this point, everything has been precached. It's the perfect time to display a "Content is cached for offline use." message.
										console.log('Content is now available offline!');
									}
									break;

								case 'redundant':
									console.log('The installing service worker became redundant.');
									break;
							}
						};
					};
				})
				.catch(function (err) {
					// Registration failed
					console.log('ServiceWorker registration failed: ', err);
				});

		navigator.serviceWorker.addEventListener('message', (event) => {
			let message = JSON.parse(event.data);
			if (!message.type)
			{
				return;
			}

			switch (message.type)
			{
				case 'reload-window':
					window.location.reload();
					break;
				case 'refresh':
					// At this point, the old content will have been purged and the fresh content will have been added to the cache.
					// It's the perfect time to display a "New content is available; please refresh." message in the page's interface.
					var lastETag = localStorage.getItem(message.url);

					// [ETag](https://en.wikipedia.org/wiki/HTTP_ETag) header usually contains
					// the hash of the resource so it is a very effective way of check for fresh
					// content.

					if (lastETag !== message.eTag) {
						// Escape the first time (when there is no ETag yet)
						if (lastETag) {
							console.log('New or updated content is available.');
							// Inform the user about the update
							const infoTitle = 'Received Amazing Feature';
							const infoBody = `New Feature, click to refresh Page! ${message.url}`;
							YX.Util.event.notification(notificationOption(infoTitle, infoBody, true), spopOption('', infoBody, true));
						}
						// For teaching purposes, although this information is in the offline
						// cache and it could be retrieved from the service worker, keeping track
						// of the header in the `localStorage` keeps the implementation simple.
						localStorage.setItem(message.url, message.eTag);
					}
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