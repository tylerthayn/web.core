'use strict'
let Join = require('path').join

module.exports = function(grunt) {
	grunt.registerMultiTask('make', 'Make package files', function() {
		let options = this.options({
			folder: '.Build/tmp/',
			separator: '\n\n'
		})

		this.files.forEach(file => {
			let content = []

			grunt.log.write(`Creating file: '${Join(options.folder, file.dest)}'...`)
			file.src.forEach(src => {
				content.push(grunt.file.read(src))
			})
			grunt.file.write(Join(options.folder, file.dest), content.join(options.separator))
			grunt.log.write('done\n')

		})

	})

}