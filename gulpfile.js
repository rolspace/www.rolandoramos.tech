'use strict';

var path = require('path');
var runSequence = require('run-sequence');

var cleanCss = require('gulp-clean-css');
var sourceMaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var replace = require('gulp-replace');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var less = require('gulp-less');
var gzip = require('gulp-gzip');
var gulp = require('gulp');

var config = {
	css: {
		bootstrap: './bower_components/bootstrap/dist/css/bootstrap.min.css',
		fontAwesome: './bower_components/font-awesome/css/font-awesome.min.css'
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
	minify: function() {
		return gulp.src(['./dist/css/rolspace.css'])
			.pipe(replace(/\/*# sourceMappingURL[^\n]*/g, ''))
			.pipe(sourceMaps.init())
			.pipe(cleanCss())
			.pipe(rename('rolspace.min.css'))
			.pipe(sourceMaps.write('./'))
			.pipe(gulp.dest('./dist/css/'));
	}
};

gulp.task('css:less', css.less);
gulp.task('css:concat', css.concat);
gulp.task('css:minify', css.minify);

gulp.task('css', runSequence('css:less', 'css:concat', 'css:minify'));

gulp.task('dev', ['css']);
//gulp.task('prod');