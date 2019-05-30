let CACHE_NAME = 'V20190530-01',
		urlsToCache_static = [
			`./assets/img/android-icon-36x36.png`,
			`./fn-disqus/disqus.min.js`,
			`./fn-google-analytics/googleAnalytics.min.js`,
			`./fn-pre-loader/preLoader.min.js`,
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

self.addEventListener('fetch', function (event) {
	event.respondWith(
			caches.match(event.request).then(function (response) {
				// Cache hint, return response
				if (response)
				{
					console.log('[Service Worker] Cache hint resource: '+event.request.url);
					return response;
				}
				return fetch(event.request.clone()).then(function (response) {
					if (!response || response.status !== 200 || response.type !== 'basic') {
						return response;
					}
					// let responseClone = response.clone();
					// caches.open(CACHE_NAME)
					// 		.then(function (cache) {
					// 			cache.keys(event.request).then(function(keys) {
					// 				console.log('[Service Worker] cache: ' + keys.join(','));
					// 			});
					//
					// 			console.log('[Service Worker] Caching new resource: ' + event.request.url);
					// 			cache.put(event.request, responseClone).then(() => {
					// 				return response;
					// 			});
					// 		});
					return response;
				});
			})
	);
	// You can use `respondWith()` to answer ASAP...
	// event.respondWith(fromCache(event.request));

	event.waitUntil(
			update(event.request).then(refresh)
	);
});

self.addEventListener('push', function (event) {
	let title = 'Hei, you receive a message.',
			body = 'This is message body!',
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

self.addEventListener('notificationclick', function (event) {
	var messageId = event.notification.data;
	event.notification.close();

	if (event.notification.tag === 'reload-window')
	{
		self.clients.matchAll().then((clients) => {
			clients.forEach((client) => client.postMessage('reload-window'));
		});
	}
}, false);

// Open the cache where the assets were stored and search for the requested
// resource. Notice that in case of no matching, the promise still resolves
// but it does with `undefined` as value.
function fromCache(request) {
  return caches.open(CACHE_NAME).then(function (cache) {
    return cache.match(request);
  });
}

// Update consists in opening the cache, performing a network request and
// storing the new response data.
function update(request) {
	return caches.open(CACHE_NAME).then(function (cache) {
		// return cache.delete(request).then(function () {
			return fetch(request).then(function (response) {
				return cache.put(request, response.clone()).then(function () {
					return response;
				});
			// });
		});
	});
}

// Sends a message to the clients.
function refresh(response) {
	return self.clients.matchAll().then(function (clients) {
		clients.forEach(function (client) {
			// Encode which resource has been updated. By including the
			// [ETag](https://en.wikipedia.org/wiki/HTTP_ETag) the client can
			// check if the content has changed.
			var message = {
				type: 'refresh',
				url: response.url,
				// Notice not all servers return the ETag header. If this is not
				// provided you should use other cache headers or rely on your own
				// means to check if the content has changed.
				eTag: response.headers.get('ETag')
			};
			// Tell the client about the update.
			client.postMessage(JSON.stringify(message));
		});
	});
}