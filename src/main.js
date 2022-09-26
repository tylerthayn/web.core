
let currentScript = document.currentScript
let basePath = BasePath()
require(['jquery', 'bootstrap', 'jquery-ui', 'notifyjs', '@js/core'], ($, bootstrap) => {
	if (currentScript.hasAttribute('data-main')) {
		InsertScript(Path.join(basePath, currentScript.getAttribute('data-main').endsWith('.js') ? currentScript.getAttribute('data-main') : currentScript.getAttribute('data-main')+'.js'))
	}
	if (currentScript.hasAttribute('data-start')) {
		if (Reflect.has(global, currentScript.getAttribute('data-start'))) {
			global[currentScript.getAttribute('data-start')]($, bootstrap)
		}
	}

	document.dispatchEvent(new CustomEvent('web-ready', {
		bubbles: true,
		detail: {
			$: $,
			bootstrap: bootstrap
		}
	}))
})