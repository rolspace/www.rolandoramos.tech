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
import safe from 'postcss-safe-parser';
import atImport from 'postcss-import';
import cssvariables from 'postcss-css-variables';
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
	let server = {
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
		server: server
	});

	//only use the watch if we are on debug mode
	if (currentTask === 'debug' && !isWatching) {
		gulp.watch(['./_includes/**/*.*', './_layouts/**/*.*',
			'./_posts/**/*', './assets/**/*', './about/**/*', './dist/**/*', './posts/**/*'], ['jekyll']);

		isWatching = true;
	}
};

gulp.task('css:clean', () => {
	return del(['./dist/css/*.*'])
});

gulp.task('css:postcss', () => {
	return gulp.src('./_postcss/rolspace.css')
		.pipe(postcss([atImport(), cssvariables()], { parser: safe }))
		.pipe(gulp.dest('./dist/css/'));
});

gulp.task('css', (callback) => {
	sequence('css:clean', 'css:postcss', callback);
});

gulp.task('images', () => {
	return gulp.src('assets/**/*')
		.pipe(plugins.imagemin([
				plugins.imagemin.jpegtran({ progressive: true }),
				plugins.imagemin.optipng({ optimizationLevel: 5 })
			]))
		.pipe(gulp.dest('assets/'));
});

gulp.task('jekyll', () => {
	if (!isWatching) {
		del(['site/**']);
	}
	
	const jekyll = spawn('jekyll', [ 'build' ]);

	jekyll.on('exit', () => {
		//if the serve flag is active and the watcher has started,
		//then do not start the dev server
		if (argv.serve && !isWatching) {
			server();
		}
	});

	var jekyllLogger = (buffer) => {
		buffer.toString()
		.split(/\n/)
		.forEach((message) => { return plugins.util.log('Jekyll: ' + message); });
	};
});

gulp.task('server', () => {
	server();
});

gulp.task('debug', (callback) => {
	currentTask = 'debug';
	sequence('css', 'jekyll', callback);
});

gulp.task('release', (callback) => {
	currentTask = 'release';
	process.env.JEKYLL_ENV = 'production'

	sequence('envrelease', 'jekyll', callback);
});