module.exports = function(grunt) {
	require('grunt-task-loader')(grunt);
	require('time-grunt')(grunt);

	grunt.initConfig({
		less: {
			options: {
				paths: ['_less/default']
			},
			main: {
				files: {
					'dist/css/rolspace.css': '_less/default/*'
				}
			}
		},
		autoprefixer: {
			main: {
				files: {
					'dist/css/rolspace.css': 'dist/css/rolspace.css'	
				}
			}
		},
		copy: {
			main: {
				files: [
					{
						expand: true,
						cwd: 'bower_components/bootstrap/dist/fonts/',
						src: ['*'],
						dest: 'dist/fonts/'
					},
					{
						expand: true,
						cwd: 'bower_components/font-awesome/fonts/',
						src: ['*'],
						dest: 'dist/fonts/'
					}
				],
			},
		},
		concat: {
			main: {
				files: [
					{ src: ['bower_components/bootstrap/dist/css/bootstrap.min.css',
					  		'bower_components/font-awesome/css/font-awesome.min.css',
				  			'dist/css/rolspace.css'],
					  dest: 'dist/css/rolspace.min.css'
					},
					{ src: ['bower_components/jquery/dist/jquery.min.js',
							'bower_components/bootstrap/dist/js/bootstrap.min.js',
							'_scripts/main.js',
							'_scripts/ui-setup.js'],
					  dest: 'dist/js/rolspace.js'
					}
				]
			}
		},
		cssmin: {
			options: {
				report: ['min', 'gzip']
			},
			main: {
				files: {
					'dist/css/rolspace.min.css': ['css/rolspace.min.css']
				}
			}
		},
		jshint: {
			main: ['gruntfile.js', 'js/rolspace.js']
		},
		uglify: {
			main: {
				files: {
					'dist/js/rolspace.min.js': ['dist/js/rolspace.js']
				}
			}
		},
		shell: {
			build: {
				command: 'jekyll build --config _config.yml --force'
			},
			serve: {
				command: 'jekyll serve --config _config.yml --force'
			}
		},
		watch: {
			options: {
				atBegin: true,
				interrupt: true
			},
			files: ['_less/*.*', '_assets/*.*', '_includes/*.*', '_scripts/*.*', 'gruntfile.js',
					'_layouts/*.*', '_posts/*.*', 'about/*.*', 'read/*.*', '404.html', 'index.html'],
			tasks: ['less', 'autoprefixer', 'copy', 'concat', 'jshint', 'uglify', 'shell:serve']
		}
	});

	grunt.registerTask('css-js',
		'Run tasks for css/js generation', ['less', 'autoprefixer', 'copy', 'concat', 'cssmin', 'jshint', 'uglify']);

	grunt.registerTask('demo',
		'Build the demo website', ['less','autoprefixer','copy','concat','jshint', 'uglify', 'shell:build']);

	grunt.registerTask('host-demo',
		'Host the demo website using grunt-watch',['watch']);

	grunt.registerTask('release',
		'Build the release website', ['less','autoprefixer','copy','concat','cssmin','jshint', 'uglify', 'shell:build']);

	grunt.registerTask('host-release',
		'Host the release website', ['less','autoprefixer','copy','concat','cssmin','jshint', 'uglify','shell:serve']);
};