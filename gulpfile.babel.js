'use strict';

import { create as loadBrowserSync } from 'browser-sync';
import loadPlugins from 'gulp-load-plugins';
import sequence from 'run-sequence';
import browserify from 'browserify';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import yargs from 'yargs';
import mkdirp from 'mkdirp';
import fs from 'fs';
import cp from 'child_process';
import del from 'del';
import postcss from 'gulp-postcss';
import sugarss from 'sugarss';
import autoprefixer from 'autoprefixer';
import atImport from 'postcss-import';
import cssvariables from 'postcss-css-variables';
import customMedia from 'postcss-custom-media';
import calc from 'postcss-calc';
import nested from 'postcss-nested';
import color from 'postcss-color-function';
import mixins from 'postcss-mixins';
import gulp from 'gulp';

const browserSync = loadBrowserSync();
const plugins = loadPlugins();
const spawn = cp.spawn;
const argv = yargs.argv;

let currentTask = '';

const config = {
	js: {
		dist: './dist/js/',
		bootstrap: './node_modules/bootstrap/dist/js/bootstrap.min.js',
		jquery: './node_modules/jquery/dist/jquery.min.js',
		jquerylazy: './node_modules/lazysizes/lazysizes.min.js'
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

const server = () => {
	let baseServer = {
		baseDir: 'site',
	};

	if (currentTask === 'release') {
		baseServer.middleware = [{
			route: '/dist',
			handle: (req, res, next) => {
				res.setHeader('Content-Encoding', 'gzip');

				next();
			}
		}]
	}

	browserSync.init({
		files: 'site/**',
		port: 4000,
		server: baseServer
	});
};

gulp.task('images', () => {
	return gulp.src('assets/**/*')
		.pipe(plugins.imagemin([
				plugins.imagemin.jpegtran({ progressive: true }),
				plugins.imagemin.optipng({ optimizationLevel: 5 })
			]))
		.pipe(gulp.dest('assets/'));
});

gulp.task('server', (callback) => {
	server();
	callback();
});

gulp.task('jekyll:del', () => {
	return del(['./site/*.*']);
});

gulp.task('jekyll', (callback) => {	
	const jekyll = spawn('jekyll', [ 'build' ]);

	var jekyllLogger = (buffer) => {
		buffer.toString()
		.split(/\n/)
		.forEach((message) => { return plugins.util.log('Jekyll: ' + message); });
	};

	callback();
});

gulp.task('watch', (callback) => {
	if (argv.serve) {
		gulp.watch(['./_postcss/**/*'], ['css', 'jekyll']);
		gulp.watch(['./_scripts/**/*'], ['js', 'jekyll']);
		gulp.watch(['./_includes/**/*.*', './_layouts/**/*.*',
			'./_posts/**/*', './about/**/*', './assets/**/*', './dist/**/*', './posts/**/*'], ['jekyll']);

		gulp.watch('./site/**/*').on('change', browserSync.reload);
		callback();
	}
});

// gulp.task('css:del', () => {
// 	return 
// });

gulp.task('css', () => {
	del(['./dist/css/*.*'])

	return gulp.src('./_postcss/rolspace.css')
		.pipe(postcss([
			atImport(),
			mixins(),
			cssvariables(),
			customMedia(),
			calc(),
			nested(),
			color(),
			autoprefixer()
		], { parser: sugarss }))
		.pipe(gulp.dest('./dist/css/'))
		.pipe(plugins.rename('rolspace.min.css'))
		.pipe(plugins.cleanCss())
		.pipe(plugins.gzip({
			append: false,
			skipGrowingFiles: true,
			gzipOptions: {
				level: 9
			}
		}))
		.pipe(gulp.dest('./dist/css'));
});

// gulp.task('css', (callback) => {
// 	sequence('css:del', 'css:postcss', callback);
// });

gulp.task('js:del', () => {
	return del(['dist/js/*.*']);
});

gulp.task('js:build', (callback) => {
	mkdirp.sync('./dist/js');

	const writeStream = fs.createWriteStream('./dist/js/rolspace.js');

	browserify(['./_scripts/main.js'])
		.transform('babelify')
		.bundle()
		.pipe(writeStream);

	writeStream.on('finish', () => {
		gulp.src('./dist/js/rolspace.js')
			.pipe(plugins.uglify())
			.pipe(plugins.rename('rolspace.min.js'))
			.pipe(plugins.gzip({
				append: false,
				skipGrowingFiles: true,
				gzipOptions: {
					level: 9
				}
			}))
			.pipe(gulp.dest('./dist/js/'))
			.on('end', () => {
				callback();
			});
	});
});

gulp.task('js', (callback) => {
	sequence('js:del', 'js:build', callback);
});

gulp.task('setenv', () => {
	return process.env.JEKYLL_ENV = 'production';
});

gulp.task('debug', (callback) => {
	currentTask = 'debug';

	if (argv.serve) {
		sequence('css', 'js', 'jekyll', 'server', 'watch', callback);
	}
	else {
		sequence('css', 'js', 'jekyll', callback);	
	}
});

gulp.task('release', (callback) => {
	currentTask = 'release';
	process.env.JEKYLL_ENV = 'production'

	if (argv.serve) {
		sequence('setenv', 'css', 'js', 'jekyll', 'server', 'watch', callback);
	}
	else {
		sequence('setenv', 'css', 'js', 'jekyll', callback);	
	}
});