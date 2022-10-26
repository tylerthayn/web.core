require = {
	deps: [
		'lodash',
		'jquery',
		'jquery-ui',
		'@css/jquery-ui',
		'@popperjs/core',
		'bootstrap',
		'@css/bootstrap',
		'notifyjs',
		'@js/core',
		'jquery.actions',
		'jquery.properties',
		'ui.loader',
		'@css/tts'
	],
	callback: (...modules) => {
		console.log('@web/core loaded')
	}
}
