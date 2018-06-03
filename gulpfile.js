// npm install --save-dev gulp gulp-concat gulp-clean-css gulp-uglify gulp-sourcemaps gulp-rename gulp-if gulp-changed gulp-cached gulp-imagemin gulp-tinypng-nokey gulp-tinypng-compress
const gulp = require('gulp');
const concat = require('gulp-concat');
const cleancss = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
const tinypng = require('gulp-tinypng-compress');
const tinypngnokey = require('gulp-tinypng-nokey');
const sourcemaps = require('gulp-sourcemaps');
const rename = require('gulp-rename');
const gulpif = require('gulp-if');
const changed = require('gulp-changed');
const cached = require('gulp-cached');

let isWatchingTask = false;

const siteId = 'sgp';
const templateId = '4';
const libStylePath = './WebContent/' + siteId + '/site_' + templateId + '/app/site/styles/';
const libScriptPath = './WebContent/' + siteId + '/site_' + templateId + '/app/site/scripts/';
const templateStylePath = './WebContent/' + siteId + '/site_' + templateId + '/styles/';
const templateScriptPath = './WebContent/' + siteId + '/site_' + templateId + '/scripts/';
const templateImagePath = './WebContent/' + siteId + '/site_' + templateId + '/images/';
const customStylePath = './WebContent/' + siteId + '/custom/styles/';
const customScriptPath = './WebContent/' + siteId + '/custom/scripts/';
const customImagePath = './WebContent/' + siteId + '/custom/images/';

let allTasks = [
	{
		// ["modal.css"] => "lib.min.css"
		name: 'minify-lib-css',
		src: [libStylePath + 'modal.css'],
		fullName: 'lib.min.css',
		dest: libStylePath,
		type: 'css',
		isWatching: isWatchingTask
	}, {
		// ["bootstrap.css", "burgermenu.css",  "sgp.css"] => "custom.min.css"
		name: 'minify-custom-css',
		src: [customStylePath + 'bootstrap.css', customStylePath + 'burgermenu.css', customStylePath + 'sgp.css',
			customStylePath + 'swc.css'],
		fullName: 'custom.min.css',
		dest: customStylePath,
		type: 'css',
		isWatching: isWatchingTask
	}, {
		// ["modal-theme.css", "master.css", "common.css"] => "master.min.css"
		name: 'minify-master-css',
		src: [templateStylePath + 'modal-theme.css', templateStylePath + 'master.css', templateStylePath + 'common.css'],
		fullName: 'master.min.css',
		dest: templateStylePath,
		type: 'css',
		isWatching: isWatchingTask
	}, {
		// "events.css" => "events.min.css"
		name: 'minify-events-css',
		src: templateStylePath + 'events.css',
		fullName: 'events.min.css',
		dest: templateStylePath,
		type: 'css',
		isWatching: isWatchingTask
	}, {
		// "category.css" => "category.min.css"
		name: 'minify-category-css',
		src: templateStylePath + 'category.css',
		fullName: 'category.min.css',
		dest: templateStylePath,
		type: 'css',
		isWatching: isWatchingTask
	}, {
		// "highlights.css" => "highlights.min.css"
		name: 'minify-highlights-css',
		src: templateStylePath + 'highlights.css',
		fullName: 'highlights.min.css',
		dest: templateStylePath,
		type: 'css',
		isWatching: isWatchingTask
	}, {
		// ["master.css", "common.css", "signin.css"] => "signin.min.css"
		name: 'minify-signin-css',
		src: [templateStylePath + 'master.css', templateStylePath + 'common.css', templateStylePath + 'signin.css'],
		fullName: 'signin.min.css',
		dest: templateStylePath,
		type: 'css',
		isWatching: isWatchingTask
	}, {
		// "packages.css" => "packages.min.css"
		name: 'minify-packages-css',
		src: templateStylePath + 'packages.css',
		fullName: 'packages.min.css',
		dest: templateStylePath,
		type: 'css',
		isWatching: isWatchingTask
	}, {
		// "dl.css" => "dl.min.css"
		name: 'minify-dl-css',
		src: templateStylePath + 'dl.css',
		fullName: 'dl.min.css',
		dest: templateStylePath,
		type: 'css',
		isWatching: isWatchingTask
	}, {
		// "video.css" => "video.min.css"
		name: 'minify-video-css',
		src: templateStylePath + 'video.css',
		fullName: 'video.min.css',
		dest: templateStylePath,
		type: 'css',
		isWatching: isWatchingTask
	}, {
		// ["libs/jquery-1.10.2.min.js", "neu.js", "modal.js", "countdown.js"] => "lib.min.js"
		name: 'minify-lib-js',
		src: [libScriptPath + 'libs/jquery-1.10.2.min.js', libScriptPath + 'neu.js', libScriptPath + 'modal.js'],
		fullName: 'lib.min.js',
		dest: libScriptPath,
		type: 'js',
		isWatching: isWatchingTask
	}, {
		// ["jquery.prettydropdowns.js", "main.js"] => "custom.min.js"
		name: 'minfiy-custom-js',
		src: [customScriptPath + 'jquery.prettydropdowns.js', customScriptPath + 'main.js'],
		fullName: 'custom.min.js',
		dest: customScriptPath,
		type: 'js',
		isWatching: isWatchingTask
	}, {
		// "master.js" => "master.min.js"
		name: 'minify-master-js',
		src: [templateScriptPath + 'master.js'],
		fullName: 'master.min.js',
		dest: templateScriptPath,
		type: 'js',
		isWatching: isWatchingTask
	}, {
		// "category.js" => "category.min.js"
		name: 'minify-category-js',
		src: templateScriptPath + 'category.js',
		fullName: 'category.min.js',
		dest: templateScriptPath,
		type: 'js',
		isWatching: isWatchingTask
	}, {
		// "archives.js" => "archives.min.js"
		name: 'minify-archives-js',
		src: templateScriptPath + 'archives.js',
		fullName: 'archives.min.js',
		dest: templateScriptPath,
		type: 'js',
		isWatching: isWatchingTask
	}, {
		// "highlights.js" => "highlights.min.js"
		name: 'minify-highlights-js',
		src: templateScriptPath + 'highlights.js',
		fullName: 'highlights.min.js',
		dest: templateScriptPath,
		type: 'js',
		isWatching: isWatchingTask
		// }, {
		// 	// "site_4/images/*.[jpg,png,svg]" => "site_4/images/min/*.[jpg,png,svg]"
		// 	name: 'minify-template-image',
		// 	src: templateImagePath + '*',
		// 	fullName: '*',
		// 	dest: templateImagePath.slice(0, -1),
		// 	type: 'image',
		// 	isWatching: isWatchingTask
	}];

