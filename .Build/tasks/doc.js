'use strict'
let Fs = require('fs')
let Path = require('path')

module.exports = function(grunt) {
	grunt.registerTask('doc', 'Generate document header', function() {
		let pkg = JSON.parse(Fs.readFileSync('./package.json', 'utf-8'))
		let options = this.options({})

		let source = grunt.file.read('src/index.js').replace(/\$\{date\}/, new Date().toISOString())

		let packages = {}
		options.packages.forEach(p => {
			source += GetPackageDetails(p) + '\n\n'
		})

		grunt.file.write(options.output, source)

	})

	function GetPackageDetails (name) {
		let pkg = JSON.parse(Fs.readFileSync(Path.resolve('node_modules', name, 'package.json'), 'utf-8'))
		return `
/**
 * ${pkg.name}@${pkg.version}
 * @external ${pkg.name}
 * @see {@link ${pkg.homepage}}
 */
`.trim()


	}

}