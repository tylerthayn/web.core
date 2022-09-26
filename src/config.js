
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
		'@css/tts'
	],
	callback: (...modules) => {
		console.log(modules)
	}
}
