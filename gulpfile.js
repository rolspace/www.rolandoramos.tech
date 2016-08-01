'use strict';

var path = require('path');

var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var less = require('gulp-less');
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
			.pipe(sourcemaps.init())
			.pipe(concat('rolspace.css'))
			.pipe(sourcemaps.write('./'))
			.pipe(gulp.dest('./dist/css'));
	},
	less: function() {
		return gulp.src(['./_less/default/*.less'])
			.pipe(less({
				filename: 'rolspace.css',
				paths: [ './_less/default/includes' ]
			}))
			.pipe(gulp.dest('./dist/css/'));
	}
};

gulp.task('css:less', css.less);
gulp.task('css:concat', ['css:less'], css.concat);

gulp.task('demo', ['css:concat']);