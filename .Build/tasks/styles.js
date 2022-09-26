'use strict'
let Fs = require('fs')
let Path = require('path')

module.exports = function(grunt) {
	grunt.registerTask('styles', 'Create style source file', function() {
		let options = this.options({})

		function Contents (path, filters = [], recurse = true) {
			let contents = []
			Fs.readdirSync(path, {withFileTypes: true}).forEach(entry => {
				if (entry.isDirectory() && recurse) {
					Contents(Path.join(path, entry.name), filters, recurse).forEach(e => {
						contents.push(e)
					})
				}
				if (entry.isFile()) {
					contents.push(Path.join(path, entry.name))
				}
			})
			filters.forEach(filter => {
				contents = contents.filter(filter)
			})
			return contents
		}

		let contents = []
		Contents(options.folder).forEach(file => {
			grunt.log.write(`Processing file: '${file}'...`)
			let style = grunt.file.read(file)
			contents.push(`define('@css/${Path.basename(file).replace(/\.css$/, '')}', ['Util'], ($) => {\n\treturn $.AddStyle(\`${style}\`, '${file.replace(/\.css$/, '')}')\n})\n`)
			grunt.log.writeln('done')
		})

		grunt.log.write(`Creating file: '${options.dest}'...`)
		grunt.file.write(options.dest, contents.join(options.separator))
		grunt.log.writeln('done')

	})
}