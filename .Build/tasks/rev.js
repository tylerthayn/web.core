module.exports = function(grunt) {
	grunt.registerTask('rev', 'Update the package version', function() {
		let package = grunt.file.readJSON('./package.json')
		grunt.log.write(`version: ${package.version} => `)

		let version = package.version.split('.')
		if (this.flags.patch) {
			version[2]++
		} else if (this.flags.minor) {
			version[1]++
			version[2] = 0
		} else if (this.flags.major) {
			version[0]++
			version[1] = 0
			version[2] = 0
		} else {
			grunt.fatal('No version level provided')
		}
		package.version = version.join('.')
		grunt.log.writeln(package.version )
		grunt.file.write('package.json', JSON.stringify(package, null, 4))
	})
}