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
import postcss from 'gulp-postcss';
import sugarss from 'sugarss';
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
	css: {
		dist: './dist/css/',
		bootstrap: './node_modules/bootstrap/dist/css/bootstrap.min.css',
		fontAwesome: './node_modules/font-awesome/css/font-awesome.min.css'
	},
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
		server.middleware = [{
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

gulp.task('server', () => {
	server();
});

gulp.task('jekyll:del', () => {
	return del(['./site/*.*']);
});

gulp.task('jekyll', () => {	
	const jekyll = spawn('jekyll', [ 'build' ]);

	var jekyllLogger = (buffer) => {
		buffer.toString()
		.split(/\n/)
		.forEach((message) => { return plugins.util.log('Jekyll: ' + message); });
	};
});

gulp.task('css:del', () => {
	return del(['./dist/css/*.*'])
});

gulp.task('css:postcss', () => {
	return gulp.src('./_postcss/rolspace.css')
		.pipe(postcss([
			atImport(),
			mixins(),
			cssvariables(),
			customMedia(),
			calc(),
			nested(),
			color()
		], { parser: sugarss }))
		.pipe(gulp.dest('./dist/css/'));
});

gulp.task('css', (callback) => {
	sequence('css:del', 'css:postcss', callback);
});

gulp.task('debug', (callback) => {
	currentTask = 'debug';
	sequence('css', 'jekyll', 'server', callback);

	if (argv.serve) {
		gulp.watch(['./_postcss/**/*'], ['css', 'jekyll']);
		gulp.watch(['./_includes/**/*.*', './_layouts/**/*.*',
			'./_posts/**/*', './about/**/*', './assets/**/*', './dist/**/*', './posts/**/*'], ['jekyll']);

		gulp.watch('site/**/*').on('change', browserSync.reload);
	}
});

gulp.task('release', (callback) => {
	currentTask = 'release';
	process.env.JEKYLL_ENV = 'production'

	sequence('envrelease', 'jekyll', callback);
});