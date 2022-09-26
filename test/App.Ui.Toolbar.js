
define(['lodash', 'jquery', 'bootstrap', 'App', 'jquery-ui', 'notifyjs', 'org.tts.js.core'], (_, $, bootstrap, App) => {

	App.Classes['UiToolbar'] = function UiToolbar (e, app) {
		this.id = Uuid()
		$(e).data('id', this.id)
		this.type = 'Ui.Toolbar'

		app.on('hide', function (e) {
			log('hide'+e)
		})

		return this
	}

	/*
	App.Use((app) => {

		app.plugins.push({
			name: 'Ui.Toolbar'
		})

	})
	*/
})

