'use strict'

module.exports = function(grunt) {

	grunt.initConfig({
		clean: {
			options: {
				paths: [
					'.Build/tmp'
				]
			}
		},
		concat: {
			all: {
				files: {
					'index.js': [
							'src/config.js',
							'.Build/tmp/requirejs.min.js',
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
		make: {
			all: {
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
		replacements: {
			all: {
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
	grunt.registerTask('all', ['clean', 'make', 'replacements', 'minify', 'styles', 'concat']);

}
