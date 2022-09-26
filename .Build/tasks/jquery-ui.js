'use strict'

module.exports = function(grunt) {
	grunt.registerTask('jquery', 'Make jquery component', function() {
		let options = this.options({})

		grunt.log.write('Preparing jquery...\n')
		grunt.file.write(options.dest, grunt.file.read(require.resolve('jquery')))
		grunt.log.write('done\n')
		grunt.log.write(`File created: '${options.dest}'\n`)
		grunt.log.ok()
	})
}