'use strict';

import { create as loadBrowserSync } from 'browser-sync';
import loadPlugins from 'gulp-load-plugins';
import sequence from 'run-sequence';
import browserify from 'browserify';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import yargs from 'yargs';
import mkdirp from 'mkdirp';
import { stream } from 'critical';
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

	if (currentTask === 'runprod') {
		baseServer.middleware = [{
			route: '/dist' ,
			handle: (req, res, next) => {
				res.setHeader('Content-Encoding', 'gzip');

				next();
			}
		},
		{
			route: '/' ,
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

gulp.task('css', (callback) => {
	del(['./dist/css/*.*'])
	.then(() => {
		gulp.src('./_postcss/rolspace.css')
			.pipe(postcss([
				atImport(),
				mixins(),
				nested(),
				customMedia(),
				cssvariables(),
				calc(),
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
			.pipe(gulp.dest('./dist/css/'))
			.on('end', () => {
				callback();
			});
	});
});

gulp.task('js', (callback) => {
	del(['./dist/js/*.*']).then(() => {
		mkdirp.sync('dist/js');

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
});

gulp.task('critical', () => {
	return gulp.src('./site/index.html')
		.pipe(stream({
			base: 'site/',
			inline: true,
			minify: true,
			css: [ 'dist/css/rolspace.css' ],
			ignore: [ '@font-face' ],
			penthouse: {
				strict: true
			}
		}))
		.on('error', function(err) { plugins.util.log(plugins.util.colors.red(err.message)); })
		.pipe(gulp.dest('./site/'))
})

gulp.task('html', () => {
	return gulp.src('./site/index.html')
		.pipe(plugins.gzip({
			append: false,
			skipGrowingFiles: true,
			gzipOptions: {
				level: 9
			}
		}))
		.pipe(gulp.dest('./site/'))
})

gulp.task('images', () => {
	return gulp.src('assets/**/*')
		.pipe(plugins.imagemin([
			plugins.imagemin.jpegtran({ progressive: true }),
			plugins.imagemin.optipng({ optimizationLevel: 5 })
		]))
		.pipe(gulp.dest('assets/'));
});

gulp.task('jekyll', (callback) => {
	const jekyll = spawn('jekyll', [ 'build' ]);

	var jekyllLogger = (buffer) => {
		buffer.toString()
		.split(/\n/)
		.forEach((message) => { return plugins.util.log('Jekyll: ' + message); });
	};

	jekyll.on('exit', () => {
		callback();
	});
});

gulp.task('server', (callback) => {
	server();
	callback();
});

gulp.task('watch', (callback) => {
	gulp.watch(['./_postcss/**/*'], ['css', 'jekyll']);
	gulp.watch(['./_scripts/**/*'], ['js', 'jekyll']);
	gulp.watch(['./index.html', './_includes/**/*.*', './_layouts/**/*.*',
		'./_posts/**/*', './about/**/*', './assets/**/*', './dist/**/*', './posts/**/*'], ['jekyll']);

	gulp.watch('./site/**/*').on('change', browserSync.reload);
	callback();
});

gulp.task('build', callback => {
	sequence('css', 'js', 'jekyll', 'critical', callback);
});

gulp.task('rundev', (callback) => {
	del(['./site/*.*'])
	.then(() => {
		currentTask = 'debug';
		sequence('build', 'server', 'watch', callback);
	});
});

gulp.task('setprod', () => {
	return process.env.JEKYLL_ENV = 'production';
});

gulp.task('runprod', (callback) => {
	del(['./site/*.*'])
	.then(() => {
		currentTask = 'runprod';
		sequence('setprod', 'build', 'html', 'server', 'watch', callback);
	});
});