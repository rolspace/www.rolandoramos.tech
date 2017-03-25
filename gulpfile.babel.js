'use strict';

import { create as loadBrowserSync } from 'browser-sync';
import loadPlugins from 'gulp-load-plugins';
import sequence from 'run-sequence';
import browserify from 'browserify';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import yargs from 'yargs';
import cp from 'child_process';
import del from 'del';
import gulp from 'gulp';

const browserSync = loadBrowserSync();
const plugins = loadPlugins();
const child = cp.spawn;
const argv = yargs.argv;

const config = {
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

const images = gulp.task('images', () => {
	return gulp.src('assets/**/*.jpg')
		.pipe(plugins.imagemin([plugins.imagemin.jpegtran({ progressive: true })]))
		.pipe(gulp.dest('assets/'));
});

const css = {
	clean: () => {
		return del(['dist/css/**']);
	},
	concat: () => {
		return gulp.src([config.css.bootstrap, config.css.fontAwesome, './_temp/css/rolspace.css'])
			.pipe(plugins.replace(/\/*# sourceMappingURL[^\n]*/g, ''))
			.pipe(plugins.sourcemaps.init({ loadMaps: true }))
			.pipe(plugins.replace(/\.\.\/fonts/g, '/assets/fonts/v1'))
			.pipe(plugins.concat('rolspace.css', { newLine: config.newLine }))
			.pipe(plugins.sourcemaps.write('./'))
			.pipe(gulp.dest('./dist/css/'));
	},
	less: () => {
		return gulp.src(['./_less/v1/*.less'])
			.pipe(plugins.less({
				filename: 'rolspace.css',
				paths: [ './_less/v1/includes' ]
			}))
			.pipe(plugins.autoprefixer({
				browsers: ['last 2 versions']
			}))
			.pipe(gulp.dest('./_temp/css/'));
	},
	minify: (callback) => {
		gulp.src(['./dist/css/rolspace.css'])
			.pipe(plugins.sourcemaps.init({ loadMaps: true }))
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
gulp.task('css', (callback) => { sequence('css:clean', 'css:less', 'css:concat', 'css:minify', callback); });

const js = {
	babelify: () => {
		gulp.src(['./_scripts/v1/setup.js', './_scripts/v1/main.js'])
			.pipe(plugins.babel())
			.pipe(gulp.dest('./_temp/js'));
		return browserify('./_temp/js/main.js')
			.bundle()
			.pipe(source('temp.js'))
			.pipe(gulp.dest('./_temp/js'));
	},
	clean: () => {
		return del(['dist/js/**']);
	},
	concat: () => {
		return gulp.src([config.js.jquery, config.js.bootstrap, './_temp/js/temp.js'])
			.pipe(plugins.sourcemaps.init())
			.pipe(plugins.babel())
			.pipe(plugins.concat('rolspace.js', { newLine: config.newLine }))
			.pipe(plugins.sourcemaps.write('./'))
			.pipe(gulp.dest('./dist/js/'));
	},
	lint: () => {
		return gulp.src(['./temp/js/temp.js', './gulpfile.js'])
			.pipe(plugins.eslint())
			.pipe(plugins.eslint.format())
			.pipe(plugins.eslint.failAfterError());
	},
	minify: (callback) => {
		gulp.src(['./dist/js/rolspace.js'])
			.pipe(plugins.sourcemaps.init())
			.pipe(plugins.uglify())
			.pipe(plugins.rename('rolspace.min.js'))
			.pipe(plugins.sourcemaps.write('./'))
			.pipe(gulp.dest('./dist/js/'));
		callback();
	}
};

gulp.task('js:babelify', js.babelify);
gulp.task('js:clean', js.clean);
gulp.task('js:concat', js.concat);
gulp.task('js:lint', js.lint);
gulp.task('js:minify', js.minify);
gulp.task('js', (callback) => { sequence('js:clean', 'js:babelify', 'js:lint', 'js:concat', 'js:minify', callback); });

const startServer = () => {
	setTimeout(() => {
		browserSync.init({
			files: 'site/**',
			port: 4000,
			server: {
				baseDir: 'site'
			}
		});
		gulp.watch('./_less/v1/*.less', ['css']);
		gulp.watch('./_scripts/v1/*.js', ['js']);
	}, 3000);
};

gulp.task('jekyll', (callback) => {
	del(['site/**']);
	setTimeout(() => {
		var jekyll = child('jekyll', [ 'build' ]);

		var jekyllLogger = (buffer) => {
			buffer.toString()
			.split(/\n/)
			.forEach((message) => { return plugins.util.log('Jekyll: ' + message); });
		};
	}, 2000);

	if (argv.serve) {
		startServer();
	}

	callback();
});

gulp.task('server', (callback) => {
	startServer();
	callback();
});

gulp.task('debug', (callback) => { sequence('css', 'js', 'jekyll', callback); });
gulp.task('release', ['jekyll']);