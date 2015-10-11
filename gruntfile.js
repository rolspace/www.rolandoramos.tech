module.exports = function(grunt) {
	require('grunt-task-loader')(grunt);

	grunt.initConfig({
		//Less Config: take files from _less folder and generate CSS result
		less: {
			options: {
				paths: ['_less']
			},
			build: {
				files: {
					'css/temp.css': '_less/rolspace.less'
				}
			}
		},
		//Copy Config: copy specific files required from bower components
		copy: {
			build: {
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
			build: {
				src: ['css/bootstrap.min.css', 'css/temp.css'],
				dest: 'css/rolspace.css'
			}
		},
		cssmin: {
			options: {
				report: ['min', 'gzip']
			},
			build: {
				files: {
					'css/rolspace.min.css': ['css/rolspace.css']
				}
			}
		},
		shell: {
			options: {

			},
			demo: {
				command: 'jekyll serve --watch --config _config.demo.yml'
			},
			release: {
				command: 'jekyll serve --watch --config _config.yml'
			}
		}

	});

	grunt.registerTask('demo', ['less', 'copy', 'concat', 'shell:demo']);
	grunt.registerTask('release', ['less', 'copy', 'concat', 'cssmin', 'shell:release']);
}