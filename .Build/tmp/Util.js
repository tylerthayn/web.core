define('Util/AddStyle', ['jquery'], ($) => {

	$.extend({
		AddStyle: (style, id = '', classes = []) => {
			let _style = $(`<style>${style}</style>`)
			if (id != '') {_style.attr('id', id)}
			classes.forEach(c => {_style.addClass(c)})
			$('head').append(_style)
			return _style
		}
	})

	return $
})


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


define('Util/InsertStyle', ['jquery'], ($) => {

	$.extend({
		InsertStyle: (...args) => {
			let file = args.shift()
			let id = typeof args[0] === 'string' ? args.shift() : ''
			let classes = Array.isArray(args[0]) ? args.shift() : []
			let cb = args[0] instanceof Function ? args.shift() : () => {}

			console.dir(file)
			console.dir(id)
			console.dir(classes)
			console.dir(cb)

			let style = $(`<link rel="stylesheet" href="${file}">`)
			if (id != '') {style.attr('id', id)}
			classes.forEach(c => {style.addClass(c)})
			style.on('load', cb)
			$('head').append(style)
		}
	})

	return $
})


define('Util', ['jquery', 'Util/AddStyle', 'Util/InsertScript', 'Util/InsertStyle'], ($) => {
	return $
})
