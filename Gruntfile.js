'use strict'

module.exports = function(grunt) {

	grunt.initConfig({
		alias: {},
		clean: {
			options: {
				paths: [
					'.Build/tmp',
					'docs',
					//'README.md',
					'web.core.js'
				]
			}
		},
		concat: {
			default: {
				files: {
					'web.core.js': [
							'.Build/tmp/index.js',
							'src/config.js',
							'.Build/tmp/requirejs.min.js',
							'src/plugins/*.js',
							'.Build/tmp/lodash.min.js',
							'.Build/tmp/jquery.min.js',
							'.Build/tmp/jquery-ui.min.js',
							'.Build/tmp/popperjs.min.js',
							'.Build/tmp/bootstrap.min.js',
							'.Build/tmp/notifyjs.min.js',
							'.Build/tmp/core.js',
							'.Build/tmp/Util.js',
							'.Build/tmp/styles.js'
					]
				},
				options: {
					separator: '\n\n',
					listFile: false
				}
			}
		},
		doc: {
			options: {
				output: '.Build/tmp/index.js',
				packages: [
					'lodash',
					'jquery',
					'jqueryui',
					'@popperjs/core',
					'bootstrap',
					'notifyjs-browser',
					'@js/core'
				]
			}
		},
		jsdoc: {
			default: {
				src: [".Build/tmp/index.js", "src/config.js", "src/Util", "src/plugins", "README.md"],
				options: {
					"destination": "docs",
					"template": ".Build/templates/docs/template",
					"configure": "jsdoc.conf"
				}
			}
		},
		make: {
			default: {
				files: {
					'core.js': [require.resolve('@js/core')],
					'bootstrap.js': [require.resolve('bootstrap')],
					'jquery.js': [require.resolve('jquery')],
					'jquery-ui.js': [require.resolve('jqueryui')],
					'lodash.js': [require.resolve('lodash')],
					'notifyjs.js': [require.resolve('notifyjs-browser')],
					'popperjs.js': [require.resolve('@popperjs/core').replace('cjs', 'umd')],
					'requirejs.js': [require.resolve('requirejs').replace(/bin(\/|\\)r\.js/, 'require.js')],
					'Util.js': ['src/Util/AddStyle.js', 'src/Util/InsertScript.js', 'src/Util/InsertStyle.js', 'src/Util/index.js'],
				},
				options: {
					folder: '.Build/tmp/',
					separator: '\n\n'
				}
			}
		},
		minify: {
			options: {
				files: [
					'core.js',
					'bootstrap.js',
					'jquery.js',
					'jquery-ui.js',
					'lodash.js',
					'notifyjs.js',
					'popperjs.js',
					'requirejs.js'
				],
				folder: '.Build/tmp/',
				uglify: {
					compress: true,
					output: {
						quote_style: 1,
						comments: /(^\!|license|Copyright)/i
					}
				}
			}
		},
		readme: {
			options: {
				output: 'README.md',
				template: '.Build/templates/readme'
			}
		},
		replacements: {
			default: {
				options: {
					files: {
						'bootstrap.js': [[/define\(/, 'define(\'bootstrap\', ']],
						'jquery-ui.js': [[/define\(/, 'define(\'jquery-ui\', ']],
						'lodash.js': [[/define\(/, 'define(\'lodash\', ']],
						'notifyjs.js': [[/define\(/, 'define(\'notifyjs\', ']],
						'popperjs.js': [[/define\(/, 'define(\'@popperjs/core\', ']], //[/^/, `(function () {\r\n`], [/$/, `\r\n}());`]
					},
					folder: '.Build/tmp/',
					separator: '\n\n'
				}
			}
		},
		styles: {
			options: {
				folder: 'src/styles',
				dest: '.Build/tmp/styles.js',
				separator: '\n\n'
			}
		}
	})

	grunt.loadTasks('.Build/tasks')
	grunt.loadNpmTasks('grunt-jsdoc')

	grunt.registerTask('default', ['clean', 'make', 'replacements', 'minify', 'styles', 'concat', 'docs', 'alias']);
	grunt.registerTask('docs', ['doc', 'readme', 'jsdoc'])
	grunt.registerTask('major', ['rev:major'])
	grunt.registerTask('minor', ['rev:minor'])
	grunt.registerTask('patch', ['rev:patch'])

}
