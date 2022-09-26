'use strict'
let Join = require('path').join
let Uglify = require("uglify-es")

module.exports = function(grunt) {
	grunt.registerTask('minify', 'Minify source file', function() {
		let options = this.options({})

		options.files.forEach(file => {
			grunt.log.write(`Creating minified file: '${Join(options.folder, file.replace(/\.js$/, '.min.js'))}'...`)
			let source = grunt.file.read(Join(options.folder, file))
			grunt.file.write(Join(options.folder, file.replace(/\.js$/, '.min.js')), Uglify.minify(source, options.uglify).code)
			grunt.log.write('done\n')
		})
	})

}