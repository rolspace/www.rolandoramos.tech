module.exports = function(grunt) {
	require('grunt-task-loader')(grunt);
	require('time-grunt')(grunt);

	grunt.initConfig({
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
			tasks: ['uglify', 'shell:serve']
		}
	});

	grunt.registerTask('css-js',
		'Run tasks for css/js generation', ['uglify']);

	grunt.registerTask('demo',
		'Build the demo website', ['uglify', 'shell:build']);

	grunt.registerTask('host-demo',
		'Host the demo website using grunt-watch',['watch']);

	grunt.registerTask('release',
		'Build the release website', ['uglify', 'shell:build']);

	grunt.registerTask('host-release',
		'Host the release website', ['uglify','shell:serve']);
};