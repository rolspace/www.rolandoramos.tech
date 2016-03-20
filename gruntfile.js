module.exports = function(grunt) {
	require('grunt-task-loader')(grunt);
	require('time-grunt')(grunt);

	grunt.initConfig({
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
		autoprefixer: {
			main: {
				files: {
					'css/rolspace.css': 'css/rolspace.css'	
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
						dest: 'fonts/'
					},
					{
						expand: true,
						cwd: 'bower_components/font-awesome/fonts/',
						src: ['*'],
						dest: 'fonts/'
					}
				],
			},
		},
		concat: {
			main: {
				files: [
					{ src: ['bower_components/bootstrap/dist/css/bootstrap.min.css',
					  		'bower_components/font-awesome/css/font-awesome.min.css',
				  			'css/rolspace.css'],
					  dest: 'css/rolspace.css'
					},
					{ src: ['bower_components/jquery/dist/jquery.min.js',
							'bower_components/bootstrap/dist/js/bootstrap.min.js'],
					  dest: 'js/rolspace.min.js'
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
					'css/rolspace.min.css': ['css/rolspace.css']
				}
			}
		},
		shell: {
			build: {
				command: function(demo) {
					return 'jekyll build --config _config' + demo + '.yml --force';
				}
			},
			serve: {
				command: function(demo) {
					return 'jekyll serve --config _config' + demo + '.yml --force';
				}
			}
		},
		jshint: {
			main: 'gruntfile.js'
		},
		watch: {
			options: {
				atBegin: true,
				interrupt: true
			},
			files: ['_less/*.less', '_assets/*.*', '_includes/*.*', '_layouts/*.*',
					'_posts/*.*', 'about/*.*', 'read/*.*', 'index.html'],
			tasks: ['less', 'autoprefixer', 'copy', 'concat', 'jshint', 'shell:serve:.demo']
		}
	});

	grunt.registerTask('css-js',
		'Run tasks for css/js generation', ['less','autoprefixer','copy','concat','cssmin']);

	grunt.registerTask('demo',
		'Build the demo website', ['less','autoprefixer','copy','concat','jshint','shell:build:.demo']);

	grunt.registerTask('host-demo',
		'Host the demo website using grunt-watch',['watch']);

	grunt.registerTask('release',
		'Build the release website', ['less','autoprefixer','copy','concat','cssmin','jshint','shell:build:']);

	grunt.registerTask('host-release',
		'Host the release website', ['less','autoprefixer','copy','concat','cssmin','jshint','shell:serve:']);
};