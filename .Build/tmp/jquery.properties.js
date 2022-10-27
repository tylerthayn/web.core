/**
* @module @tyler.thayn/jquery.properties
*/
define('jquery.properties', ['jquery'], ($) => {
	let dataFn = $.fn.data

	/** data-change event
	* @event jQuery#data-change
	* @type {object}
	* @property {string} name - data property name that changed
	*/
	$.fn.extend({
		/** Gets or Sets Element property
		* @memberof jQuery#
		* @function Property
		* @param {string|object} name - Property name or object of properties
		* @param {*|function} [value] - Property value.  If function, it is added as listener
		* @returns {*} [value] - Property value
		*/
		Property: function (name, value) {
			if (typeof name === 'string') {
				if (typeof value === 'undefined') {
					return this.data(name)
				} else if (value instanceof Function) {
					this.each((i, e) => {
						$(e).on('data-change', (event, data) => {
							if (Reflect.has(data, name)) {
								value.call(this, data[name], name)
							}
						})
					})
				} else {
					this.each((i, e) => {
						$(e).data(name, value)
					})
				}
			} else if (typeof name === 'object') {
				this.each((i, e) => {
					Object.keys(name).forEach(key => {
						$(e).data(key, name[key])
					})
				})
			}
		},
		/** Data
		* @fires jQuery#data-change
		*/
		data: function (key, value) {
			if (typeof key === 'undefined') {
				return dataFn.call($(this[0]))
			}
			if (typeof key === 'string' && typeof value === 'undefined') {
				return dataFn.call($(this[0]), key)
			}
			let ret = dataFn.call(this, key, value)
			if (typeof key === 'object') {
				this.triggerHandler('data-change', key)
			} else if (typeof value !== 'undefined') {
				let d = {}
				d[key] = value
				this.triggerHandler('data-change', d)
			}
			return ret
		}
	})

})
