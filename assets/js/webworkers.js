const call = (method, params) => {
	let callMethod = (callers, thisArg) => {
		let caller = callers.shift();
		thisArg = (thisArg ? thisArg : this)[caller];
		if (callers.length > 0)
		{
			thisArg = callMethod(callers, thisArg);
		}
		return thisArg;
	};
	return new Promise((resolve) => {
		let callers = method.split('.');
		params = Array.isArray(params) ? params : [params];
		let result = callMethod(callers)(...params);
		resolve(result);
	});
};

const applyMethod = (data) => {
	let {method, params, scripts} = data;
	scripts && importScripts.apply(this, scripts);
	return call(method, params);
};

class Event {
	constructor(options)
	{
		this._cache = {};
	}

	static getInstance(options)
	{
		if (!this.instance)
		{
			this.instance = new Event(options);
		}
		return this.instance;
	}

	on(eventName, callback)
	{
		if (!this._cache[eventName])
		{
			this._cache[eventName] = [];
		}

		if (typeof callback === 'function' && this._cache[eventName].indexOf(callback) === -1)
		{
			this._cache[eventName].push(callback);
		}
		else
		{
			typeof callback !== 'function' && alert(`Your added callback ${callback} is not one valid function.`);
			this._cache[eventName].indexOf(callback) !== -1 && alert(`Same on(eventName, callback) have been called!`);
		}
		return this;
	}

	off(eventName, callback)
	{
		let eventCallbacks = this._cache[eventName];
		if (Array.isArray(eventCallbacks) && eventCallbacks.length)
		{
			if (callback)
			{
				eventCallbacks.splice(eventCallbacks.indexOf(callback), 1);
			}
			else
			{
				eventCallbacks.length = 0;
			}
		}
		return this;
	}

	trigger(eventName, data)
	{
		let eventCallbacks = this._cache[eventName];
		if (eventCallbacks && eventCallbacks.length)
		{
			eventCallbacks.forEach((callback) => {
				callback(data);
			});
		}
		return this;
	}
}

// WebWorker
onmessage = function (e) {
	let {method, params, scripts, callback, isClose} = e.data;
	applyMethod({method, params, scripts})
			.then((result) => {
				postMessage({result: result, callback: callback});
				isClose && close();
			});
};

// ShareWorker
let ports = [];

onconnect = function (e) {
	let port = e.ports[0];
	let portsEvent = Event.getInstance();

	ports.push(port);
	port.start();

	port.onmessage = function (e) {
		let {type, event, message, method, params, scripts, callback} = e.data;
		if (type === 'apply')
		{
			applyMethod({method, params, scripts})
					.then((result) => {
						port.postMessage({event: event, message: result, callback: callback});
					});
		}
		else if (type === 'post')
		{
			portsEvent.trigger(event, {event: event, message: message});
		}
		else if (type === 'get')
		{
			portsEvent.on(event, (msgObj) => {
				port.postMessage(msgObj);
			});
		}
	}
};