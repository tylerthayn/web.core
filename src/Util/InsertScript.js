/**
 * InsertScript - Insert script tag into head of document
 *
 * @function InsertScript
 * @param {string} url - Script url
 * @param {string} [id] - Id for the <script> tag
 * @param {String[]} [classes] - Classes for the <script> tag
 * @param {docLoad} cb - Callback function called once the script is loaded
 */

/**
 * Script load callback
 * @callback docLoad
 * @param {Event} event
 */
define('Util/InsertScript', ['jquery'], ($) => {

	$.extend({
		InsertScript: (...args) => {
			let file = args.shift()
			let id = typeof args[0] === 'string' ? args.shift() : ''
			let classes = Array.isArray(args[0]) ? args.shift() : []
			let cb = args[0] instanceof Function ? args.shift() : () => {}

			let script = $(`<script type="text/javascript" src="${file}">`)
			if (id != '') {script.attr('id', id)}
			classes.forEach(c => {script.addClass(c)})
			script.on('load', cb)
			$('head').append(script)
		}
	})

	return $
})
