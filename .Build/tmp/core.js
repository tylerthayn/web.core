(function (factory) {
	if (typeof define === 'function' && define.amd) {
		define('@js/core', ['lodash'], factory)
	} else if (typeof module === 'object' && module.exports) {
		module.exports = factory(require('lodash'))
	} else {
		factory(_)
	}
}(function (_) {

	/**	
	 * @module @js/core	
	*/	
		
	/**	
	* Array class	
	* @summary [Array@MDN]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array}	
	* @class Array	
	* @global	
	* @type {array}	
	*/	
		
	/**	
	* Function class	
	* @summary [String@MDN]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function}	
	* @class Function	
	* @global	
	* @type {function}	
	*/	
		
	/**	
	* Object class	
	* @summary [Object@MDN]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object}	
	* @class Object	
	* @global	
	* @type {object}	
	*/	
		
	/**	
	* String class	
	* @summary [String@MDN]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String}	
	* @class String	
	* @global	
	* @type {string}	
	*/	
		
		
	/**	
	* global reference	
	* @global	
	* @name global	
	* @type {object}	
	*/	
	if (typeof global !== 'object') {	
		if (typeof window === 'object') {	
			window.global = window	
		} else {	
			this.global = this	
		}	
	}	
		
		
	const dataDesc = new Set(['configurable', 'enumerable', 'get', 'set'])	
	const accDesc = new Set(['configurable', 'enumerable', 'writable', 'value'])	
	const _define = (typeof Reflect !== 'undefined' && Reflect.defineProperty) ? Reflect.defineProperty : Object.defineProperty	
		
	function IsDataDesc(keys){return keys.every(k=>dataDesc.has(k))}	
	function IsAccessorDesc(keys){return keys.every(k=>accDesc.has(k))}	
	function IsObject (val) {return val != null && typeof val === 'object' && Array.isArray(val) === false}	
		
	function IsDescriptor (obj, key, checkProto) {	
		if (!IsObject(obj)) return false	
		let desc = key ? Object.getOwnPropertyDescriptor(obj, key) : obj	
		
		if (!desc && key && checkProto !== false && obj.constructor) {	
			desc = Object.getOwnPropertyDescriptor(obj.constructor.prototype, key)	
			if (!IsObject(desc)) return false	
			if (typeof desc.configurable !== 'boolean' || typeof desc.enumerable !== 'boolean') {	
				return false	
			}	
		}	
		
		let keys = Object.keys(desc);	
		if (IsDataDesc(keys)) {	
			if (typeof desc.get !== 'function' && desc.get !== void 0) return false	
			if (typeof desc.set !== 'function' && desc.set !== void 0) return false	
			return true	
		}	
		
		if (IsAccessorDesc(keys)) {	
			return typeof desc.writable === 'boolean'	
		}	
		return false	
	}	
		
	function Define (obj, key, val, enumerable = false) {	
		
		if (!IsObject(obj) && typeof obj !== 'function' && !Array.isArray(obj)) {	
			throw new TypeError('expected an object, function, or array')	
		}	
		
		if (typeof key !== 'string') {	
			throw new TypeError('expected "key" to be a string')	
		}	
		
		if (IsDescriptor(val)) {	
			if (enumerable) {	
				val.enumerable = true	
			}	
			_define(obj, key, val)	
			return obj	
		}	
		
		_define(obj, key, {	
			configurable: true,	
			enumerable: enumerable,	
			writable: true,	
			value: val	
		})	
		
		return obj	
	}	
		
		
	/**	
	* Defines object elements	
	* @global	
	* @function Define	
	* @param {object}	
	* @param {string} name - Name of property	
	* @param {*} value - Value of property	
	* @param {boolean} [enumerable]	
	* @returns {object}	
	*/	
	Define(global, 'Define', Define)	
		
		
		
	/**	
	* Defines object elements	
	* @memberof Object#	
	* @instance	
	* @function Define	
	* @param {string} name - Name of property	
	* @param {*} value - Value of property	
	* @param {boolean} [enumerable]	
	* @returns {object}	
	*/	
	Define(Object.prototype, 'Define', function () {return Define.apply(null, [this].concat(Array.prototype.slice.call(arguments, 0)))})	
		
		
	;(function () {	
		var setProperty=function setProperty(target,name,value){'__proto__'===name?Object.defineProperty(target,name,{enumerable:true,configurable:true,value:value,writable:true}):target[name]=value};	
		var getProperty=function getProperty(obj,name){if('__proto__'===name){if(!Object.prototype.hasOwnProperty.call(obj,name))return;return Object.getOwnPropertyDescriptor(obj,name).value}return obj[name]};	
		var isPlainObject=function isPlainObject(obj){if(!obj||'[object Object]'!==Object.prototype.toString.call(obj))return false;var hasOwnConstructor=Object.prototype.hasOwnProperty.call(obj,'constructor');var hasIsPrototypeOf=obj.constructor&&obj.constructor.prototype&&Object.prototype.hasOwnProperty.call(obj.constructor.prototype,'isPrototypeOf');if(obj.constructor&&!hasOwnConstructor&&!hasIsPrototypeOf)return false;var key;for(key in obj);return'undefined'==typeof key||Object.prototype.hasOwnProperty.call(obj,key)};	
		
		function ExtendArray (...args) {	
			let target = args.shift()	
			target = target == null || !Array.isArray(target) ? [] : target	
			while (args.length > 0) {	
				let src = args.shift()	
				if (src != null) {	
					if (Array.isArray(src)) {	
						src.forEach(e => {	
							if (!target.includes(e)) {	
								target.push(e)	
							}	
						})	
					} else {	
						target.push(src)	
					}	
				}	
			}	
			return target	
		}	
		
		function Extend (...args) {	
			let deep = typeof args.first === 'boolean' ? args.shift() : false	
			let target = args.shift()	
			target = target == null || (typeof target !== 'object' && typeof target !== 'function') ? {} : target	
		
			if (Array.isArray(target)) {	
				return ExtendArray(target, ...args)	
			}	
			while (args.length > 0) {	
				let src = args.shift()	
				if (src != null) {	
					for (name in src) {	
						let targetProperty = getProperty(target, name)	
						let srcProperty = getProperty(src, name)	
		
						if (typeof srcProperty !== 'undefined' && srcProperty != null && srcProperty !== target) {	
							if (Array.isArray(targetProperty)) {	
								setProperty(target, name, ExtendArray(targetProperty, srcProperty))	
							} else if (!isPlainObject(targetProperty)) {	
								setProperty(target, name, srcProperty)	
							} else {	
								setProperty(target, name, Extend(targetProperty, srcProperty))	
							}	
						}	
		
					}	
		
				}	
			}	
			return target	
		}	
		
		/**	
		* Extend the contents of two or more objects into the target object	
		* @global	
		* @function Extend	
		* @param {(object|array)} target	
		* @param {...(object|array)} sources	
		* @return {object}	
		*/	
		Define(global, 'Extend', Extend)	
	})()	
		
		
	/**	
	* Recursively (deep) clone	
	* @global	
	* @function Clone	
	* @param {object} parent - Parent value to clone	
	* @return {object} - The cloned object	
	*/	
	Define(global, 'Clone', _.cloneDeep)	
		
		
	/**	
	 * Object extensions	
	 *	
	 * @name Object.Extensions	
	 * @type {Object}	
	 */	
	Object.Extensions = {}	
		
		
	/**	
	* Determines if objects are equal	
	* @global	
	* @function IsEqual	
	* @param {object[]} objects	
	* @returns {boolean} result	
	*/	
	Define(global, 'IsEqual', function () {	
		for (let i=1; i<arguments.length; i++) {	
			if (!_.isEqual(arguments[0], arguments[i])) {	
				return false	
			}	
		}	
		return true	
	})	
		
		
	/**	
	 * log	
	 *	
	 * @global	
	 * @function log	
	 * @param {string} msg	
	 */	
	Define(global, 'log', console.log)	
		
		
	/**	
	 * JSON Logger	
	 *	
	 * @global	
	 * @function logj	
	 * @param {*} object - Object to log	
	 */	
	Define(global, 'logj', function (v) {	
		let s = v	
		try {	
			s = JSON.stringify(v, null, '\t')	
		} catch (e) {}	
		log(s)	
	})	
		
		
	/**	
	* Assigns own and inherited enumerable string keyed properties of source objects to the destination object for all destination properties that resolve to undefined. Source objects are applied from left to right. Once a property is set, additional values of the same property are ignored.	
	* @global	
	* @function Merge	
	* @param {(object|array)} target	
	* @param {...(object|array)} sources	
	* @return {(object|array)} target	
	*/	
	Define(global, 'Merge', _.defaults)	
		
		
	/**	
	* Object Type lookup	
	* @global	
	* @function Type	
	* @param {*} item - Item to lookup type of	
	* @param {(string|object)} [compare] - Comparison type label string or comparison object	
	* @returns {(string|boolean)} result - String representing item type or a boolean from type comparisons	
	*/	
	Define(global, 'Type', function Type () {	
		
		// Type.call(thisObject) => return type label	
		if (arguments.length == 0) {return Type(this)}	
		
		// Type(obj) => return type label	
		if (arguments.length == 1) {	
			var type = Object.prototype.toString.call(arguments[0]).match(/\[object (.+)\]/i)[1]	
			return type != 'Object' ? type : arguments[0].constructor.name || type	
		}	
		
		// Type(obj, typeLabel) || Type(obj1, obj2) => return boolean indicating whether type's are the same	
		if (arguments.length == 2) {	
			if (Array.isArray(arguments[1])) {	
				for (i=0; i<arguments[1].length; i++) {	
					if (Type(arguments[0], arguments[1][i])) {	
						return true	
					}	
				}	
				return false	
			}	
			return Type(arguments[0]).toLowerCase() === (typeof arguments[1] === 'string' ? arguments[1] : Type(arguments[1])).toLowerCase()	
		}	
		
		// Type(obj1, obj2, ...objN) return boolean indicating whether all object type's match	
		var type = Type(arguments[0])	
		for (var i=1; i<arguments.length; i++) {	
			if (!Type(arguments[0], arguments[i])) {	
				return false	
			}	
		}	
		return true	
		
	})	
		
		
	/**	
	 * Uuid	
	 *	
	 * @global	
	 * @function Uuid	
	 * @returns {string} uuid	
	 */	
	Define(global, 'Uuid', () => {	
		let d = Date.now()	
		return `xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx`.replace(/[xy]/g, c => {	
			const r = (d + Math.random() * 16) % 16 | 0	
			d = Math.floor(d / 16)	
			return (c == `x` ? r : (r & 0x3 | 0x8)).toString(16)	
		})	
	})	
		
		
	/**	
	* Delete array item	
	* @memberof Array#	
	* @instance	
	* @function Delete	
	* @param {*} elements - Element or array of elements to delete	
	* @param {array} array - The modified array	
	*/	
	Define(Array.prototype, 'Delete', function () {	
		for (let i=0; i<arguments.length; i++) {	
			let index = this.indexOf(arguments[i])	
			while (index !== -1) {	
				this.splice(index, 1)	
				index = this.indexOf(arguments[i])	
			}	
		}	
		return this	
	})	
		
		
	/**	
	* DeleteAt array item	
	* @memberof Array#	
	* @instance	
	* @function DeleteAt	
	* @param {number} indexes - Index or array of indexes to delete	
	* @param {array} array - The modified array	
	*/	
	Define(Array.prototype, 'DeleteAt', function () {	
		[...arguments].sort().reverse().forEach((arg) => {console.log(arg);this.splice(arg, 1)})	
		return this	
	})	
		
		
	function Array_Difference (a, b) {	
		if (!Array.IsArray(a)) {return null}	
		if (!Array.IsArray(b)) {return a}	
		
		var diffArray = [];	
		for (var i=0; i<a.length; i++) {	
			var hasElement = false	
			for (var j=0; j< b.length; j++) {	
				if (a[i]===b[j]) {	
					hasElement = true	
					break	
				}	
			}	
			if (hasElement===false) {	
				diffArray.push(a[i])	
			}	
		}	
		return diffArray	
	}	
		
	/**	
	* Difference in arrays	
	* @memberof Array.	
	* @static	
	* @function Difference	
	* @param {*} lists - Array or list of arrays	
	* @returns {array} diff - List of diffference values	
	*/	
	Define(Array, 'Difference', function () {	
		var diffArray  = arguments[0]	
		for (var i=1; i<arguments.length; i++) {	
			diffArray = Array_Difference(diffArray, arguments[i])	
		}	
		return diffArray	
	})	
		
	/**	
	* Difference in arrays	
	* @memberof Array#	
	* @instance	
	* @function Difference	
	* @param {*} lists - Array or list of arrays	
	* @returns {array} diff - List of diffference values	
	*/	
	Define(Array.prototype, 'Difference', function () {	
		return Array.Difference.apply(null, [this].concat(Array.prototype.slice.call(arguments, 0)))	
	})	
		
		
	/**	
	* First element in an array	
	* @memberof Array#	
	* @instance	
	* @member {*} first	
	* @returns {*} element - The first element of the array	
	*/	
	Define(Array.prototype, 'first', {get: function () {	
		if (this.length > 0) {return this[0]}	
		return null	
	}})	
		
		
	/**	
	* Flatten array elements	
	* @memberof Array.	
	* @static	
	* @function Flatten	
	* @param {number} depth	
	* @returns {array} list - Flattened list	
	*/	
	Array.Define('Flatten', function (list, depth) {	
		depth = (typeof depth == 'number') ? depth : Infinity	
		
		if (!depth) {	
			if (Array.IsArray(list)) {	
				return list.map(function(i) {return i})	
			}	
			return list	
		}	
		
		return _flatten(list, 1)	
		
		function _flatten(list, d) {	
			return list.reduce(function(acc, item) {	
				if (Array.IsArray(item) && d < depth) {	
					return acc.concat(_flatten(item, d + 1))	
				} else {	
					return acc.concat(item)	
				}	
			}, [])	
		}	
	})	
		
		
	/**	
	* Converts value to an array	
	* @memberof Array.	
	* @static	
	* @function From	
	* @param {*} value - value to convert	
	* @return {array} array - The converted array	
	*/	
	Define(Array, 'From', value => _.toArray(value))	
		
		
	/**	
	* Gets all but the last element of array	
	* @memberof Array#	
	* @instance	
	* @member {array} head	
	* @param {array} array -  All but the last element of array	
	*/	
	Define(Array.prototype, 'head', {get: function () {	
		return this.slice(0, this.length-1)	
	}})	
		
		
	/**	
	* Array Intersection	
	* @memberof Array#	
	* @instance	
	* @function Intersection	
	* @param {*} lists - Array or array list	
	* @returns {array} array	
	*/	
	//https://github.com/juliangruber/intersect	
	function many (sets) {	
	  var o = {}	
	  var l = sets.length - 1	
	  var first = sets[0]	
	  var last = sets[l]	
	  for(var i in first) o[first[i]] = 0	
	    for(var i = 1; i <= l; i++) {	
	    var row = sets[i]	
	    for(var j in row) {	
	      var key = row[j]	
	      if(o[key] === i - 1) o[key] = i	
	    }	
	  }	
		
	  var a = []	
	  for(var i in last) {	
	    var key = last[i]	
	    if(o[key] === l) a.push(key)	
	  }	
		
	  return a	
	}	
		
	function intersect (a, b) {	
	  if (!b) return many(a)	
		
	  var res = []	
	  for (var i = 0; i < a.length; i++) {	
	    if (indexOf(b, a[i]) > -1) res.push(a[i])	
	  }	
	  return res	
	}	
		
	intersect.big = function(a, b) {	
	  if (!b) return many(a)	
		
	  var ret = []	
	  var temp = {}	
		
	  for (var i = 0; i < b.length; i++) {	
	    temp[b[i]] = true	
	  }	
	  for (var i = 0; i < a.length; i++) {	
	    if (temp[a[i]]) ret.push(a[i])	
	  }	
		
	  return ret	
	}	
		
	function indexOf(arr, el) {	
	  for (var i = 0; i < arr.length; i++) {	
	    if (arr[i] === el) return i	
	  }	
	  return -1	
	}	
		
	Define(Array.prototype, 'Intersection', function () {	
		var intArray = this	
		for (var i=0; i<arguments.length; i++) {	
			intArray = intersect(intArray, arguments[i])	
		}	
		return intArray	
	})	
		
		
	/**	
	* Check if an object is an array	
	* @memberof Array.	
	* @static	
	* @function IsArray	
	* @param {object} object - Object to check if an array	
	* @returns {boolean} result	
	*/	
	Array.Define('IsArray', function (a) {	
		return Object.prototype.toString.call(a) == '[object Array]'	
	})	
		
		
	/**	
	* Gets the last element of an array	
	* @memberof Array#	
	* @instance	
	* @member {*} last	
	* @returns {*} element -  The last element of the array	
	*/	
	Define(Array.prototype, 'last', {get: function () {	
		return this.length > 0 ? this[this.length-1] : null	
	}})	
		
		
	/**	
	* Create a new array with elements omitted	
	* @memberof Array#	
	* @instance	
	* @function Omit	
	* @param {*} elements - Elements to omit	
	* @returns {array} array	
	*/	
	Define(Array.prototype, 'Omit', function () {	
		let a = [], omit = []	
		for (let i=0; i<arguments.length; i++) {	
			omit.push(arguments[i])	
		}	
		this.forEach(function (e) {	
			if (!omit.contains(e)) {	
				a.push(e)	
			}	
		})	
		return a	
	})	
		
		
	/**	
	* Create a new array with elements omitted at certain indexes	
	* @memberof Array#	
	* @instance	
	* @function OmitAt	
	* @param {*} indexes - Indexes of elements to omit	
	* @returns {array} array	
	*/	
	Define(Array.prototype, 'OmitAt', function () {	
		let a = [], omitIndexes = []	
		for (let i=0; i<arguments.length; i++) {	
			omitIndexes.push(arguments[i])	
		}	
		for (var i=0; i<this.length; i++) {	
			if (!omitIndexes.contains(i)) {	
				a.push(this[i])	
			}	
		}	
		return a	
	})	
		
		
	/**	
	* Pick elements of an array	
	* @memberof Array#	
	* @instance	
	* @function Pick	
	* @param {*} elements - Elements to select	
	* @returns {array} array	
	*/	
	Define(Array.prototype, 'Pick', function () {	
		let a = [], select = []	
		for (let i=0; i<arguments.length; i++) {	
			select.push(arguments[i])	
		}	
		select.forEach(function (index) {	
			a.push(this[index])	
		}, this)	
		return a	
	})	
		
		
	/**	
	* In-place array shuffle	
	* @memberof Array#	
	* @instance	
	* @function Shuffle	
	*/	
	Define(Array.prototype, 'Shuffle', function (seed = 1000) {	
		let i, j, shuffleItem	
		if (this.length <= 2) {	
			return this	
		}	
		
		for (i = 0; i < this.length - 2; i++) {	
			j = (Math.round(Math.random() * seed) + i) % this.length;	
			shuffleItem = this[i]	
			this[i] = this[j]	
			this[j] = shuffleItem	
		}	
		return this	
	})	
		
		
	/**	
	* Gets all but the first element of array	
	* @memberof Array#	
	* @instance	
	* @member {array} tail	
	* @param {array} array -  All but the first element of array	
	*/	
	Define(Array.prototype, 'tail', {get: function () {	
		return this.length > 1 ? this.slice(1, this.length) : []	
	}})	
		
		
	/**	
	* Array Union	
	* @memberof Array#	
	* @instance	
	* @function Union	
	* @param {*} lists - Array or array list	
	* @returns {array} array	
	*/	
	Define(Array.prototype, 'Union', function () {	
		return (this.concat.apply(this, arguments)).Unique()	
	})	
		
		
	/**	
	* Array Unique	
	* @memberof Array#	
	* @instance	
	* @function Unique	
	* @param {*} lists - Array or array list	
	* @returns {array} array	
	*/	
	Define(Array.prototype, 'Unique', function (mutate) {	
		if (typeof mutate !== 'undefined' && mutate === true) {	
			for (var i=this.length-1; i>=0; i--) {	
				if (this.indexOf(this[i]) < i) {	
					this.splice(i, 1)	
				}	
			}	
			return this	
		} else {	
			var a = []	
			for (var i=0; i<this.length; i++) {	
				if (a.indexOf(this[i]) === -1) {	
					a.push(this[i])	
				}	
			}	
			return a	
		}	
	})	
		
		
	/**	
	* Array Xor	
	* @memberof Array#	
	* @instance	
	* @function Xor	
	* @param {array} lists - Array or array list	
	* @param {array} array	
	*/	
	Define(Array.prototype, 'Xor', function () {	
		let xorArray = this	
		for (let i=0; i<arguments.length; i++) {	
			xorArray = Array.Difference(xorArray, arguments[i]).concat(Array.Difference(arguments[i], xorArray))	
		}	
		return xorArray ? xorArray.Unique() : []	
	})	
		
		
	Define(Object.Extensions, 'EventEmitter', function (o) {	
		var R = typeof Reflect === 'object' ? Reflect : null	
		var ReflectApply=R&&'function'==typeof R.apply?R.apply:function ReflectApply(target,receiver,args){return Function.prototype.apply.call(target,receiver,args)};	
		var ReflectOwnKeys	
		R&&'function'==typeof R.ownKeys?ReflectOwnKeys=R.ownKeys:Object.getOwnPropertySymbols?ReflectOwnKeys=function ReflectOwnKeys(target){return Object.getOwnPropertyNames(target).concat(Object.getOwnPropertySymbols(target))}:ReflectOwnKeys=function ReflectOwnKeys(target){return Object.getOwnPropertyNames(target)};	
		function ProcessEmitWarning(warning){console&&console.warn&&console.warn(warning)}	
		var NumberIsNaN=Number.isNaN||function NumberIsNaN(value){return value!=value};	
		
		Define(o, '_events', undefined)	
		Define(o, '_eventsCount', 0)	
		Define(o, '_maxListeners', undefined)	
		var defaultMaxListeners = 10;	
		Define(Object, 'defaultMaxListeners', {get:function(){return defaultMaxListeners},set:function(arg){if('number'!=typeof arg||arg<0||NumberIsNaN(arg))throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received '+arg+'.');defaultMaxListeners=arg}})	
		function setMaxListeners(n){if('number'!=typeof n||n<0||NumberIsNaN(n))throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received '+n+'.');this._maxListeners=n;return this}	
		Define(o, 'setMaxListeners', setMaxListeners)	
		function $getMaxListeners(that){return void 0===that._maxListeners?Object.defaultMaxListeners:that._maxListeners}	
		function getMaxListeners(){return $getMaxListeners(this)}	
		Define(o, 'getMaxListeners', getMaxListeners)	
		function emit(type){var args=[];for(var i=1;i<arguments.length;i++)args.push(arguments[i]);var doError='error'===type;var events=this._events;if(void 0!==events)doError=doError&&void 0===events.error;else if(!doError)return false;if(doError){var er;args.length>0&&(er=args[0]);if(er instanceof Error)throw er;var err=new Error('Unhandled error.'+(er?' ('+er.message+')':''));err.context=er;throw err}var handler=events[type];if(void 0===handler)return false;if('function'==typeof handler)ReflectApply(handler,this,args);else{var len=handler.length;var listeners=arrayClone(handler,len);for(i=0;i<len;++i)ReflectApply(listeners[i],this,args)}return true};	
		Define(o, 'emit', emit)	
		function _addListener(target,type,listener,prepend){var m;var events;var existing;if('function'!=typeof listener)throw new TypeError('The "listener" argument must be of type Function. Received type '+typeof listener);if(void 0===(events=target._events)){events=target._events=Object.create(null);target._eventsCount=0}else{if(void 0!==events.newListener){target.emit('newListener',type,listener.listener?listener.listener:listener);events=target._events}existing=events[type]}if(void 0===existing){existing=events[type]=listener;++target._eventsCount}else{'function'==typeof existing?existing=events[type]=prepend?[listener,existing]:[existing,listener]:prepend?existing.unshift(listener):existing.push(listener);if((m=$getMaxListeners(target))>0&&existing.length>m&&!existing.warned){existing.warned=true;var w=new Error('Possible EventEmitter memory leak detected. '+existing.length+' '+String(type)+' listeners added. Use emitter.setMaxListeners() to increase limit');w.name='MaxListenersExceededWarning';w.emitter=target;w.type=type;w.count=existing.length;ProcessEmitWarning(w)}}return target}	
		function addListener(type,listener){return _addListener(this,type,listener,false)}	
		Define(o, 'addListener', addListener)	
		Define(o, 'on', addListener)	
		function prependListener(type,listener){return _addListener(this,type,listener,true)}	
		Define(o, 'prependListener', prependListener)	
		function onceWrapper(){var args=[];for(var i=0;i<arguments.length;i++)args.push(arguments[i]);if(!this.fired){this.target.removeListener(this.type,this.wrapFn);this.fired=true;ReflectApply(this.listener,this.target,args)}}	
		function _onceWrap(target,type,listener){var state={fired:false,wrapFn:void 0,target:target,type:type,listener:listener};var wrapped=onceWrapper.bind(state);wrapped.listener=listener;state.wrapFn=wrapped;return wrapped}	
		function once(type,listener){if('function'!=typeof listener)throw new TypeError('The "listener" argument must be of type Function. Received type '+typeof listener);this.on(type,_onceWrap(this,type,listener));return this}	
		Define(o, 'once', once)	
		function prependOnceListener(type,listener){if('function'!=typeof listener)throw new TypeError('The "listener" argument must be of type Function. Received type '+typeof listener);this.prependListener(type,_onceWrap(this,type,listener));return this};	
		Define(o, 'prependOnceListener', prependOnceListener)	
		function removeListener(type,listener){var list,events,position,i,originalListener;if('function'!=typeof listener)throw new TypeError('The "listener" argument must be of type Function. Received type '+typeof listener);if(void 0===(events=this._events))return this;if(void 0===(list=events[type]))return this;if(list===listener||list.listener===listener)if(0==--this._eventsCount)this._events=Object.create(null);else{delete events[type];events.removeListener&&this.emit('removeListener',type,list.listener||listener)}else if('function'!=typeof list){position=-1;for(i=list.length-1;i>=0;i--)if(list[i]===listener||list[i].listener===listener){originalListener=list[i].listener;position=i;break}if(position<0)return this;0===position?list.shift():spliceOne(list,position);1===list.length&&(events[type]=list[0]);void 0!==events.removeListener&&this.emit('removeListener',type,originalListener||listener)}return this}	
		Define(o, 'removeListener', removeListener)	
		Define(o, 'off', removeListener)	
		function removeAllListeners(type){var listeners,events,i;if(void 0===(events=this._events))return this;if(void 0===events.removeListener){if(0===arguments.length){this._events=Object.create(null);this._eventsCount=0}else void 0!==events[type]&&(0==--this._eventsCount?this._events=Object.create(null):delete events[type]);return this}if(0===arguments.length){var keys=Object.keys(events);var key;for(i=0;i<keys.length;++i)'removeListener'!==(key=keys[i])&&this.removeAllListeners(key);this.removeAllListeners('removeListener');this._events=Object.create(null);this._eventsCount=0;return this}if('function'==typeof(listeners=events[type]))this.removeListener(type,listeners);else if(void 0!==listeners)for(i=listeners.length-1;i>=0;i--)this.removeListener(type,listeners[i]);return this};	
		Define(o, 'removeAllListeners', removeAllListeners)	
		function _listeners(target,type,unwrap){var events=target._events;if(void 0===events)return[];var evlistener=events[type];return void 0===evlistener?[]:'function'==typeof evlistener?unwrap?[evlistener.listener||evlistener]:[evlistener]:unwrap?unwrapListeners(evlistener):arrayClone(evlistener,evlistener.length)}	
		function listeners(type){return _listeners(this,type,true)};	
		Define(o, 'listeners', listeners)	
		function rawListeners(type){return _listeners(this,type,false)};	
		Define(o, 'rawListenrs', rawListeners)	
		Define(o, 'listenerCount', listenerCount)	
		function listenerCount(type){var events=this._events;if(void 0!==events){var evlistener=events[type];if('function'==typeof evlistener)return 1;if(void 0!==evlistener)return evlistener.length}return 0}	
		function eventNames(){return this._eventsCount>0?ReflectOwnKeys(this._events):[]};	
		Define(o, 'eventNames', eventNames)	
		function arrayClone(arr,n){var copy=new Array(n);for(var i=0;i<n;++i)copy[i]=arr[i];return copy}	
		function spliceOne(list,index){for(;index+1<list.length;index++)list[index]=list[index+1];list.pop()}	
		function unwrapListeners(arr){var ret=new Array(arr.length);for(var i=0;i<ret.length;++i)ret[i]=arr[i].listener||arr[i];return ret}	
		
		return o	
		
	})	
		
		
		
	/**	
	 * Debug Helper Function	
	 *	
	 * @memberof Function.	
	 * @function Debug	
	 * @param {string} name	
	 * @param {function} logFn	
	 * @param (callback} cb	
	 */	
	Define(Function, 'Debug', function (name, logFn, cb) {	
		
		return function (...args) {	
			global.DEBUG[name] = arguments	
			logFn(arguments)	
			if (cb !== 'undefined') {	
				return cb(arguments)	
			} else {	
				return arguments	
			}	
		}	
	})	
		
		
		
		
	/**	
	* Delay function	
	* @memberof Function.	
	* @function Delay	
	* @param {number} time - time to delay	
	* @param {callback} cb - callback function	
	* @param {...*} args - args to pass to callback	
	*/	
	Define(Function, 'Delay', function (time, cb, ...args) {	
		return setTimeout(function () {	
			cb(...args)	
		}, time)	
	})	
		
		
		
	/**	
	* No op function	
	*	
	* @memberof Function.	
	* @function Noop	
	*/	
	Define(Function, 'Noop', function () {	
		
	})	
		
		
	/**	
	* Recursively (deep) clone	
	* @memberof Object#	
	* @instance	
	* @function Clone	
	* @return {object} - The cloned object	
	*/	
	Define(Object.prototype, 'Clone', function () {	
		return Clone(this)	
	})	
		
		
	/**	
	* Object elements iterator	
	* @memberof Object#	
	* @instance	
	* @function Each	
	* @param {function} fn - Iterator function	
	* @param {object} this - Iterator this value	
	*/	
	Define(Object.prototype, 'Each', function (nonEnumerable, cb) {	
		if (typeof nonEnumerable === 'function') {	
			cb = nonEnumerable	
			nonEnumerable = false	
		}	
		if (Type(this, 'Array')) {	
			for (let i=0; i<this.length; i++) {	
				if (cb(this[i], i, this) === false) {return}	
			}	
		} else {	
			let keys = nonEnumerable ? Reflect.ownKeys(this) : Object.keys(this)	
			for (let i=0; i<keys.length; i++) {	
				if (cb(this[keys[i]], keys[i], this) === false) {return}	
			}	
		}	
	})	
		
		
	/**	
	* Extend the contents of two or more objects into the target object	
	* @memberof Object#	
	* @instance	
	* @function Extend	
	* @param {...(object|array)} source	
	* @return {object}	
	*/	
	Define(Object.prototype, 'Extend', function () {	
		return _.merge.apply(null, [this].concat(Array.From(arguments)))	
	})	
		
		
	/**	
	* Get object value at the given path	
	* @memberof Object#	
	* @instance	
	* @function Get	
	* @param {string} path - The element object path	
	* @param {*} default - Value to return if invalid object path	
	* @return {*}  value	
	*/	
	Define(Object.prototype, 'Get', function (path, defaultValue) {	
		return _.get(this, path, defaultValue)	
	})	
		
		
	/**	
	* Check if object has the child element paths	
	* @memberof Object#	
	* @instance	
	* @function Has	
	* @param {string[]} paths - Array of paths	
	* @returns {boolean} result	
	*/	
	Define(Object.prototype, 'Has', function () {	
		for (let i=0; i<arguments.length; i++) {	
			if (!_.has(this, arguments[i])) {	
				return false	
			}	
		}	
		return true	
	})	
		
		
	/**	
	* Check if object has the child element paths	
	* @memberof Object#	
	* @instance	
	* @function Includes	
	* @param {string[]} paths - Array of paths	
	* @returns {boolean} result	
	*/	
	Define(Object.prototype, 'Includes', Object.prototype.Has)	
		
		
	/**	
	* Determines if objects are equal	
	* @memberof Object#	
	* @instance	
	* @function IsEqual	
	* @param {object[]} objects	
	* @returns {boolean} result	
	*/	
	Define(Object.prototype, 'IsEqual', function () {	
		for (let i=0; i<arguments.length; i++) {	
			if (!_.isEqual(this, arguments[i])) {	
				return false	
			}	
		}	
		return true	
	})	
		
		
	/**	
	* Creates an array of the own enumerable property names of object	
	* @memberof Object#	
	* @instance	
	* @function Keys	
	* @returns {array} property names	
	*/	
	Define(Object.prototype, 'Keys', function () {	
		return _.keys(this)	
	})	
		
		
	/**	
	* Assigns own and inherited enumerable string keyed properties of source objects to the object for all destination properties that resolve to undefined. Source objects are applied from left to right. Once a property is set, additional values of the same property are ignored.	
	* @memberof Object#	
	* @instance	
	* @function Merge	
	* @param {...(object|array)} sources	
	* @return {object}	
	*/	
	Define(Object.prototype, 'Merge', function () {	
		return Merge.apply(null, [this].concat(_.toArray(arguments)))	
	})	
		
		
	/**	
	* Gets a list of object element paths	
	* @memberof Object#	
	* @instance	
	* @function Paths	
	* @param {number} [depth] - Depth of recursion	
	* @param {array} paths - The object element paths	
	*/	
	Define(Object.prototype, 'Paths', function(depth = Infinity) {	
	    const list = []	
	    visit(this)	
	    return list.Unique()	
		
	    function visit(object, keys = []) {	
			object.Each((value, name) => {	
				keys.push(name)	
				if (Type(value, 'Array') || Type(value, 'Object')) {	
					visit(value, keys)	
				} else {	
					list.push((keys.length < depth + 1 ? keys : keys.slice(0, depth)).join('.'))	
				}	
				keys.pop()	
			})	
		
		}	
	})	
		
		
	/**	
	* Creates an object composed of the picked object properties	
	* @memberof Object#	
	* @instance	
	* @function Pick	
	* @param {...(string|string[])} paths	
	* @returns {object} object	
	*/	
	Define(Object.prototype, 'Pick', function () {	
		return _.pick.apply(null, [this].concat(_.toArray(arguments)))	
	})	
		
		
	/**	
	* Set a value on object at path	
	* @memberof Object#	
	* @instance	
	* @function Set	
	* @param {string} path - Object element path	
	* @param {*} value	
	* @returns {object} object	
	*/	
	Define(Object.prototype, 'Set', function (path, value) {	
	    return null == this ? this : _.set(this, path, value)	
	})	
		
		
	/**	
	* Trim empty, null, undefined elements from an object	
	* @memberof Object#	
	* @instance	
	* @function Trim	
	* @returns {object} object	
	*/	
	Define(Object.prototype, 'Trim', function () {	
	    Object.keys(this).forEach(function (k) {	
			if (typeof this[k] === 'undefined' || this[k] == null) {	
				delete this[k]	
			} else if (Type(this[k], 'Object')) {	
				this[k] = this[k].Trim()	
				if (IsEqual(this[k], {})) {	
					delete this[k]	
				}	
			} else if (Type(this[k], 'Array') && this[k].length == 0) {	
				delete this[k]	
			} else if (Type(this[k], 'String') && this[k] == '') {	
				delete this[k]	
			} else if (Type(this[k], 'Number') && Number.isNaN(this[k])) {	
				delete this[k]	
			}	
	    }, this)	
		return this	
	})	
		
		
	/**	
	* Object Type lookup	
	* @memberof Object#	
	* @instance	
	* @function Type	
	* @param {...(string|object)} [compare] - Comparison type label string or object	
	* @returns {(string|boolean)} result - String representing item type or a boolean from type comparisons	
	*/	
	Define(Object.prototype, 'Type', function () {	
		return arguments.length > 0 ? Type.apply(null, [this].concat(Array.From(arguments))) : Type(this)	
	})	
		
		
	Define(Object.prototype,'Values',function(){	
		return _.values(this)	
	})	
		
		
	/**	
	* String as ascii text	
	* @memberof String#	
	* @instance	
	* @function AsAscii	
	* @returns {string} text - The ascii text	
	*/	
	Define(String.prototype, 'AsAscii', function (test) {	
		try {	
			if (typeof Buffer === 'function' && 'from' in Buffer) {return Buffer.from(this, 'base64').toString('ascii')} //NodeJs	
			if (typeof atob === 'function') {return atob(this)} //Browser	
			if (typeof Utilities === 'object' && 'base64Decode' in Utilities) {return Utilities.newBlob(Utilities.base64Decode(this, Utilities.Charset.UTF_8)).getDataAsString()} //GScripts	
		} catch (e) {if (typeof test !== 'boolean' || test === false) {console.log(`String.AsAscii('${this}'): invalid conversion`)}}	
		return this	
	})	
		
		
	/**	
	* String as base64 text	
	* @memberof String#	
	* @instance	
	* @function AsBase64	
	* @returns {string} text - The base64 text	
	*/	
	Define(String.prototype, 'AsBase64', function (test) {	
		try {	
			if (typeof Buffer === 'function' && 'from' in Buffer) {return Buffer.from(this).toString('base64')} //NodeJs	
			if (typeof btoa === 'function') {return btoa(this)} //Browser	
			if (typeof Utilities === 'object' && 'base64Encode' in Utilities) {return Utilities.base64Encode(this)} //GScripts	
		} catch (e) {if (typeof test !== 'boolean' || test === false) {console.log(`String.$AsAscii('${this}'): invalid conversion`)}}	
		return this	
	})	
		
		
	/**	
	* String as converted to url match pattern	
	* @memberof String#	
	* @instance	
	* @function AsUrlMatch	
	* @returns {string} pattern - The match pattern	
	*/	
	function AsUrlMatch (t){if("string"!=typeof t)return null;var e="(?:^",n=function(t){return t.replace(/[[^$.|?*+(){}\\]/g,"\\$&")},r=/^(\*|https?|file|ftp|chrome-extension):\/\//.exec(t);if(!r)return null;if(t=t.substr(r[0].length),e+="*"===r[1]?"https?://":r[1]+"://","file"!==r[1]){if(!(r=/^(?:\*|(\*\.)?([^\/*]+))(?=\/)/.exec(t)))return null;t=t.substr(r[0].length),"*"===r[0]?e+="[^/]+":(r[1]&&(e+="(?:[^/]+\\.)?"),e+=n(r[2]))}return e+=t.split("*").map(n).join(".*"),e+="$)"}	
	Define(String.prototype, 'AsUrlMatch', function () {return AsUrlMatch(this.toString())})	
		
		
	/**	
	* String converted to camel case	
	* @memberof String#	
	* @instance	
	* @function CamelCase	
	* @param {boolean} [UpperCamel] - Set if Upper Camel Case	
	* @returns {string} text - Text with camel case	
	*/	
	const preserveCamelCase=a=>{let b=!1,d=!1,e=!1;for(let f=0;f<a.length;f++){const g=a[f];b&&/[a-zA-Z]/.test(g)&&g.toUpperCase()===g?(a=a.slice(0,f)+'-'+a.slice(f),b=!1,e=d,d=!0,f++):d&&e&&/[a-zA-Z]/.test(g)&&g.toLowerCase()===g?(a=a.slice(0,f-1)+'-'+a.slice(f-1),e=d,d=!1,b=!0):(b=g.toLowerCase()===g,e=d,d=g.toUpperCase()===g)}return a}	
	function camelCase(a,b){b=Object.assign({pascalCase:!1},b);const c=e=>b.pascalCase?e.charAt(0).toUpperCase()+e.slice(1):e;if(a=Array.isArray(a)?a.map(e=>e.trim()).filter(e=>e.length).join('-'):a.trim(),0===a.length)return'';if(1===a.length)return b.pascalCase?a.toUpperCase():a.toLowerCase();if(/^[a-z\d]+$/.test(a))return c(a);const d=a!==a.toLowerCase();return d&&(a=preserveCamelCase(a)),a=a.replace(/^[_.\- ]+/,'').toLowerCase().replace(/[_.\- ]+(\w|$)/g,(e,f)=>f.toUpperCase()),c(a)}	
	function CamelCase(){const a=camelCase.apply(camelCase,arguments);return a.charAt(0).toUpperCase()+a.slice(1)}	
		
	Define(String.prototype, 'CamelCase', function (upper) {	
		return (typeof upper !== 'undefined' && upper === true) ? CamelCase(this) : camelCase(this)	
	})	
		
		
		
	/**	
	* Capitalize words in a string	
	* @memberof String#	
	* @instance	
	* @function Capitalize	
	* @param {boolean} [AllWords] - Capitalize first letter of each word	
	* @returns {string} text - Capitalized text	
	*/	
	Define(String.prototype, 'Capitalize', function (allWords) {	
		const s = this.toLowerCase()	
		if (typeof allWords !== 'undefined' && allWords === true) {	
			return s.replace(/(^|[^a-zA-Z\u00C0-\u017F'])([a-zA-Z\u00C0-\u017F])/g, function (m) {	
				return m.toUpperCase()	
			})	
		} else {	
			return s.charAt(0).toUpperCase() + s.substring(1)	
		}	
	})	
		
		
	/**	
	* Generates a hash string	
	* @memberof String#	
	* @instance	
	* @function Hash	
	* @param {string} type - Hash type (sha1/md5)	
	* @returns {string} hash - Hash string	
	*/	
	function safeAdd(n,r){var a=(65535&n)+(65535&r);return(n>>16)+(r>>16)+(a>>16)<<16|65535&a}	
	function bitRotateLeft(r,d){return r<<d|r>>>32-d}	
	function md5(M,r,D){return r?D?rawHMACMD5(r,M):hexHMACMD5(r,M):D?rawMD5(M):hexMD5(M)}	
	function md5cmn(r,d,n,t,m,f){return safeAdd(bitRotateLeft(safeAdd(safeAdd(d,r),safeAdd(t,f)),m),n)}	
	function md5ff(r,d,n,t,m,f,i){return md5cmn(d&n|~d&t,r,d,m,f,i)}	
	function md5gg(r,d,n,t,m,f,i){return md5cmn(d&t|n&~t,r,d,m,f,i)}	
	function md5hh(r,d,n,t,m,f,i){return md5cmn(d^n^t,r,d,m,f,i)}	
	function md5ii(r,d,n,t,m,f,i){return md5cmn(n^(d|~t),r,d,m,f,i)}	
	function binlMD5(r,d){var n,t,m,f,i;r[d>>5]|=128<<d % 32,r[14+(d+64>>>9<<4)]=d;var e=1732584193,h=-271733879,g=-1732584194,o=271733878;for(n=0;n<r.length;n+=16)t=e,m=h,f=g,i=o,h=md5ii(h=md5ii(h=md5ii(h=md5ii(h=md5hh(h=md5hh(h=md5hh(h=md5hh(h=md5gg(h=md5gg(h=md5gg(h=md5gg(h=md5ff(h=md5ff(h=md5ff(h=md5ff(h,g=md5ff(g,o=md5ff(o,e=md5ff(e,h,g,o,r[n],7,-680876936),h,g,r[n+1],12,-389564586),e,h,r[n+2],17,606105819),o,e,r[n+3],22,-1044525330),g=md5ff(g,o=md5ff(o,e=md5ff(e,h,g,o,r[n+4],7,-176418897),h,g,r[n+5],12,1200080426),e,h,r[n+6],17,-1473231341),o,e,r[n+7],22,-45705983),g=md5ff(g,o=md5ff(o,e=md5ff(e,h,g,o,r[n+8],7,1770035416),h,g,r[n+9],12,-1958414417),e,h,r[n+10],17,-42063),o,e,r[n+11],22,-1990404162),g=md5ff(g,o=md5ff(o,e=md5ff(e,h,g,o,r[n+12],7,1804603682),h,g,r[n+13],12,-40341101),e,h,r[n+14],17,-1502002290),o,e,r[n+15],22,1236535329),g=md5gg(g,o=md5gg(o,e=md5gg(e,h,g,o,r[n+1],5,-165796510),h,g,r[n+6],9,-1069501632),e,h,r[n+11],14,643717713),o,e,r[n],20,-373897302),g=md5gg(g,o=md5gg(o,e=md5gg(e,h,g,o,r[n+5],5,-701558691),h,g,r[n+10],9,38016083),e,h,r[n+15],14,-660478335),o,e,r[n+4],20,-405537848),g=md5gg(g,o=md5gg(o,e=md5gg(e,h,g,o,r[n+9],5,568446438),h,g,r[n+14],9,-1019803690),e,h,r[n+3],14,-187363961),o,e,r[n+8],20,1163531501),g=md5gg(g,o=md5gg(o,e=md5gg(e,h,g,o,r[n+13],5,-1444681467),h,g,r[n+2],9,-51403784),e,h,r[n+7],14,1735328473),o,e,r[n+12],20,-1926607734),g=md5hh(g,o=md5hh(o,e=md5hh(e,h,g,o,r[n+5],4,-378558),h,g,r[n+8],11,-2022574463),e,h,r[n+11],16,1839030562),o,e,r[n+14],23,-35309556),g=md5hh(g,o=md5hh(o,e=md5hh(e,h,g,o,r[n+1],4,-1530992060),h,g,r[n+4],11,1272893353),e,h,r[n+7],16,-155497632),o,e,r[n+10],23,-1094730640),g=md5hh(g,o=md5hh(o,e=md5hh(e,h,g,o,r[n+13],4,681279174),h,g,r[n],11,-358537222),e,h,r[n+3],16,-722521979),o,e,r[n+6],23,76029189),g=md5hh(g,o=md5hh(o,e=md5hh(e,h,g,o,r[n+9],4,-640364487),h,g,r[n+12],11,-421815835),e,h,r[n+15],16,530742520),o,e,r[n+2],23,-995338651),g=md5ii(g,o=md5ii(o,e=md5ii(e,h,g,o,r[n],6,-198630844),h,g,r[n+7],10,1126891415),e,h,r[n+14],15,-1416354905),o,e,r[n+5],21,-57434055),g=md5ii(g,o=md5ii(o,e=md5ii(e,h,g,o,r[n+12],6,1700485571),h,g,r[n+3],10,-1894986606),e,h,r[n+10],15,-1051523),o,e,r[n+1],21,-2054922799),g=md5ii(g,o=md5ii(o,e=md5ii(e,h,g,o,r[n+8],6,1873313359),h,g,r[n+15],10,-30611744),e,h,r[n+6],15,-1560198380),o,e,r[n+13],21,1309151649),g=md5ii(g,o=md5ii(o,e=md5ii(e,h,g,o,r[n+4],6,-145523070),h,g,r[n+11],10,-1120210379),e,h,r[n+2],15,718787259),o,e,r[n+9],21,-343485551),e=safeAdd(e,t),h=safeAdd(h,m),g=safeAdd(g,f),o=safeAdd(o,i);return[e,h,g,o]}	
	function binl2rstr(r){var d,n="",t=32*r.length;for(d=0;d<t;d+=8)n+=String.fromCharCode(r[d>>5]>>>d%32&255);return n}	
	function rstr2binl(r){var d,n=[];for(n[(r.length>>2)-1]=void 0,d=0;d<n.length;d+=1)n[d]=0;var t=8*r.length;for(d=0;d<t;d+=8)n[d>>5]|=(255&r.charCodeAt(d/8))<<d%32;return n}	
	function rstrMD5(r){return binl2rstr(binlMD5(rstr2binl(r),8*r.length))}	
	function rstrHMACMD5(r,d){var n,t,m=rstr2binl(r),f=[],i=[];for(f[15]=i[15]=void 0,m.length>16&&(m=binlMD5(m,8*r.length)),n=0;n<16;n+=1)f[n]=909522486^m[n],i[n]=1549556828^m[n];return t=binlMD5(f.concat(rstr2binl(d)),512+8*d.length),binl2rstr(binlMD5(i.concat(t),640))}	
	function rstr2hex(r){var d,n,t="0123456789abcdef",m="";for(n=0;n<r.length;n+=1)d=r.charCodeAt(n),m+=t.charAt(d>>>4&15)+t.charAt(15&d);return m}	
	function str2rstrUTF8(r){return unescape(encodeURIComponent(r))}	
	function rawMD5(r){return rstrMD5(str2rstrUTF8(r))}	
	function hexMD5(r){return rstr2hex(rawMD5(r))}	
	function rawHMACMD5(r,d){return rstrHMACMD5(str2rstrUTF8(r),str2rstrUTF8(d))}	
	function hexHMACMD5(r,d){return rstr2hex(rawHMACMD5(r,d))}	
		
	function fillString(a){var d,b=(a.length+8>>6)+1,c=[];for(d=0;d<16*b;d++)c[d]=0;for(d=0;d<a.length;d++)c[d>>2]|=a.charCodeAt(d)<<24-8*(3&d);return c[d>>2]|=128<<24-8*(3&d),c[16*b-1]=8*a.length,c}	
	function binToHex(a){var d,b="0123456789abcdef",c="";for(d=0;d<4*a.length;d++)c+=b.charAt(15&a[d>>2]>>8*(3-d%4)+4)+b.charAt(15&a[d>>2]>>8*(3-d%4));return c}	
	function coreFunction(f){var o,p,q,r,s,u,v,x,g=[],h=1732584193,k=4023233417,l=2562383102,m=271733878,n=3285377520;for(v=0;v<f.length;v+=16){for(o=h,p=k,q=l,r=m,s=n,x=0;80>x;x++)g[x]=16>x?f[v+x]:cyclicShift(g[x-3]^g[x-8]^g[x-14]^g[x-16],1),u=modPlus(modPlus(cyclicShift(h,5),ft(x,k,l,m)),modPlus(modPlus(n,g[x]),kt(x))),n=m,m=l,l=cyclicShift(k,30),k=h,h=u;h=modPlus(h,o),k=modPlus(k,p),l=modPlus(l,q),m=modPlus(m,r),n=modPlus(n,s)}return[h,k,l,m,n]}	
	function ft(a,e,f,g){return 20>a?e&f|~e&g:40>a?e^f^g:60>a?e&f|e&g|f&g:e^f^g}	
	function kt(a){return 20>a?1518500249:40>a?1859775393:60>a?2400959708:3395469782}	
	function modPlus(a,b){var c=(65535&a)+(65535&b);return(a>>16)+(b>>16)+(c>>16)<<16|65535&c}	
	function cyclicShift(a,b){return a<<b|a>>>32-b}	
	function sha1(a){return binToHex(coreFunction(fillString(a)))}	
		
	Define(String.prototype, 'Hash', function (type) {	
		return (typeof type !== 'undefined' && (type == 'sha-1' || type == 'sha1')) ? sha1(this) : md5(this)	
	})	
		
		
	/**	
	* Tests if a string is Base64 format	
	* @memberof String#	
	* @instance	
	* @function IsBase64	
	* @returns {boolean} result	
	*/	
	Define(String.prototype, 'IsBase64', function () {	
		return this.toString() === this.AsAscii(true).AsBase64(true)	
	})	
		
		
	/**	
	* Checks if a string is empty, null or undefined	
	* @memberof String#	
	* @instance	
	* @function IsEmpty	
	* @returns {boolean} result	
	*/	
	Define(String.prototype, 'IsEmpty', function () {	
		return (typeof this === 'undefined' || this == null || this.length === 0) ? true : false	
	})	
		
		
	/**	
	* Test whether a string is JSON	
	* @memberof String#	
	* @instance	
	* @function IsJson	
	* @returns {boolean} result	
	*/	
	Define(String.prototype, 'IsJson', function () {	
		try {	
			JSON.parse(this)	
		} catch (e) {	
			return false	
		}	
		return true	
	})	
		
		
	Define(String.prototype, 'Match', function (m) {	
		return !(this.match(m) == null)	
	})	
		
		
	/**	
	* Pads a string out to a certain width	
	* @memberof String#	
	* @instance	
	* @function Pad	
	* @param {number} length - Length of the string in chars	
	* @param {string} [char] - Char to pad with	
	* @param {boolean} [rightPad] - Pad chars tot he right instead of the left	
	* @returns {string} text - Padded string	
	*/	
	Define(String.prototype, 'Pad', function (length, padChar, rightPad) {	
		let s = this + ''	
		length = length - s.length	
		if (length <= 0) {return s}	
		padChar = (padChar+'').Repeat(length)	
		if (typeof rightPad !== 'undefined' && rightPad === true) {	
			return s+padChar	
		}	
		return padChar + s	
	})	
		
		
	/**	
	* Repeats a string of text n times	
	* @memberof String#	
	* @instance	
	* @function Repeat	
	* @param {number} n - Number of times to repeat	
	* @returns {string} text	
	*/	
	Define(String.prototype, 'Repeat', function (n) {	
		let s = ''	
		for (let i=0; i<n; i++) {s += this}	
		return s	
	})	
	

}))