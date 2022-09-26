'use strict'
let Fs = require('fs')
let Path = require('path')

module.exports = function(grunt) {
	grunt.registerTask('clean', 'Minify source file', function() {
		let options = this.options({})
		options.paths.forEach(path => {
			if (grunt.file.exists(path)) {
				grunt.log.write(`Deleting: '${path}'...`)
				grunt.file.delete(path)
				grunt.log.write('done\n')
			}
		})
	})
}