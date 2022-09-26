'use strict'
let Join = require('path').join

module.exports = function(grunt) {
	grunt.registerMultiTask('replacements', 'Make package files', function() {
		let options = this.options({
			folder: '.Build/tmp/',
			separator: '\n\n'
		})

		Object.keys(options.files).forEach(file => {
			grunt.log.write(file)
			grunt.log.write(`Modifying file: '${Join(options.folder, file)}'...`)
			let source = grunt.file.read(Join(options.folder, file))
			options.files[file].forEach(replacement => {
				source = source.replace(replacement[0], replacement[1])
			})
			grunt.file.write(Join(options.folder, file), source)
			grunt.log.write('done\n')
		})

	})

}