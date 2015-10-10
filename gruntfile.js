module.exports = function(grunt) {
	grunt.initConfig({
		//Less Config: take files from _less folder and generate CSS result
		less: {
			options: {
				paths: ['_less']
			},
			//In dev mode do not concatenate or clean any of the files
			dev: {
				files: {
					'css/rolspace.css': '_less/rolspace.less'
				}
			},
			release: {
				options: {
					compress: true
				},
				files: {
					'css/rolspace.css': '_less/rolspace.less'
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
				src: ['css/bootstrap.min.css', 'css/rolspace.css'],
				dest: 'css/rolspace.min.css'
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-copy');

	grunt.registerTask('demo', ['less:dev', 'copy', 'concat']);
	grunt.registerTask('release', ['less:release', 'copy', 'concat']);
}