module.exports = function(grunt) {
	require('grunt-task-loader')(grunt);

	grunt.initConfig({
		//Less: take files from _less folder and generate CSS result
		less: {
			options: {
				paths: ['_less']
			},
			main: {
				files: {
					'css/rolspace.css': '_less/rolspace.less'
				}
			}
		},
		//Copy: copy specific files required from bower components
		copy: {
			main: {
				files: [
					{
						src: 'bower_components/bootstrap/dist/css/bootstrap.min.css',
						dest: 'css/bootstrap.min.css'
					},
					{
						src: 'bower_components/bootstrap/dist/js/bootstrap.min.js',
						dest: 'js/bootstrap.min.js'
					},
					{
						src: 'bower_components/jquery/dist/jquery.min.js',
						dest: 'js/jquery.min.js'
					},
					{
						expand: true,
						cwd: 'bower_components/bootstrap/dist/fonts/',
						src: ['*'],
						dest: 'fonts/'
					},
				],
			},
		},
		concat: {
			options: {
				separator: ' '
			},
			main: {
				src: ['css/bootstrap.min.css', 'css/rolspace.css'],
				dest: 'css/rolspace.css'
			}
		},
		cssmin: {
			options: {
				report: ['min', 'gzip']
			},
			main: {
				files: {
					'css/rolspace.min.css': ['css/rolspace.css']
				}
			}
		},
		shell: {
			debug: {
				command: 'jekyll serve --config _config.debug.yml'
			},
			release: {
				command: 'jekyll serve --config _config.yml'
			}
		},
		watch: {
			options: {
				atBegin: true,
				interrupt: true
			},
			files: ['_less/*.less'],
			tasks: ['debug']
		}
	});

	grunt.registerTask('debug', ['less', 'copy', 'concat', 'shell:debug'])
	grunt.registerTask('release', ['less', 'copy', 'concat', 'cssmin', 'shell:release']);
}