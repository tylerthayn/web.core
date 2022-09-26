/**
 * InsertStyle - Insert style tag into head of document
 *
 * @function InsertStyle
 * @param {string} url - Stylesheet url
 * @param {string} [id] - Id for the <link> tag
 * @param {String[]} [classes] - Classes for the <link> tag
 * @param {docLoad} cb - Callback function called once the style is loaded
 */
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
