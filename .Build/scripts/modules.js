require('@js/core')
let Fs = require('fs')
let Path = require('path')

let modules = [
	'lodash',
	'jquery',
	'jqueryui',
	'@popperjs/core',
	'bootstrap',
	'notifyjs-browser',
	'@tyler.thayn/js.core'
]

let pkg = JSON.parse(Fs.readFileSync('./package.json', 'utf-8'))

let _modules = {}
modules.forEach(module => {
	modules[module] = pkg.devDependencies[module].replace(/^[^\d]+/, '')
})
