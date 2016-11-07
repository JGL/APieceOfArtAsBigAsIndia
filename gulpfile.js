// Modules
var gulp = require('gulp');
var pug = require('gulp-pug');
var less = require('gulp-less');
var browserSync = require('browser-sync').create();
var source = require('vinyl-source-stream');
var browserify = require('browserify');

// Tasks
gulp.task('default', ['pug', 'less', 'browserify']);

gulp.task('pug', function(){
	return gulp.src( './src/pug/**/*.pug')
		.pipe( pug( {pretty: true}))
		.pipe( gulp.dest('./docs/'));
});

gulp.task('less', function(){
	return gulp.src( './src/less/**/*.less')
		.pipe( less())
		.pipe( gulp.dest('./docs/'));
});

gulp.task('browserify', function() {
	return browserify('./src/js/main.js')
	.bundle()
	//Pass desired output filename to vinyl-source-stream
	.pipe(source('build.js'))
	// Start piping stream to tasks!
	.pipe(gulp.dest('./docs/'));
});

// Watching
gulp.task('watch', function(){
	browserSync.init({
		port: 4000, //where is browser sync
		proxy: 'http://localhost:3000/', //what are we proxying?
		ui: {port: 4001}, //where is the UI
		browser: [] //empty array of browsers
	});

	gulp.watch('./src/pug/**/*.pug', [ 'pug'])
		.on('change', browserSync.reload);

	gulp.watch('./src/less/**/*.less', [ 'less'])
		.on('change', browserSync.reload);

	gulp.watch('./src/js/**/*.js', [ 'browserify'])
		.on('change', browserSync.reload);
});