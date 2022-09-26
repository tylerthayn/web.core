let Fs = require('fs')
let Ini = require('ini')
let Path = require('path')

let npmrcPaths = {
	user: Path.resolve(process.env.USERPROFILE, '.npmrc'),
	node: Path.resolve(Path.dirname(process.argv[0]), '.npmrc'),
	npm: Path.resolve(Path.dirname(process.argv[0]), 'node_modules/npm/.npmrc')
}

module.exports = function(grunt) {
	grunt.registerTask('alias', 'Aliasing configuration & control', function() {
		let options = this.options({
			npmrc: 'user'
		})

		let pkg = grunt.file.readJSON('package.json')
		if (!pkg.alias) {throw new Error('No alias defined in package.json')}

		grunt.log.write(`Reading npmrc file '${npmrcPaths[options.npmrc]}'...`)
		let ini = Ini.parse(Fs.readFileSync(npmrcPaths[options.npmrc], 'utf-8'))
		grunt.log.writeln('done')

		if (this.flags.unregister) {
			if (ini.npm && ini.npm.aliases) {
				delete ini.npm.aliases[pkg.alias]
			}
		} else {
			if (!ini.npm) {ini.npm = {}}
			if (!ini.npm.aliases) {ini.npm.aliases = {}}
			ini.npm.aliases[pkg.alias] = pkg.name
		}

		grunt.log.write(`Writing npmrc file '${npmrcPaths[options.npmrc]}'...`)
		Fs.writeFileSync(npmrcPaths[options.npmrc], Ini.stringify(ini), 'utf-8')
		grunt.log.writeln('done')

	})
}