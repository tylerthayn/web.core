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
