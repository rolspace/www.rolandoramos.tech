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
const spawn = cp.spawn;
const argv = yargs.argv;

let currentTask = '';
let isWatching = false;

const config = {
	css: {
		dist: './dist/css/',
		bootstrap: './node_modules/bootstrap/dist/css/bootstrap.min.css',
		fontAwesome: './node_modules/font-awesome/css/font-awesome.min.css'
	},
	js: {
		dist: './dist/js/',
		bootstrap: './node_modules/bootstrap/dist/js/bootstrap.min.js',
		jquery: './node_modules/jquery/dist/jquery.min.js'
	},
	gzip: {
		append: false,
		skipGrowingFiles: true,
		gzipOptions: {
			level: 9
		}
	},	
	newLine: '\r\n\r\n'
};

const css = {
	clean: () => {
		return del(['dist/css/**']);
	},
	concat: () => {
		return gulp.src([config.css.bootstrap, config.css.fontAwesome, './_less/v1/rolspace.css'])
			.pipe(plugins.replace(/\/*# sourceMappingURL[^\n]*/g, ''))
			.pipe(plugins.replace(/\.\.\/fonts/g, '/assets/fonts/v1'))
			.pipe(plugins.concat('rolspace.css', { newLine: config.newLine }))
			.pipe(gulp.dest('./dist/css/'));
	},
	gzip: (callback) => {
		gulp.src('./dist/css/rolspace.min.css')
			.pipe(plugins.gzip(config.gzip))
			.pipe(gulp.dest('./dist/css/'));
		callback();
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
			.pipe(gulp.dest('./_less/v1/'));
	},
	minify: () => {
		return gulp.src(['./dist/css/rolspace.css'])
			.pipe(plugins.sourcemaps.init({ loadMaps: false }))
			.pipe(plugins.cleanCss())
			.pipe(plugins.rename('rolspace.min.css'))
			.pipe(plugins.sourcemaps.write('./'))
			.pipe(gulp.dest('./dist/css/'));
	},
};

gulp.task('css:clean', css.clean);
gulp.task('css:gzip', css.gzip);
gulp.task('css:less', css.less);
gulp.task('css:concat', css.concat);
gulp.task('css:minify', css.minify);
gulp.task('css:debug', (callback) => { sequence('css:clean', 'css:less', 'css:concat', callback); });
gulp.task('css', (callback) => { sequence('css:debug', 'css:minify', 'css:gzip', callback); });

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
	gzip: (callback) => {
		gulp.src('./dist/js/rolspace.min.js')
			.pipe(plugins.gzip(config.gzip))
			.pipe(gulp.dest('./dist/js'));
		callback();
	},
	lint: () => {
		return gulp.src(['./temp/js/temp.js', './gulpfile.js'])
			.pipe(plugins.eslint())
			.pipe(plugins.eslint.format())
			.pipe(plugins.eslint.failAfterError());
	},
	minify: () => {
		return gulp.src(['./dist/js/rolspace.js'])
			.pipe(plugins.sourcemaps.init())
			.pipe(plugins.uglify())
			.pipe(plugins.rename('rolspace.min.js'))
			.pipe(plugins.sourcemaps.write('./'))
			.pipe(gulp.dest('./dist/js/'));
	}
};

gulp.task('js:babelify', js.babelify);
gulp.task('js:clean', js.clean);
gulp.task('js:concat', js.concat);
gulp.task('js:gzip', js.gzip);
gulp.task('js:lint', js.lint);
gulp.task('js:minify', js.minify);
gulp.task('js:debug', (callback) => { sequence('js:clean', 'js:babelify', 'js:lint', 'js:concat', callback) });
gulp.task('js', (callback) => { sequence('js:debug', 'js:minify', 'js:gzip', callback); });

const images = gulp.task('images', () => {
	return gulp.src('assets/**/*.jpg')
		.pipe(plugins.imagemin([plugins.imagemin.jpegtran({ progressive: true })]))
		.pipe(gulp.dest('assets/'));
});

const startServer = () => {
	browserSync.init({
		files: 'site/**',
		port: 4000,
		server: {
			baseDir: 'site'
		}
	});

	isWatching = true;

	//only use the watch if we are on debug mode
	if (currentTask === 'debug') {
		gulp.watch('./_less/v1/*.less', ['css:debug']);
		gulp.watch('./_scripts/v1/*.js', ['js:debug']);
		gulp.watch(['./_includes/**/*.*', './_layouts/**/*.*',
			'./_posts/**/*', './assets/**/*', './about/**/*', './dist/**/*', './posts/**/*'], ['jekyll']);
	}
};

gulp.task('jekyll', (callback) => {
	del(['site/**']);
	const jekyll = spawn('jekyll', [ 'build' ]);

	jekyll.on('exit', () => {
		//if the serve flag is active and the watcher has started,
		//then do not start the dev server
		if (argv.serve && !isWatching) {
			startServer();
		}
	});

	var jekyllLogger = (buffer) => {
		buffer.toString()
		.split(/\n/)
		.forEach((message) => { return plugins.util.log('Jekyll: ' + message); });
	};

	callback();
});

gulp.task('server', (callback) => {
	startServer();
	callback();
});

gulp.task('debug', (callback) => {
	currentTask = 'debug';
	sequence('css:debug', 'js:debug', 'jekyll', callback);
});

//export JEKYLL_ENV=production
gulp.task('release', (callback) => {
	currentTask = 'release';
	sequence('css', 'js', 'jekyll', callback);
});