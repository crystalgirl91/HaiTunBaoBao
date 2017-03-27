'use strict'

let gulp = require('gulp')

gulp.task('clear', cb => {
	return gulp.src(['tmp', 'built'])
		.pipe(require('gulp-clean')())
})

gulp.task('vendor', cb => {
	return gulp.src([
		'node_modules/jquery/dist/jquery.min.js',
		'node_modules/bootstrap/dist/js/bootstrap.min.js',
		'node_modules/angular/angular.min.js',
		'node_modules/angular-animate/angular-animate.min.js'
	]).pipe(gulp.dest('built/vendor'))
})

gulp.task('html', cb => {
	return gulp.src('src/**/*.html')
		.pipe(gulp.dest('built'))
})


gulp.task('default', ['html'])