var less = require('gulp-less');
var gulp = require('gulp');

var css = {
	less: function() {
		return gulp.src(['./_less/default/rolspace.less']).
			pipe(less({
				filename: 'rolspace.css',
				paths: [ './less/default' ]
			})).
			pipe(gulp.dest('./dist/css/'));
	}
}

gulp.task('demo', function() {
	css.less();
});