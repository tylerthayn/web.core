define('Util/InsertScript', ['jquery'], ($) => {

	$.extend({
		InsertScript: (...args) => {
			let file = args.shift()
			let id = typeof args[0] === 'string' ? args.shift() : ''
			let classes = Array.isArray(args[0]) ? args.shift() : []
			let cb = args[0] instanceof Function ? args.shift() : () => {}

			console.dir(file)
			console.dir(id)
			console.dir(classes)
			console.dir(cb)

			let script = $(`<script type="text/javascript" src="${file}">`)
			if (id != '') {script.attr('id', id)}
			classes.forEach(c => {script.addClass(c)})
			script.on('load', cb)
			$('head').append(script)
		}
	})

	return $
})
