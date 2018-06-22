let Collection = (function() {
	try {
		localStorage.setItem('name', 'John');
		localStorage.removeItem('name');
	} catch (e) {
		throw new Error('LocalStorage is not supported');
	}

	// function createUID() {
	// 	return (
	// 		'id-' +
	// 		Math.random()
	// 			.toString(36)
	// 			.substr(2, 16)
	// 	);
	// }

	function _isObject(data) {
		return Object.prototype.toString.call(data) === '[object Object]';
	}

	function _isArray(data) {
		return Object.prototype.toString.call(data) === '[object Array]';
	}

	function _isString(data) {
		return typeof data === 'string';
	}

	function _isFunction(data) {
		return typeof data === 'function';
	}

	class Collection {
		constructor(name) {
			if (!name) {
				throw new Error('name is required.');
			} else if (!_isString(name)) {
				throw new Error('name should be string');
			} else {
				this.name = name;
			}
		}

		save(data, cb) {
			let items = [];
			let name = this.name;
			let storedItems = localStorage.getItem(name);

			if (!cb) {
				throw new Error('cb is required.');
			}

			if (!_isFunction(cb)) {
				throw new Error('cb should be a function.');
			}

			if (!_isObject(data)) {
				cb('data should be an object.', null);
				return;
			}

			if (!storedItems) {
				Object.defineProperty(data, '_id', {
					enumerable: true,
					configurable: false,
					writable: false,
					value: data._id
				});

				items.push(data);
				localStorage.setItem(name, JSON.stringify(items));
				cb(null, data);
			} else {
				items = JSON.parse(storedItems);

				Object.defineProperty(data, '_id', {
					enumerable: true,
					configurable: false,
					writable: false,
					value: data._id
				});

				items.push(data);
				localStorage.setItem(name, JSON.stringify(items));
				cb(null, data);
			}
		}

		saveAll(data, cb) {
			let items = [];
			let newItems = [];
			let name = this.name;
			let storedItems = localStorage.getItem(name);

			if (!cb) {
				throw new Error('cb is required.');
			}

			if (!_isFunction(cb)) {
				throw new Error('cb should be a function.');
			}

			if (!_isArray(data)) {
				cb('data should be an array.', null);
				return;
			}

			if (!storedItems) {
				newItems = data;
				newItems.forEach(item => {
					Object.defineProperty(item, '_id', {
						enumerable: true,
						configurable: false,
						writable: false,
						value: item._id
					});
					items.push(item);
				});
				localStorage.setItem(name, JSON.stringify(items));
				cb(null, items);
			} else {
				items = JSON.parse(storedItems);

				newItems = data.filter(function(item) {
					return !items.some(function(item2) {
						return item._id == item2._id;
					});
				});
				newItems.forEach(item => {
					Object.defineProperty(item, '_id', {
						enumerable: true,
						configurable: false,
						writable: false,
						value: item._id
					});
					items.push(item);
				});

				localStorage.setItem(name, JSON.stringify(items));
				cb(null, items);
			}
		}

		findAll(cb) {
			let name = this.name;
			let storedItems = localStorage.getItem(name);

			if (!cb) {
				throw new Error('cb is required.');
			}

			if (!_isFunction(cb)) {
				throw new Error('cb should be a function.');
			}

			if (!storedItems) {
				cb('there is no collection in the store', null);
			} else {
				cb(null, JSON.parse(storedItems));
			}
		}

		findById(id, cb) {
			let name = this.name;
			let storedItems = JSON.parse(localStorage.getItem(name));
			let items;

			if (!cb) {
				throw new Error('cb is required.');
			}

			if (!_isFunction(cb)) {
				throw new Error('cb should be a function.');
			}

			if (!_isString(id)) {
				cb('id should be a string.', null);
				return;
			}

			if (_isArray(storedItems) && storedItems.length) {
				items = storedItems.filter(item => {
					return item._id === id;
				});
			}

			if (items && items.length) {
				cb(null, items[0]);
			} else {
				cb('there is no item with an id matching with ' + id, null);
			}
		}

		update(data, cb) {
			let name = this.name;
			let storedItems = localStorage.getItem(name);
			let items;
			let updated;

			if (!cb) {
				throw new Error('cb is required.');
			}

			if (!_isFunction(cb)) {
				throw new Error('cb should be a function.');
			}

			if (!_isObject(data)) {
				cb('data should be an object.', null);
				return;
			} else if (!data._id) {
				cb('data should have an id', null);
				return;
			} else {
				updated = data;
			}

			if (!storedItems) {
				cb('there is no collection in the store', null);
				return;
			} else {
				items = JSON.parse(storedItems);
			}

			if (_isArray(items) && items.length) {
				items.forEach((item, index) => {
					if (item._id === updated._id) {
						items.splice(index, 1, updated);
					}
				});
			}

			localStorage.setItem(name, JSON.stringify(items));
			cb(null, updated);
		}

		remove(id, cb) {
			let name = this.name;
			let storedItems = JSON.parse(localStorage.getItem(name));
			let len;

			if (!cb) {
				throw new Error('cb is required.');
			}

			if (!_isFunction(cb)) {
				throw new Error('cb should be a function.');
			}

			if (!_isString(id)) {
				cb('id should be a string.', null);
				return;
			}

			if (!storedItems) {
				cb('there is no collection in the store', null);
				return;
			} else {
				if (_isArray(storedItems)) {
					len = storedItems.length;
				} else {
					len = 0;
				}
			}

			if (len > 0) {
				storedItems.forEach((item, index) => {
					if (item._id === id) {
						storedItems.splice(index, 1);
						localStorage.setItem(name, JSON.stringify(storedItems));
					}
				});
			}

			if (len > storedItems.length) {
				cb(null, true);
			} else {
				cb('There is no item with an id matching ' + id, null);
			}
		}
	}

	return Collection;
})();
