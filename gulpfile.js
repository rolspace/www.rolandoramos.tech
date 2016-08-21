'use strict';

var runSequence = require('run-sequence');

var cleanCss = require('gulp-clean-css');
var sourceMaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var replace = require('gulp-replace');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var eslint = require('gulp-eslint');
var less = require('gulp-less');
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
			.pipe(concat('rolspace.css'))
			.pipe(gulp.dest('./dist/css'));
	},
	less: function() {
		return gulp.src(['./_less/default/*.less'])
			.pipe(less({
				filename: 'rolspace.css',
				paths: [ './_less/default/includes' ]
			}))
			.pipe(autoprefixer({
				browsers: ['last 2 versions']
			}))
			.pipe(gulp.dest('./dist/css/'));
	},
	minify: function(callback) {
		gulp.src(['./dist/css/rolspace.css'])
			.pipe(replace(/\/*# sourceMappingURL[^\n]*/g, ''))
			.pipe(sourceMaps.init())
			.pipe(cleanCss())
			.pipe(rename('rolspace.min.css'))
			.pipe(sourceMaps.write('./'))
			.pipe(gulp.dest('./dist/css/'));
		callback();
	}
};

var js = {
	concat: function() {
		return gulp.src([config.js.jquery, config.js.bootstrap, './_scripts/ui-setup.js', './_scripts/main.js'])
			.pipe(concat('rolspace.js'))
			.pipe(gulp.dest('./dist/js'));
	},
	lint: function(callback) {
		gulp.src(['./_scripts/rolspace.js', './gulpfile.js'])
			.pipe(eslint())
			.pipe(eslint.format())
			.pipe(eslint.failAfterError());
		callback();
	}
};

gulp.task('css:less', css.less);
gulp.task('css:concat', css.concat);
gulp.task('css:minify', css.minify);
gulp.task('css', function(callback) { runSequence('css:less', 'css:concat', 'css:minify', callback); });

gulp.task('js:concat', js.concat);
gulp.task('js:lint', js.lint);
gulp.task('js', function(callback) { runSequence('js:concat', 'js:lint', callback); });

gulp.task('dev', ['css']);
//gulp.task('prod');