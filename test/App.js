
define('App', ['lodash', 'jquery', 'bootstrap', '@css/bootstrap', 'jquery-ui', '@css/jquery-ui', 'notifyjs', '@js/core', '@css/tts'], (_, $, bootstrap) => {

	let defaults = {
		e: {},
		$e: $({}),
		id: '',
		classes: []
	}

	let App = Class.extend({
		options: defaults,
		initialize: function(options) {
			this.options = Extend(defaults, options || {})
		}
	}, 'App')

	//App.mergeOptions({name: 'tyler'})


/*
	let classes = {}

	function App () {
		Object.Extensions.EventEmitter(this)

		//let e = $('.App')
		//let $e = $(e)

		//this.views = []
		//this.plugins = []
		//this.Define('e', {get: () => {return e}})
		//this.Define('$e', {get: () => {return $e}})
		//this.Define('name', {get: () => {return $e.data('name')}})
		//this.Define('Use', function (fn) {fn(this)})

		//this.Init()
		//return this
	}

	App.prototype.Init = function () {

		classes.Each((n, c) => {
			this.$e.find('.View.'+n.name).each((i, e) => {
				this.views.push(new classes[n.name](e, this))
			}, this)
		}, this)

	}

	Define(App, 'Classes', {get: () => {return classes}})
*/

	return App

})

