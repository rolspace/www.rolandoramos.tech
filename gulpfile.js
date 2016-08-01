var path = require('path');

var gless = require('gulp-less');
var gulp = require('gulp');

var css = {
	less: function() {

		return gulp.src(['./_less/default/rolspace.less'])
			.pipe(gless({
				filename: 'rolspace.css',
				paths: [ './_less/default/includes' ]
			}))
			.pipe(gulp.dest('./dist/css/'));
	}
};

gulp.task('css:less', css.less);

gulp.task('demo', ['css:less']);