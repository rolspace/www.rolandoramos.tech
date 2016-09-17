'use strict';

var browserSync = require('browser-sync').create();
var spawn = require('child_process').spawn;
var del = require('del');
var sequence = require('run-sequence');
var plugins = require('gulp-load-plugins')();
var gulp = require('gulp');

var config = {
	css: {
		dist: './dist/css/',
		bootstrap: './bower_components/bootstrap/dist/css/bootstrap.min.css',
		fontAwesome: './bower_components/font-awesome/css/font-awesome.min.css'
	},
	js: {
		dist: './dist/js/',
		bootstrap: './bower_components/bootstrap/dist/js/bootstrap.min.js',
		jquery: './bower_components/jquery/dist/jquery.min.js'
	},
	newLine: '\r\n\r\n'
};

var css = {
	clean: function () {
		return del([
				'_less/default/rolspace.css',
				'dist/css/**'
			]);
	},
	concat: function() {
		return gulp.src([config.css.bootstrap, config.css.fontAwesome, './_less/default/rolspace.css'])
			.pipe(plugins.sourcemaps.init())
			.pipe(plugins.replace(/\/*# sourceMappingURL[^\n]*/g, ''))
			.pipe(plugins.replace(/\.\.\/fonts/g, '/assets/fonts'))
			.pipe(plugins.concat('rolspace.css', { newLine: config.newLine }))
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
			.pipe(gulp.dest('./_less/default/'));
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

gulp.task('css:clean', css.clean);
gulp.task('css:less', css.less);
gulp.task('css:concat', css.concat);
gulp.task('css:minify', css.minify);
gulp.task('css', function(callback) { sequence('css:clean', 'css:less', 'css:concat', 'css:minify', callback); });

var js = {
	clean: function() {
		return del(['dist/js/**']);
	},
	concat: function() {
		return gulp.src([config.js.jquery, config.js.bootstrap, './_scripts/ui-setup.js', './_scripts/main.js'])
			.pipe(plugins.sourcemaps.init())
			.pipe(plugins.concat('rolspace.js', { newLine: config.newLine }))
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

gulp.task('js:clean', js.clean);
gulp.task('js:concat', js.concat);
gulp.task('js:lint', js.lint);
gulp.task('js:minify', js.minify);
gulp.task('js', function(callback) { sequence('js:clean', 'js:concat', 'js:lint', 'js:minify', callback); });

gulp.task('clean', null);

gulp.task('jekyll', function(callback) {
	var jekyll = spawn('jekyll', [ 'build', '--watch' ]);

	var jekyllLogger = function(buffer) {
		buffer.toString()
			.split(/\n/)
			.forEach(function(message) { return plugins.util.log('Jekyll: ' + message); });
	};

	jekyll.stdout.on('data', jekyllLogger);
	jekyll.stderr.on('data', jekyllLogger);

	callback();
});

gulp.task('sync', function(callback) {
	browserSync.init({
		files: '_site/**',
		port: 4000,
		server: {
			baseDir: '_site'
		}
	});
	gulp.watch('./_less/default/*.less', ['css']);
	gulp.watch('./_scripts/*.js', ['js']);
	callback();
});

gulp.task('dev', function(callback) { sequence('css', 'js', 'jekyll', 'sync', callback); });