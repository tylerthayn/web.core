/**
 * AddStyle - Add css style into the head of the document
 * @function AddStyle
 * @param {string} css
 * @param {string} [id] - Id for the <link> tag
 * @param {String[]} [classes] - Classes for the <link> tag
 */
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
