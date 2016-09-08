'use strict';

var spawn = require('child_process').spawn;

var sequence = require('run-sequence');
var plugins = require('gulp-load-plugins')();
var gulp = require('gulp');

var config = {
	css: {
		bootstrap: './bower_components/bootstrap/dist/css/bootstrap.min.css',
		fontAwesome: './bower_components/font-awesome/css/font-awesome.min.css'
	},
	js: {
		jquery: 'bower_components/jquery/dist/jquery.min.js',
		bootstrap: 'bower_components/bootstrap/dist/js/bootstrap.min.js'
	}
};

var css = {
	concat: function() {
		return gulp.src([config.css.bootstrap, config.css.fontAwesome, './dist/css/rolspace.css'])
			.pipe(plugins.replace(/\/*# sourceMappingURL[^\n]*/g, ''))
			.pipe(plugins.sourcemaps.init())
			.pipe(plugins.concat('rolspace.css'))
			.pipe(plugins.sourcemaps.write('./'))
			.pipe(gulp.dest('./dist/css/'));
	},
	less: function() {
		return gulp.src(['./_less/default/*.less'])
			.pipe(plugins.less({
				filename: 'rolspace.css',
				paths: [ './_less/default/includes' ]
			}))
			.pipe(plugins.autoprefixer({
				browsers: ['last 2 versions']
			}))
			.pipe(gulp.dest('./dist/css/'));
	},
	minify: function(callback) {
		gulp.src(['./dist/css/rolspace.css'])
			.pipe(plugins.sourcemaps.init())
			.pipe(plugins.cleanCss())
			.pipe(plugins.rename('rolspace.min.css'))
			.pipe(plugins.sourcemaps.write('./'))
			.pipe(gulp.dest('./dist/css/'));
		callback();
	},
};

gulp.task('css:concat', css.concat);
gulp.task('css:less', css.less);
gulp.task('css:minify', css.minify);
gulp.task('css', function(callback) { sequence('css:concat', 'css:less', 'css:minify', callback); });

var js = {
	concat: function() {
		return gulp.src([config.js.jquery, config.js.bootstrap, './_scripts/ui-setup.js', './_scripts/main.js'])
			.pipe(plugins.sourcemaps.init())
			.pipe(plugins.concat('rolspace.js'))
			.pipe(plugins.sourcemaps.write('./'))
			.pipe(gulp.dest('./dist/js/'));
	},
	lint: function() {
		return gulp.src(['./_scripts/rolspace.js', './gulpfile.js'])
			.pipe(plugins.eslint())
			.pipe(plugins.eslint.format())
			.pipe(plugins.eslint.failAfterError());
	},
	minify: function(callback) {
		gulp.src(['./dist/js/rolspace.js'])
			.pipe(plugins.sourcemaps.init())
			.pipe(plugins.uglify())
			.pipe(plugins.rename('rolspace.min.js'))
			.pipe(plugins.sourcemaps.write('./'))
			.pipe(gulp.dest('./dist/js/'));
		callback();
	}
};

gulp.task('jekyll', function() {
	var jekyll = spawn('jekyll', [ 'serve' ]);
gulp.task('js:concat', js.concat);
gulp.task('js:lint', js.lint);
gulp.task('js:minify', js.minify);
gulp.task('js', function(callback) { sequence('js:concat', 'js:lint', 'js:minify', callback); });


	var jekyllLogger = function(buffer) {
		buffer.toString()
			.split(/\n/)
			.forEach(function(message) { return plugins.util.log('Jekyll: ' + message); });
	}

	jekyll.stdout.on('data', jekyllLogger);
});


gulp.task('clean', null);

gulp.task('dev', ['css', 'js']);
//gulp.task('prod');