let CACHE_NAME = 'YX-WebThemeKit-180407',
		urlsToCache_static = [
			'./',
			'./assets/img/apple-icon-152x152.png',
			'./assets/img/favicon-16x16.png'
		],
		urlsToCache_data = [
			'./assets/js/yx-theme-config.js'
		],
		cacheWhiteList = [
			'urlsToCache_static',
			'urlsToCache_data'
		];

self.addEventListener('install', function (event) {
	console.log('ServiceWorker installed!');

	// Preform install steps
	event.waitUntil(
			caches.open(CACHE_NAME)
					.then(cache => cache.addAll(urlsToCache_static))
					.then(() => self.skipWaiting())
	);
});

self.addEventListener('activate', function (event) {
	console.log('ServiceWorker activate! Ready to start serving content');

	event.waitUntil(
			caches.keys().then(function (cacheNames) {
				return Promise.all(
						cacheNames.map(function (cacheName) {
							if (cacheWhiteList.indexOf(cacheName) === -1)
							{
								return caches.delete(cacheName);
							}
						})
				);
			}).then(() => self.clients.claim())
	);
});

self.addEventListener('fetch', function (event) {
	console.log('ServiceWorker fetch resources: ');

	event.respondWith(
			caches.match(event.request)
					.then(function (response) {
						// Cache hint, return response
						return response ||
								fetch(event.request.clone()).then(function (response) {
									if (!response || response.status !== 200 || response.type !== 'basic')
									{
										return response;
									}
									let responseClone = response.clone();
									caches.open(CACHE_NAME)
											.then(function (cache) {
												cache.put(event.request, responseClone).then(() => {
													return response;
												});
											});
									return response;
								});
					})
	);
});

self.addEventListener('push', function (event) {
	let title = 'Receive a message.',
			body = 'message body!',
			icon = '/assets/img/favicon.png',
			tag = '';
	event.waitUntil(
			self.registration.showNotification(title, {
				body: body,
				icon: icon,
				tag: tag
			})
	);
});