allTasks.forEach(function (taskInfo) {
	minifyFiles(taskInfo);
});

gulp.task('default', allTasks.map((taskItem) => taskItem.name), function () {
	console.log('All gulp tasks done!');
});

function minifyFiles(taskInfo)
{
	let isSrcArray = Array.isArray(taskInfo.src);
	let isCSS = taskInfo.type === 'css';
	let isJS = taskInfo.type === 'js';
	let isImage = taskInfo.type === 'image';
	let isCSSJSArray = isSrcArray && (isCSS || isJS);
	let isCSSJSSingle = !isSrcArray && (isCSS || isJS);

	gulp.task('minify-' + taskInfo.name, function () {
		gulp.src(taskInfo.src)
		// .pipe(gulpif(taskInfo.isWatching && !isImage, cached(taskInfo.name + 'ing')))
		// .pipe(gulpif(!taskInfo.isWatching && !isImage, changed(taskInfo.dest)))
				.pipe(gulpif(!isImage, sourcemaps.init({loadMaps: true})))
				.pipe(gulpif(isCSSJSArray, concat(taskInfo.fullName)))
				.pipe(gulpif(isCSSJSSingle, rename(taskInfo.fullName)))
				.pipe(gulpif(isCSS, cleancss()))
				.pipe(gulpif(isJS, uglify()))
				.pipe(gulpif(isImage, imagemin([
					imagemin.gifsicle({interlaced: true}),
					imagemin.jpegtran({progressive: true}),
					imagemin.optipng({optimizationLevel: 5}),
					imagemin.svgo({
						plugins: [
							{removeViewBox: true},
							{cleanupIDs: false}
						]
					})
				])))
				.pipe(gulpif(isImage, tinypng({
					key: '2nesRHe5zmPyRzRyNTQPWvRtll0jQlzU',
					sameDest: taskInfo.src === (taskInfo.dest + '/'),
					sigFile: 'images/.tinypng-sigs',
					log: true
				})))
				.pipe(gulpif(isImage, tinypngnokey()))
				.pipe(gulpif(!isImage,
						sourcemaps.write('.', {
							includeContent: false,
							sourceRoot: '.'
						})
				))
				.pipe(gulp.dest(taskInfo.dest));
	});
	!isImage && gulp.task('watching-' + taskInfo.name, function () {
		gulp.watch(taskInfo.src, [taskInfo.name]);
	});
	gulp.task(taskInfo.name, ['minify-' + taskInfo.name].concat(taskInfo.isWatching ? ['watching-' + taskInfo.name] : []))
}